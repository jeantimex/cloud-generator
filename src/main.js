import { mat4 } from 'gl-matrix';
import GUI from 'lil-gui';

// Seeded PRNG (mulberry32)
function createRNG(seed) {
  return function() {
    seed |= 0;
    seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function replicateSpheres(baseSpheres, rng, options = {}) {
  const {
    replicationIterations = 2,
    childrenPerSphere = 4,
    keepProbability = 0.5,
    scaleMult = 0.55,
  } = options;

  const spheres = [...baseSpheres];

  let prevStart = 0;
  let prevCount = spheres.length / 4;

  for (let iter = 0; iter < replicationIterations; iter++) {
    const newStart = spheres.length;

    for (let i = 0; i < prevCount; i++) {
      const si = (prevStart + i) * 4;
      const px = spheres[si], py = spheres[si + 1], pz = spheres[si + 2], pr = spheres[si + 3];

      for (let c = 0; c < childrenPerSphere; c++) {
        if (rng() > keepProbability) continue;

        const u = rng() * 2 - 1;
        const theta = rng() * Math.PI * 2;
        const sinPhi = Math.sqrt(1 - u * u);

        const childRadius = pr * scaleMult;
        spheres.push(
          px + sinPhi * Math.cos(theta) * pr,
          py + sinPhi * Math.sin(theta) * pr,
          pz + u * pr,
          childRadius,
        );
      }
    }

    prevStart = newStart / 4;
    prevCount = (spheres.length - newStart) / 4;
  }

  return new Float32Array(spheres);
}

function generateCumulus(options = {}) {
  const {
    gridX = 4,
    gridZ = 4,
    pointSeparation = 0.25,
    flattenBottom = -0.3,
    seed = 42,
    replicationIterations = 2,
    childrenPerSphere = 4,
    keepProbability = 0.5,
    scaleMult = 0.55,
  } = options;

  const rng = createRNG(seed);
  const spheres = [];

  const halfX = (gridX - 1) * pointSeparation / 2;
  const halfZ = (gridZ - 1) * pointSeparation / 2;

  for (let ix = 0; ix < gridX; ix++) {
    for (let iz = 0; iz < gridZ; iz++) {
      let x = ix * pointSeparation - halfX + (rng() * 2 - 1) * pointSeparation;
      let y = (rng() * 2 - 1) * pointSeparation;
      let z = iz * pointSeparation - halfZ + (rng() * 2 - 1) * pointSeparation;

      if (y < flattenBottom) y = flattenBottom;

      const radius = pointSeparation * (0.90 + rng() * 0.52);
      spheres.push(x, y, z, radius);
    }
  }

  return replicateSpheres(spheres, rng, {
    replicationIterations, childrenPerSphere, keepProbability, scaleMult,
  });
}

function generateWispy(options = {}) {
  const {
    seed = 42,
    replicationIterations = 1,
    childrenPerSphere = 3,
    keepProbability = 0.6,
    scaleMult = 0.5,
  } = options;
  const rng = createRNG(seed);
  const spheres = [];

  // S-curve backbone control points
  const controlPoints = [
    [-0.8,  0.0,  0.0],
    [-0.5,  0.1,  0.15],
    [-0.2, -0.05, -0.1],
    [ 0.1,  0.1,  0.2],
    [ 0.3, -0.05, -0.05],
    [ 0.55, 0.05,  0.1],
    [ 0.8,  0.0,  -0.1],
  ];

  const numSpheres = 14;
  for (let i = 0; i < numSpheres; i++) {
    const t = i / (numSpheres - 1);
    // Interpolate along the polyline
    const segFloat = t * (controlPoints.length - 1);
    const seg = Math.min(Math.floor(segFloat), controlPoints.length - 2);
    const frac = segFloat - seg;
    const p0 = controlPoints[seg];
    const p1 = controlPoints[seg + 1];

    const x = p0[0] + (p1[0] - p0[0]) * frac + (rng() * 2 - 1) * 0.04;
    const y = p0[1] + (p1[1] - p0[1]) * frac + (rng() * 2 - 1) * 0.04;
    const z = p0[2] + (p1[2] - p0[2]) * frac + (rng() * 2 - 1) * 0.04;

    // Sine profile: thicker in middle, thinner at ends
    const radius = 0.12 + 0.14 * Math.sin(t * Math.PI);
    spheres.push(x, y, z, radius);
  }

  return replicateSpheres(spheres, rng, {
    replicationIterations, childrenPerSphere, keepProbability, scaleMult,
  });
}

function generateEllipsoid(options = {}) {
  const {
    seed = 42,
    replicationIterations = 1,
    childrenPerSphere = 3,
    keepProbability = 0.5,
    scaleMult = 0.5,
  } = options;
  const rng = createRNG(seed);
  const spheres = [];

  const rx = 0.7, ry = 0.5, rz = 0.6;
  const step = 0.2;

  for (let x = -rx; x <= rx; x += step) {
    for (let y = -ry; y <= ry; y += step) {
      for (let z = -rz; z <= rz; z += step) {
        const d = (x / rx) ** 2 + (y / ry) ** 2 + (z / rz) ** 2;
        if (d > 1.0) continue;

        // Radius proportional to distance from surface + jitter
        const distFromSurface = 1.0 - Math.sqrt(d);
        const radius = 0.08 + distFromSurface * 0.12 + rng() * 0.04;
        spheres.push(
          x + (rng() * 2 - 1) * 0.03,
          y + (rng() * 2 - 1) * 0.03,
          z + (rng() * 2 - 1) * 0.03,
          radius,
        );
      }
    }
  }

  return replicateSpheres(spheres, rng, {
    replicationIterations, childrenPerSphere, keepProbability, scaleMult,
  });
}

function computeBounds(sphereData, padding = 0.15) {
  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
  for (let i = 0; i < sphereData.length; i += 4) {
    const x = sphereData[i], y = sphereData[i + 1], z = sphereData[i + 2], r = sphereData[i + 3];
    minX = Math.min(minX, x - r); minY = Math.min(minY, y - r); minZ = Math.min(minZ, z - r);
    maxX = Math.max(maxX, x + r); maxY = Math.max(maxY, y + r); maxZ = Math.max(maxZ, z + r);
  }
  return {
    min: [minX - padding, minY - padding, minZ - padding],
    max: [maxX + padding, maxY + padding, maxZ + padding],
  };
}

function buildCubeVertices(bounds) {
  const [x0, y0, z0] = bounds.min;
  const [x1, y1, z1] = bounds.max;
  return new Float32Array([
    x0, y0, z1, 1.0,
    x1, y0, z1, 1.0,
    x1, y1, z1, 1.0,
    x0, y1, z1, 1.0,
    x0, y0, z0, 1.0,
    x1, y0, z0, 1.0,
    x1, y1, z0, 1.0,
    x0, y1, z0, 1.0,
  ]);
}

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
  sphereCount : u32,
  smoothness : f32,
  gradientBottom : f32,
  gradientTop : f32,
  gradientStrength : f32,
  boxMin : vec3<f32>,
  boxMax : vec3<f32>,
};

@binding(0) @group(0) var<uniform> volumeUniforms : VolumeUniforms;
@binding(1) @group(0) var<storage, read> spheres : array<vec4<f32>>;

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

fn sphereSDF(p : vec3<f32>, center : vec3<f32>, radius : f32) -> f32 {
  return length(p - center) - radius;
}

fn smin(a : f32, b : f32, k : f32) -> f32 {
  let h = max(k - abs(a - b), 0.0) / k;
  return min(a, b) - h * h * k * 0.25;
}

fn cloudSDF(p : vec3<f32>) -> f32 {
  let k = volumeUniforms.smoothness;
  var d = 1e10;
  for (var i = 0u; i < volumeUniforms.sphereCount; i++) {
    let s = spheres[i];
    let sd = sphereSDF(p, s.xyz, s.w);
    if (k > 0.0) {
      d = smin(d, sd, k);
    } else {
      d = min(d, sd);
    }
  }

  // Density gradient: erode the SDF at higher Y values
  let gStrength = volumeUniforms.gradientStrength;
  if (gStrength > 0.0) {
    let heightFrac = smoothstep(volumeUniforms.gradientBottom, volumeUniforms.gradientTop, p.y);
    d += heightFrac * gStrength;
  }

  return d;
}

fn sampleDensity(p : vec3<f32>) -> f32 {
  let dist = cloudSDF(p);
  return smoothstep(0.1, -0.1, dist);
}

fn calcNormal(p : vec3<f32>) -> vec3<f32> {
  let e = 0.001;
  let n = vec3(
    cloudSDF(p + vec3(e, 0.0, 0.0)) - cloudSDF(p - vec3(e, 0.0, 0.0)),
    cloudSDF(p + vec3(0.0, e, 0.0)) - cloudSDF(p - vec3(0.0, e, 0.0)),
    cloudSDF(p + vec3(0.0, 0.0, e)) - cloudSDF(p - vec3(0.0, 0.0, e)),
  );
  return normalize(n);
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

  // Intersect with dynamic bounding box
  let t = intersectAABB(rayOrigin, rayDir, volumeUniforms.boxMin, volumeUniforms.boxMax);

  if (t.x > t.y || t.y < 0.0) {
    return vec4(0.0, 0.0, 0.0, 0.0);
  }

  let tNear = max(t.x, 0.0);
  let tFar = t.y;

  // Sphere trace to find SDF surface
  var tCurrent = tNear;
  var hit = false;
  for (var i = 0; i < 128; i++) {
    if (tCurrent > tFar) { break; }
    let p = rayOrigin + rayDir * tCurrent;
    let d = cloudSDF(p);
    if (d < 0.001) {
      hit = true;
      break;
    }
    tCurrent += max(d, 0.005); // min step to avoid getting stuck
  }

  if (!hit) {
    return vec4(0.0, 0.0, 0.0, 0.0);
  }

  // Shade the surface
  let hitPos = rayOrigin + rayDir * tCurrent;
  let normal = calcNormal(hitPos);

  // Diffuse lighting from upper-right
  let lightDir = normalize(vec3(1.0, 1.0, 0.5));
  let diffuse = max(dot(normal, lightDir), 0.0);
  let ambient = 0.3;
  let shade = ambient + diffuse * 0.7;
  let color = vec3(shade);

  return vec4(color, 1.0);
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

  // Cube vertices (will be updated to match cloud bounds)
  const vertexBuffer = device.createBuffer({
    size: 8 * 4 * 4, // 8 vertices × 4 floats × 4 bytes
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });

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

  // Volume uniform buffer: mat4 (64) + vec3+u32 (16) + 4×f32 (16) + vec3 (16) + vec3 (16) = 128
  const volumeUniformBuffer = device.createBuffer({
    size: 128,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  // Generate cloud spheres
  let sphereData = generateCumulus();
  let sphereCount = sphereData.length / 4;
  let cloudBounds = computeBounds(sphereData);
  console.log(`[Cumulus] Generated ${sphereCount} spheres`);

  // Set initial cube wireframe from bounds
  device.queue.writeBuffer(vertexBuffer, 0, buildCubeVertices(cloudBounds));

  let sphereBuffer = device.createBuffer({
    size: sphereData.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(sphereBuffer, 0, sphereData);

  let volumeBindGroup = device.createBindGroup({
    layout: volumePipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: volumeUniformBuffer } },
      { binding: 1, resource: { buffer: sphereBuffer } },
    ],
  });

  function rebuildSpheres(data) {
    sphereBuffer.destroy();
    sphereData = data;
    sphereCount = data.length / 4;
    cloudBounds = computeBounds(data);
    device.queue.writeBuffer(vertexBuffer, 0, buildCubeVertices(cloudBounds));
    sphereBuffer = device.createBuffer({
      size: data.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(sphereBuffer, 0, data);
    volumeBindGroup = device.createBindGroup({
      layout: volumePipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: volumeUniformBuffer } },
        { binding: 1, resource: { buffer: sphereBuffer } },
      ],
    });
  }

  const viewProjectionMatrix = mat4.create();
  const inverseViewProjectionMatrix = mat4.create();

  const projectionMatrix = mat4.create();
  const viewMatrix = mat4.create();
  const modelViewProjectionMatrix = mat4.create();

  // GUI
  const params = {
    shape: 'Cumulus',
    gridX: 4,
    gridZ: 4,
    pointSeparation: 0.25,
    iterations: 2,
    children: 4,
    keepProb: 0.5,
    scaleMult: 0.55,
    seed: 42,
    gradientBottom: -0.2,
    gradientTop: 0.5,
    gradientStrength: 0.0,
    blendMode: 'Sharp',
    smoothness: 0.3,
  };

  function regenerate() {
    let data;
    const repOpts = {
      replicationIterations: params.iterations,
      childrenPerSphere: params.children,
      keepProbability: params.keepProb,
      scaleMult: params.scaleMult,
      seed: params.seed,
    };
    if (params.shape === 'Cumulus') {
      data = generateCumulus({
        gridX: params.gridX,
        gridZ: params.gridZ,
        pointSeparation: params.pointSeparation,
        ...repOpts,
      });
    } else if (params.shape === 'Wispy') {
      data = generateWispy(repOpts);
    } else {
      data = generateEllipsoid(repOpts);
    }
    rebuildSpheres(data);
    console.log(`[${params.shape}] Generated ${sphereCount} spheres`);
  }

  const gui = new GUI();
  gui.add(params, 'shape', ['Cumulus', 'Wispy', 'Ellipsoid']).name('Shape').onChange(regenerate);

  const shapeFolder = gui.addFolder('Shape Settings');
  shapeFolder.add(params, 'gridX', 1, 12, 1).name('Grid X').onChange(regenerate);
  shapeFolder.add(params, 'gridZ', 1, 12, 1).name('Grid Z').onChange(regenerate);
  shapeFolder.add(params, 'pointSeparation', 0.1, 0.5, 0.01).name('Separation').onChange(regenerate);
  shapeFolder.add(params, 'iterations', 0, 4, 1).name('Iterations').onChange(regenerate);
  shapeFolder.add(params, 'children', 1, 8, 1).name('Children').onChange(regenerate);
  shapeFolder.add(params, 'keepProb', 0.1, 1.0, 0.05).name('Keep Prob').onChange(regenerate);
  shapeFolder.add(params, 'scaleMult', 0.2, 0.9, 0.05).name('Scale Mult').onChange(regenerate);
  shapeFolder.add(params, 'seed', 1, 100, 1).name('Seed').onChange(regenerate);

  const gradientFolder = gui.addFolder('Density Gradient');
  gradientFolder.add(params, 'gradientBottom', -1.0, 1.0, 0.05).name('Bottom');
  gradientFolder.add(params, 'gradientTop', -1.0, 1.0, 0.05).name('Top');
  gradientFolder.add(params, 'gradientStrength', 0.0, 1.0, 0.01).name('Strength');

  gui.add(params, 'blendMode', ['Sharp', 'Smooth']).name('Blend Mode');
  gui.add(params, 'smoothness', 0.05, 1.0, 0.01).name('Smoothness');

  // Orbit camera state
  let orbitTheta = Math.PI / 4;   // horizontal angle
  let orbitPhi = Math.PI / 4;     // vertical angle (from top)
  let orbitDistance = 6;
  let isDragging = false;
  let lastMouseX = 0;
  let lastMouseY = 0;

  canvas.addEventListener('pointerdown', (e) => {
    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMouseX;
    const dy = e.clientY - lastMouseY;
    orbitTheta -= dx * 0.005;
    orbitPhi = Math.max(0.05, Math.min(Math.PI - 0.05, orbitPhi - dy * 0.005));
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  });
  canvas.addEventListener('pointerup', (e) => {
    isDragging = false;
    canvas.releasePointerCapture(e.pointerId);
  });
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    orbitDistance = Math.max(1.5, Math.min(20, orbitDistance + e.deltaY * 0.01));
  }, { passive: false });

  function render() {
    const aspect = canvas.clientWidth / canvas.clientHeight;
    mat4.perspective(projectionMatrix, (2 * Math.PI) / 5, aspect, 0.1, 100.0);

    // Camera position from spherical coordinates
    const camX = orbitDistance * Math.sin(orbitPhi) * Math.cos(orbitTheta);
    const camY = orbitDistance * Math.cos(orbitPhi);
    const camZ = orbitDistance * Math.sin(orbitPhi) * Math.sin(orbitTheta);
    const cameraPos = [camX, camY, camZ];
    mat4.lookAt(viewMatrix, cameraPos, [0, 0, 0], [0, 1, 0]);

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
    device.queue.writeBuffer(volumeUniformBuffer, 64, new Float32Array([cameraPos[0], cameraPos[1], cameraPos[2]]));
    device.queue.writeBuffer(volumeUniformBuffer, 76, new Uint32Array([sphereCount]));
    const smoothnessValue = params.blendMode === 'Smooth' ? params.smoothness : 0.0;
    device.queue.writeBuffer(volumeUniformBuffer, 80, new Float32Array([
      smoothnessValue, params.gradientBottom, params.gradientTop, params.gradientStrength,
    ]));
    device.queue.writeBuffer(volumeUniformBuffer, 96, new Float32Array(cloudBounds.min));
    device.queue.writeBuffer(volumeUniformBuffer, 112, new Float32Array(cloudBounds.max));

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