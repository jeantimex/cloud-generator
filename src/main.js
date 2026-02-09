import { mat4 } from 'gl-matrix';

const shaderCode = `
struct Uniforms {
  modelViewProjectionMatrix : mat4x4<f32>,
  color : vec4<f32>,
};

@binding(0) @group(0) var<uniform> uniforms : Uniforms;

struct VertexOutput {
  @builtin(position) Position : vec4<f32>,
};

@vertex
fn vs_main(@location(0) position: vec4<f32>) -> VertexOutput {
  var output: VertexOutput;
  output.Position = uniforms.modelViewProjectionMatrix * position;
  return output;
}

@fragment
fn fs_main() -> @location(0) vec4<f32> {
  return uniforms.color;
}
`;

const volumeShaderCode = `
struct VolumeUniforms {
  inverseViewProjection : mat4x4<f32>,
  cameraPosition : vec3<f32>,
};

@binding(0) @group(0) var<uniform> volumeUniforms : VolumeUniforms;

struct VertexOutput {
  @builtin(position) Position : vec4<f32>,
  @location(0) ndc : vec2<f32>,
};

@vertex
fn vs_volume(@builtin(vertex_index) vertexIndex : u32) -> VertexOutput {
  // Full-screen quad from 6 vertices (2 triangles)
  var pos = array<vec2<f32>, 6>(
    vec2(-1.0, -1.0),
    vec2( 1.0, -1.0),
    vec2(-1.0,  1.0),
    vec2(-1.0,  1.0),
    vec2( 1.0, -1.0),
    vec2( 1.0,  1.0),
  );
  var output : VertexOutput;
  output.Position = vec4(pos[vertexIndex], 0.0, 1.0);
  output.ndc = pos[vertexIndex];
  return output;
}

fn intersectAABB(origin : vec3<f32>, dir : vec3<f32>, boxMin : vec3<f32>, boxMax : vec3<f32>) -> vec2<f32> {
  let invDir = 1.0 / dir;
  let t1 = (boxMin - origin) * invDir;
  let t2 = (boxMax - origin) * invDir;
  let tMin = min(t1, t2);
  let tMax = max(t1, t2);
  let tNear = max(max(tMin.x, tMin.y), tMin.z);
  let tFar = min(min(tMax.x, tMax.y), tMax.z);
  return vec2(tNear, tFar);
}

fn sampleDensity(p : vec3<f32>) -> f32 {
  // Sphere SDF at origin, radius 0.5
  let dist = length(p) - 0.5;
  // Soft edge: density transitions from 1 (inside) to 0 (outside) over ~0.2 range
  return smoothstep(0.1, -0.1, dist);
}

@fragment
fn fs_volume(@location(0) ndc : vec2<f32>) -> @location(0) vec4<f32> {
  // Unproject NDC to world-space ray
  let nearPoint = volumeUniforms.inverseViewProjection * vec4(ndc, -1.0, 1.0);
  let farPoint = volumeUniforms.inverseViewProjection * vec4(ndc, 1.0, 1.0);
  let nearWorld = nearPoint.xyz / nearPoint.w;
  let farWorld = farPoint.xyz / farPoint.w;

  let rayOrigin = volumeUniforms.cameraPosition;
  let rayDir = normalize(farWorld - nearWorld);

  // Intersect with [-1,1]^3 bounding box
  let boxMin = vec3(-1.0, -1.0, -1.0);
  let boxMax = vec3(1.0, 1.0, 1.0);
  let t = intersectAABB(rayOrigin, rayDir, boxMin, boxMax);

  if (t.x > t.y || t.y < 0.0) {
    // Ray misses the box
    return vec4(0.0, 0.0, 0.0, 0.0);
  }

  let tNear = max(t.x, 0.0);
  let tFar = t.y;

  // Raymarch through the volume
  let numSteps = 64;
  let stepSize = (tFar - tNear) / f32(numSteps);
  var transmittance = 1.0;
  let absorptionCoeff = 6.0;

  for (var i = 0; i < numSteps; i++) {
    let tCurrent = tNear + (f32(i) + 0.5) * stepSize;
    let samplePos = rayOrigin + rayDir * tCurrent;
    let density = sampleDensity(samplePos);

    if (density > 0.0) {
      // Beer's Law absorption
      transmittance *= exp(-density * absorptionCoeff * stepSize);
    }

    // Early exit when nearly fully opaque
    if (transmittance < 0.01) {
      transmittance = 0.0;
      break;
    }
  }

  let alpha = 1.0 - transmittance;
  return vec4(1.0, 1.0, 1.0, alpha);
}
`;

async function init() {
  const canvas = document.getElementById('webgpu-canvas');
  if (!navigator.gpu) {
    alert("WebGPU not supported on this browser.");
    return;
  }

  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    alert("No appropriate GPU adapter found.");
    return;
  }
  const device = await adapter.requestDevice();

  const context = canvas.getContext('webgpu');
  const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
  context.configure({
    device: device,
    format: canvasFormat,
    alphaMode: 'premultiplied',
  });

  // Cube vertices (x, y, z, w)
  const vertices = new Float32Array([
    -1.0, -1.0,  1.0, 1.0,
     1.0, -1.0,  1.0, 1.0,
     1.0,  1.0,  1.0, 1.0,
    -1.0,  1.0,  1.0, 1.0,
    -1.0, -1.0, -1.0, 1.0,
     1.0, -1.0, -1.0, 1.0,
     1.0,  1.0, -1.0, 1.0,
    -1.0,  1.0, -1.0, 1.0,
  ]);

  const vertexBuffer = device.createBuffer({
    size: vertices.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(vertexBuffer, 0, vertices);

  // Wireframe indices (pairs of vertices for lines)
  const indices = new Uint16Array([
    0, 1, 1, 2, 2, 3, 3, 0, // Front face
    4, 5, 5, 6, 6, 7, 7, 4, // Back face
    0, 4, 1, 5, 2, 6, 3, 7  // Connecting edges
  ]);

  const indexBuffer = device.createBuffer({
    size: indices.byteLength,
    usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(indexBuffer, 0, indices);

  // Grid floor
  const gridLines = 20;
  const gridSize = 10;
  const gridVerticesArray = [];
  const gridIndicesArray = [];
  let gridIndex = 0;
  for (let i = 0; i <= gridLines; i++) {
    const pos = (i / gridLines) * gridSize - gridSize / 2;
    // Lines along X
    gridVerticesArray.push(-gridSize / 2, -1.0, pos, 1.0);
    gridVerticesArray.push(gridSize / 2, -1.0, pos, 1.0);
    gridIndicesArray.push(gridIndex++, gridIndex++);
    // Lines along Z
    gridVerticesArray.push(pos, -1.0, -gridSize / 2, 1.0);
    gridVerticesArray.push(pos, -1.0, gridSize / 2, 1.0);
    gridIndicesArray.push(gridIndex++, gridIndex++);
  }

  const gridVertices = new Float32Array(gridVerticesArray);
  const gridIndices = new Uint16Array(gridIndicesArray);

  const gridVertexBuffer = device.createBuffer({
    size: gridVertices.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(gridVertexBuffer, 0, gridVertices);

  const gridIndexBuffer = device.createBuffer({
    size: gridIndices.byteLength,
    usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(gridIndexBuffer, 0, gridIndices);

  const shaderModule = device.createShaderModule({
    code: shaderCode,
  });

  const pipeline = device.createRenderPipeline({
    layout: 'auto',
    vertex: {
      module: shaderModule,
      entryPoint: 'vs_main',
      buffers: [
        {
          arrayStride: 16,
          attributes: [
            {
              shaderLocation: 0,
              offset: 0,
              format: 'float32x4',
            },
          ],
        },
      ],
    },
    fragment: {
      module: shaderModule,
      entryPoint: 'fs_main',
      targets: [
        {
          format: canvasFormat,
        },
      ],
    },
    primitive: {
      topology: 'line-list',
    },
  });

  const createUniformBindGroup = () => {
    const buffer = device.createBuffer({
      size: 80, // mat4 (64) + vec4 (16)
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    const bindGroup = device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer } }],
    });
    return { buffer, bindGroup };
  };

  const cubeUniforms = createUniformBindGroup();
  const gridUniforms = createUniformBindGroup();

  // Volume raymarching pipeline
  const volumeShaderModule = device.createShaderModule({
    code: volumeShaderCode,
  });

  const volumePipeline = device.createRenderPipeline({
    layout: 'auto',
    vertex: {
      module: volumeShaderModule,
      entryPoint: 'vs_volume',
      buffers: [],
    },
    fragment: {
      module: volumeShaderModule,
      entryPoint: 'fs_volume',
      targets: [
        {
          format: canvasFormat,
          blend: {
            color: {
              srcFactor: 'src-alpha',
              dstFactor: 'one-minus-src-alpha',
              operation: 'add',
            },
            alpha: {
              srcFactor: 'one',
              dstFactor: 'one-minus-src-alpha',
              operation: 'add',
            },
          },
          writeMask: GPUColorWrite.ALL,
        },
      ],
    },
    primitive: {
      topology: 'triangle-list',
    },
  });

  // Volume uniform buffer: mat4 (64 bytes) + vec3 padded to vec4 (16 bytes) = 80 bytes
  const volumeUniformBuffer = device.createBuffer({
    size: 80,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const volumeBindGroup = device.createBindGroup({
    layout: volumePipeline.getBindGroupLayout(0),
    entries: [{ binding: 0, resource: { buffer: volumeUniformBuffer } }],
  });

  const viewProjectionMatrix = mat4.create();
  const inverseViewProjectionMatrix = mat4.create();

  const projectionMatrix = mat4.create();
  const viewMatrix = mat4.create();
  const modelViewProjectionMatrix = mat4.create();

  function render() {
    const aspect = canvas.clientWidth / canvas.clientHeight;
    mat4.perspective(projectionMatrix, (2 * Math.PI) / 5, aspect, 0.1, 100.0);
    
    // 45 degrees from top
    const distance = 6;
    const pos = distance * Math.cos(Math.PI / 4);
    mat4.lookAt(viewMatrix, [pos, distance, pos], [0, 0, 0], [0, 1, 0]);

    mat4.multiply(modelViewProjectionMatrix, projectionMatrix, viewMatrix);

    // Update Cube Uniforms
    device.queue.writeBuffer(cubeUniforms.buffer, 0, modelViewProjectionMatrix);
    device.queue.writeBuffer(cubeUniforms.buffer, 64, new Float32Array([0.0, 1.0, 0.0, 1.0]));

    // Update Grid Uniforms
    device.queue.writeBuffer(gridUniforms.buffer, 0, modelViewProjectionMatrix);
    device.queue.writeBuffer(gridUniforms.buffer, 64, new Float32Array([0.5, 0.5, 0.5, 1.0]));

    // Update Volume Uniforms
    mat4.multiply(viewProjectionMatrix, projectionMatrix, viewMatrix);
    mat4.invert(inverseViewProjectionMatrix, viewProjectionMatrix);
    device.queue.writeBuffer(volumeUniformBuffer, 0, inverseViewProjectionMatrix);
    const cameraPos = [pos, distance, pos];
    device.queue.writeBuffer(volumeUniformBuffer, 64, new Float32Array([cameraPos[0], cameraPos[1], cameraPos[2], 0.0]));

    const commandEncoder = device.createCommandEncoder();
    const textureView = context.getCurrentTexture().createView();

    const renderPassDescriptor = {
      colorAttachments: [
        {
          view: textureView,
          clearValue: { r: 0.1, g: 0.1, b: 0.1, a: 1.0 },
          loadOp: 'clear',
          storeOp: 'store',
        },
      ],
    };

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(pipeline);
    
    // Draw Grid
    passEncoder.setVertexBuffer(0, gridVertexBuffer);
    passEncoder.setIndexBuffer(gridIndexBuffer, 'uint16');
    passEncoder.setBindGroup(0, gridUniforms.bindGroup);
    passEncoder.drawIndexed(gridIndices.length);

    // Draw Cube
    passEncoder.setVertexBuffer(0, vertexBuffer);
    passEncoder.setIndexBuffer(indexBuffer, 'uint16');
    passEncoder.setBindGroup(0, cubeUniforms.bindGroup);
    passEncoder.drawIndexed(indices.length);

    // Draw Volume (raymarched fog)
    passEncoder.setPipeline(volumePipeline);
    passEncoder.setBindGroup(0, volumeBindGroup);
    passEncoder.draw(6);

    passEncoder.end();

    device.queue.submit([commandEncoder.finish()]);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
  });
  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;
}

init();