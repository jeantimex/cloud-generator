import { mat4 } from 'gl-matrix';
import GUI from 'lil-gui';
import Stats from 'stats.js/src/Stats.js';

// Stats setup
const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

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

function rayIntersectsTriangle(origin, dir, v0, v1, v2) {
  const e1 = [v1[0] - v0[0], v1[1] - v0[1], v1[2] - v0[2]];
  const e2 = [v2[0] - v0[0], v2[1] - v0[1], v2[2] - v0[2]];
  const h = [
    dir[1] * e2[2] - dir[2] * e2[1],
    dir[2] * e2[0] - dir[0] * e2[2],
    dir[0] * e2[1] - dir[1] * e2[0]
  ];
  const a = e1[0] * h[0] + e1[1] * h[1] + e1[2] * h[2];
  if (a > -0.00001 && a < 0.00001) return null;
  const f = 1.0 / a;
  const s = [origin[0] - v0[0], origin[1] - v0[1], origin[2] - v0[2]];
  const u = f * (s[0] * h[0] + s[1] * h[1] + s[2] * h[2]);
  if (u < 0.0 || u > 1.0) return null;
  const q = [
    s[1] * e1[2] - s[2] * e1[1],
    s[2] * e1[0] - s[0] * e1[2],
    s[0] * e1[1] - s[1] * e1[0]
  ];
  const v = f * (dir[0] * q[0] + dir[1] * q[1] + dir[2] * q[2]);
  if (v < 0.0 || u + v > 1.0) return null;
  const t = f * (e2[0] * q[0] + e2[1] * q[1] + e2[2] * q[2]);
  return t > 0.00001 ? t : null;
}

function voxelizeMesh(vertices, indices, options = {}) {
  const { resolution = 15, seed = 42 } = options;
  const rng = createRNG(seed);
  
  // 1. Compute bounding box
  let min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < vertices.length; i += 3) {
    for (let j = 0; j < 3; j++) {
      min[j] = Math.min(min[j], vertices[i + j]);
      max[j] = Math.max(max[j], vertices[i + j]);
    }
  }

  const size = [max[0] - min[0], max[1] - min[1], max[2] - min[2]];
  const maxDim = Math.max(...size);
  const step = maxDim / resolution;
  const spheres = [];

  // 2. Scan grid
  for (let x = min[0] + step / 2; x <= max[0]; x += step) {
    for (let y = min[1] + step / 2; y <= max[1]; y += step) {
      for (let z = min[2] + step / 2; z <= max[2]; z += step) {
        // Point-in-mesh test using raycasting
        let intersections = 0;
        const origin = [x, y, z];
        const dir = [1, 0.432, 0.123]; // Random-ish direction to avoid edge cases
        
        for (let i = 0; i < indices.length; i += 3) {
          const v0 = [vertices[indices[i] * 3], vertices[indices[i] * 3 + 1], vertices[indices[i] * 3 + 2]];
          const v1 = [vertices[indices[i + 1] * 3], vertices[indices[i + 1] * 3 + 1], vertices[indices[i + 1] * 3 + 2]];
          const v2 = [vertices[indices[i + 2] * 3], vertices[indices[i + 2] * 3 + 1], vertices[indices[i + 2] * 3 + 2]];
          if (rayIntersectsTriangle(origin, dir, v0, v1, v2) !== null) {
            intersections++;
          }
        }

        if (intersections % 2 === 1) {
          // Randomize position slightly and randomize radius
          const radVar = options.radiusVariation || 0.4;
          const radiusJitter = (1.0 - radVar / 2) + rng() * radVar; 
          spheres.push(
            x + (rng() - 0.5) * step * 0.3, 
            y + (rng() - 0.5) * step * 0.3, 
            z + (rng() - 0.5) * step * 0.3, 
            step * 0.75 * radiusJitter
          );
        }
      }
    }
  }

  return replicateSpheres(spheres, rng, options);
}

function parseOBJ(text) {
  const vertices = [];
  const indices = [];
  const lines = text.split('\n');
  for (let line of lines) {
    const parts = line.trim().split(/\s+/);
    if (parts[0] === 'v') {
      vertices.push(parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3]));
    } else if (parts[0] === 'f') {
      // Handle f v1/vt1/vn1 v2/vt2/vn2 v3/vt3/vn3
      const v1 = parseInt(parts[1].split('/')[0]) - 1;
      const v2 = parseInt(parts[2].split('/')[0]) - 1;
      const v3 = parseInt(parts[3].split('/')[0]) - 1;
      indices.push(v1, v2, v3);
    }
  }
  return { vertices: new Float32Array(vertices), indices: new Uint32Array(indices) };
}

function catmullRom(p0, p1, p2, p3, t) {
  const v0 = (p2 - p0) * 0.5;
  const v1 = (p3 - p1) * 0.5;
  const t2 = t * t;
  const t3 = t2 * t;
  return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;
}

function generateFromCurve(options = {}) {
  const {
    curveType = 'S-Curve',
    numPoints = 20,
    thickness = 0.2,
    backboneNoise = 0.1,
    seed = 42,
    radiusVariation = 0.5,
  } = options;
  const rng = createRNG(seed);
  const spheres = [];

  let controlPoints = [];
  if (curveType === 'S-Curve') {
    controlPoints = [
      [-0.8, 0, 0], [-0.4, 0.2, 0.3], [0, -0.1, -0.2], [0.4, 0.3, 0.4], [0.8, 0, 0]
    ];
  } else if (curveType === 'Spiral') {
    const turns = 2.5;
    const points = 12;
    for (let i = 0; i < points; i++) {
      const t = i / (points - 1);
      const angle = t * Math.PI * 2 * turns;
      const radius = t * 0.8;
      controlPoints.push([Math.cos(angle) * radius, (rng() - 0.5) * 0.1, Math.sin(angle) * radius]);
    }
  } else if (curveType === 'Circle') {
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      controlPoints.push([Math.cos(a) * 0.7, 0, Math.sin(a) * 0.7]);
    }
    controlPoints.push(controlPoints[0], controlPoints[1], controlPoints[2]); // Close the loop
  }

  const getPoint = (t) => {
    const n = controlPoints.length - 1;
    const i = Math.floor(t * n);
    const frac = (t * n) - i;
    const p1 = controlPoints[Math.min(i, n)];
    const p2 = controlPoints[Math.min(i + 1, n)];
    const p0 = controlPoints[Math.max(i - 1, 0)];
    const p3 = controlPoints[Math.min(i + 2, n)];
    return [
      catmullRom(p0[0], p1[0], p2[0], p3[0], frac),
      catmullRom(p0[1], p1[1], p2[1], p3[1], frac),
      catmullRom(p0[2], p1[2], p2[2], p3[2], frac)
    ];
  };

  for (let i = 0; i < numPoints; i++) {
    const t = i / (numPoints - 1);
    const basePos = getPoint(t);
    
    // Apply backbone noise
    const x = basePos[0] + (rng() - 0.5) * backboneNoise;
    const y = basePos[1] + (rng() - 0.5) * backboneNoise;
    const z = basePos[2] + (rng() - 0.5) * backboneNoise;

    // Radius ramp: thinner at ends
    const profile = Math.sin(t * Math.PI);
    const radius = thickness * (0.6 + 0.4 * profile) * (1.0 + (rng() - 0.5) * radiusVariation);
    spheres.push(x, y, z, radius);
  }

  return replicateSpheres(spheres, rng, options);
}

function generateCumulus(options = {}) {
  const {
    species = 'Mediocris',
    gridX = 4,
    gridY = 4,
    gridZ = 4,
    pointSeparation = 0.25,
    flattenBottom = -0.3,
    windShear = 0.0,
    seed = 42,
    radiusVariation = 0.5,
    replicationIterations = 2,
    childrenPerSphere = 4,
    keepProbability = 0.5,
    scaleMult = 0.55,
  } = options;

  const rng = createRNG(seed);
  const spheres = [];

  // Species-specific grid adjustments
  let sx = gridX, sy = gridY, sz = gridZ;
  if (species === 'Humilis') { sy = Math.max(1, Math.floor(sy * 0.5)); }
  if (species === 'Congestus') { sy = Math.ceil(sy * 2.0); sx = Math.max(1, Math.floor(sx * 0.7)); sz = Math.max(1, Math.floor(sz * 0.7)); }
  if (species === 'Fractus') { sy = Math.max(1, Math.floor(sy * 0.6)); }

  const halfX = (sx - 1) * pointSeparation / 2;
  const halfY = (sy - 1) * pointSeparation / 2;
  const halfZ = (sz - 1) * pointSeparation / 2;

  for (let ix = 0; ix < sx; ix++) {
    for (let iy = 0; iy < sy; iy++) {
      for (let iz = 0; iz < sz; iz++) {
        // Fractus has high chance of missing points
        if (species === 'Fractus' && rng() > 0.4) continue;

        let x = ix * pointSeparation - halfX + (rng() * 2 - 1) * pointSeparation * 0.8;
        let y = iy * pointSeparation - halfY + (rng() * 2 - 1) * pointSeparation * 0.8;
        let z = iz * pointSeparation - halfZ + (rng() * 2 - 1) * pointSeparation * 0.8;

        // Wind Shear: Lean the cloud based on height
        const heightFactor = (y + halfY) / (sy * pointSeparation);
        x += heightFactor * windShear;

        if (y < flattenBottom) y = flattenBottom;

        const radVar = radiusVariation || 0.5;
        const radius = pointSeparation * (1.1 + (rng() - 0.5) * radVar);
        spheres.push(x, y, z, radius);
      }
    }
  }

  return replicateSpheres(spheres, rng, {
    replicationIterations, childrenPerSphere, keepProbability, scaleMult, radiusVariation
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
  viewProjection : mat4x4<f32>,
  inverseViewProjection : mat4x4<f32>,
  cameraPosition : vec3<f32>,
  sphereCount : u32,
  smoothness : f32,
  gradientBottom : f32,
  gradientTop : f32,
  gradientStrength : f32,
  boxMin : vec3<f32>,
  billowyScale : f32,
  boxMax : vec3<f32>,
  billowyStrength : f32,
  wispyScale : f32,
  wispyStrength : f32,
  coverage : f32,
  zPadding : f32,
  flipZ : f32,
  absorption : f32,
  renderSteps : f32,
  lightSteps : f32,
  renderMode : f32,
  anisotropy1 : f32,
  anisotropy2 : f32,
  phaseBlend : f32,
  lightDir : vec3<f32>,
  ambient : f32,
  cloudColor : vec3<f32>,
  time : f32,
  timeScale : f32,
  warpStrength : f32,
  _pad1 : f32,
  _pad2 : f32,
};

@binding(0) @group(0) var<uniform> volumeUniforms : VolumeUniforms;
@binding(1) @group(0) var<storage, read> spheres : array<vec4<f32>>;

struct VertexOutput {
  @builtin(position) Position : vec4<f32>,
  @location(0) worldPos : vec3<f32>,
};

@vertex
fn vs_volume(@location(0) position: vec4<f32>) -> VertexOutput {
  var output : VertexOutput;
  output.Position = volumeUniforms.viewProjection * position;
  output.worldPos = position.xyz;
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

// --- 3D Simplex-like noise (hash-based gradient noise) ---
fn hash33(p : vec3<f32>) -> vec3<f32> {
  var q = vec3(
    dot(p, vec3(127.1, 311.7, 74.7)),
    dot(p, vec3(269.5, 183.3, 246.1)),
    dot(p, vec3(113.5, 271.9, 124.6)),
  );
  return fract(sin(q) * 43758.5453123) * 2.0 - 1.0;
}

fn noise3D(p : vec3<f32>) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let u = f * f * (3.0 - 2.0 * f);

  return mix(
    mix(
      mix(dot(hash33(i + vec3(0.0, 0.0, 0.0)), f - vec3(0.0, 0.0, 0.0)),
          dot(hash33(i + vec3(1.0, 0.0, 0.0)), f - vec3(1.0, 0.0, 0.0)), u.x),
      mix(dot(hash33(i + vec3(0.0, 1.0, 0.0)), f - vec3(0.0, 1.0, 0.0)),
          dot(hash33(i + vec3(1.0, 1.0, 0.0)), f - vec3(1.0, 1.0, 0.0)), u.x), u.y),
    mix(
      mix(dot(hash33(i + vec3(0.0, 0.0, 1.0)), f - vec3(0.0, 0.0, 1.0)),
          dot(hash33(i + vec3(1.0, 0.0, 1.0)), f - vec3(1.0, 0.0, 1.0)), u.x),
      mix(dot(hash33(i + vec3(0.0, 1.0, 1.0)), f - vec3(0.0, 1.0, 1.0)),
          dot(hash33(i + vec3(1.0, 1.0, 1.0)), f - vec3(1.0, 1.0, 1.0)), u.x), u.y),
    u.z);
}

fn fbm3D(p : vec3<f32>, octaves : i32) -> f32 {
  var value = 0.0;
  var amplitude = 0.5;
  var frequency = 1.0;
  for (var i = 0; i < octaves; i++) {
    value += amplitude * noise3D(p * frequency);
    frequency *= 2.0;
    amplitude *= 0.5;
  }
  return value;
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

  let t = volumeUniforms.time * volumeUniforms.timeScale;
  
  // Domain Warping: Offset the noise coordinates with another noise function
  // This creates the "swirling" and "wispy curls" characteristic of Houdini clouds.
  var warpPos = p;
  let warpStr = volumeUniforms.warpStrength;
  if (warpStr > 0.0) {
    let warpX = fbm3D(p * 1.5 + vec3(t, 0.0, 0.0), 3);
    let warpY = fbm3D(p * 1.5 + vec3(0.0, t, 0.0), 3);
    let warpZ = fbm3D(p * 1.5 + vec3(0.0, 0.0, t), 3);
    warpPos += vec3(warpX, warpY, warpZ) * warpStr;
  }

  // Density gradient: erode the SDF based on height
  let gStrength = volumeUniforms.gradientStrength;
  if (gStrength > 0.0) {
    var heightFrac = smoothstep(volumeUniforms.gradientBottom, volumeUniforms.gradientTop, p.y);
    // FlipZ: erode bottom instead of top
    if (volumeUniforms.flipZ > 0.5) {
      heightFrac = 1.0 - heightFrac;
    }
    d += heightFrac * gStrength;
  }

  // Billowy noise: large-scale deformation (cauliflower bumps)
  let billowyStr = volumeUniforms.billowyStrength;
  if (billowyStr > 0.0) {
    let bn = fbm3D(warpPos * volumeUniforms.billowyScale + vec3(0.0, -t * 0.5, 0.0), 4);
    d += bn * billowyStr;
  }

  // Wispy noise: fine detail erosion at edges
  let wispyStr = volumeUniforms.wispyStrength;
  if (wispyStr > 0.0) {
    let wn = fbm3D(warpPos * volumeUniforms.wispyScale + vec3(t, t * 0.2, 0.0), 3);
    d += wn * wispyStr;
  }

  // Coverage: shift the entire SDF inward (negative = puffier)
  d -= volumeUniforms.coverage;

  // Z-padding: clip cloud at top/bottom by pushing SDF outward near bounds
  let zPad = volumeUniforms.zPadding;
  if (zPad > 0.0) {
    let bMin = volumeUniforms.boxMin.y;
    let bMax = volumeUniforms.boxMax.y;
    let clipBottom = smoothstep(bMin, bMin + zPad, p.y);
    let clipTop = smoothstep(bMax, bMax - zPad, p.y);
    let clipMask = clipBottom * clipTop;
    d += (1.0 - clipMask) * 0.5;
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

fn henyeyGreenstein(cosTheta : f32, g : f32) -> f32 {
  let g2 = g * g;
  let denom = 1.0 + g2 - 2.0 * g * cosTheta;
  return (1.0 - g2) / (4.0 * 3.14159265 * pow(denom, 1.5));
}

fn dualPhase(cosTheta : f32) -> f32 {
  let hg1 = henyeyGreenstein(cosTheta, volumeUniforms.anisotropy1);
  let hg2 = henyeyGreenstein(cosTheta, volumeUniforms.anisotropy2);
  return mix(hg1, hg2, volumeUniforms.phaseBlend);
}

fn lightMarch(pos : vec3<f32>, lightDir : vec3<f32>, absorption : f32) -> f32 {
  // March toward the light to estimate how much cloud is in the way
  let numSteps = i32(volumeUniforms.lightSteps);
  let stepSize = 0.12;
  var totalDensity = 0.0;
  for (var i = 1; i <= numSteps; i++) {
    let samplePos = pos + lightDir * f32(i) * stepSize;
    totalDensity += sampleDensity(samplePos);
  }
  // Beer's Law: how much light reaches this point
  return exp(-totalDensity * stepSize * absorption);
}

@fragment
fn fs_volume(@location(0) worldPos : vec3<f32>) -> @location(0) vec4<f32> {
  let rayOrigin = volumeUniforms.cameraPosition;
  let rayDir = normalize(worldPos - rayOrigin);

  // Intersect with dynamic bounding box to find entry/exit points
  let t = intersectAABB(rayOrigin, rayDir, volumeUniforms.boxMin, volumeUniforms.boxMax);

  if (t.x > t.y || t.y < 0.0) {
    return vec4(0.0, 0.0, 0.0, 0.0);
  }

  let tNear = max(t.x, 0.0);
  let tFar = t.y;
  let lightDir = normalize(volumeUniforms.lightDir);

  // Surface mode: sphere tracing with normal-based shading
  if (volumeUniforms.renderMode < 0.5) {
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
      tCurrent += max(d, 0.005);
    }

    if (!hit) {
      return vec4(0.0, 0.0, 0.0, 0.0);
    }

    let hitPos = rayOrigin + rayDir * tCurrent;
    let normal = calcNormal(hitPos);
    let diffuse = max(dot(normal, lightDir), 0.0);
    let ambient = volumeUniforms.ambient;
    let shade = ambient + diffuse * (1.0 - ambient);
    return vec4(volumeUniforms.cloudColor * shade, 1.0);
  }

  // Volume mode: adaptive raymarching with Beer's Law
  let maxSteps = i32(volumeUniforms.renderSteps);
  let denseStepSize = (tFar - tNear) / volumeUniforms.renderSteps;
  let absorption = volumeUniforms.absorption;

  var transmittance = 1.0;
  var accColor = vec3(0.0);
  let cloudColor = volumeUniforms.cloudColor;

  var tCurrent = tNear;
  for (var i = 0; i < maxSteps; i++) {
    if (tCurrent > tFar || transmittance < 0.01) { break; }

    let pos = rayOrigin + rayDir * tCurrent;
    let sdfDist = cloudSDF(pos);

    // If far from surface, skip ahead using SDF distance
    if (sdfDist > denseStepSize * 2.0) {
      tCurrent += sdfDist * 0.8;
      continue;
    }

    // Inside or near cloud: sample density and accumulate
    let density = smoothstep(0.1, -0.1, sdfDist);
    if (density > 0.001) {
      let attenuation = exp(-density * denseStepSize * absorption);
      let lightTransmittance = lightMarch(pos, lightDir, absorption);

      // Henyey-Greenstein phase function for anisotropic scattering
      let cosTheta = dot(rayDir, lightDir);
      let phase = dualPhase(cosTheta) * 4.0 * 3.14159265;

      // Base lighting: always present
      let ambient = volumeUniforms.ambient;
      let directional = lightTransmittance * 0.7;
      // Silver lining boost: phase > 1 adds extra brightness (forward scattering)
      let phaseBoost = lightTransmittance * max(phase - 1.0, 0.0) * 0.7;
      let luminance = ambient + directional + phaseBoost;
      let shade = luminance * cloudColor;

      accColor += shade * density * denseStepSize * absorption * transmittance;
      transmittance *= attenuation;
    }

    tCurrent += denseStepSize;
  }

  let alpha = 1.0 - transmittance;
  if (alpha < 0.001) {
    return vec4(0.0, 0.0, 0.0, 0.0);
  }
  return vec4(accColor, alpha);
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

  // Solid cube indices for volume rendering
  const solidIndices = new Uint16Array([
    0, 1, 2, 0, 2, 3, // Front
    4, 7, 6, 4, 6, 5, // Back
    0, 4, 5, 0, 5, 1, // Bottom
    3, 2, 6, 3, 6, 7, // Top
    0, 3, 7, 0, 7, 4, // Left
    1, 5, 6, 1, 6, 2  // Right
  ]);
  const solidIndexBuffer = device.createBuffer({
    size: solidIndices.byteLength,
    usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(solidIndexBuffer, 0, solidIndices);

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
    depthStencil: {
      depthWriteEnabled: true,
      depthCompare: 'less',
      format: 'depth24plus',
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
      module: volumeShaderModule,
      entryPoint: 'fs_volume',
      targets: [
        {
          format: canvasFormat,
          blend: {
            color: {
              srcFactor: 'one',
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
      cullMode: 'front',
    },
    depthStencil: {
      depthWriteEnabled: false,
      depthCompare: 'less',
      format: 'depth24plus',
    },
  });

  // Volume uniform buffer: 288 bytes (see VolumeUniforms struct)
  const volumeUniformBuffer = device.createBuffer({
    size: 288,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  // === 3D SDF Texture for baked SDF (Performance Optimization) ===
  let sdfTexture = null;

  function createSDFTexture(resolution) {
    if (sdfTexture) {
      sdfTexture.destroy();
    }
    sdfTexture = device.createTexture({
      size: [resolution, resolution, resolution],
      format: 'r32float',
      dimension: '3d',
      usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING,
    });
    const memoryMB = (resolution ** 3 * 4 / 1024 / 1024).toFixed(1);
    console.log(`[SDF Texture] Created ${resolution}³ 3D texture (${memoryMB}MB)`);
    return sdfTexture;
  }

  // Initial texture will be created after params are defined

  // Sampler for trilinear interpolation of SDF texture
  const sdfSampler = device.createSampler({
    magFilter: 'linear',
    minFilter: 'linear',
    mipmapFilter: 'linear',
    addressModeU: 'clamp-to-edge',
    addressModeV: 'clamp-to-edge',
    addressModeW: 'clamp-to-edge',
  });
  console.log('[SDF Sampler] Created trilinear sampler');

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

  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;

  let depthTexture = device.createTexture({
    size: [canvas.width, canvas.height],
    format: 'depth24plus',
    usage: GPUTextureUsage.RENDER_ATTACHMENT,
  });

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
    billowyScale: 0.0,
    billowyStrength: 0.0,
    wispyScale: 0.0,
    wispyStrength: 0.0,
    coverage: 0.0,
    zPadding: 0.0,
    flipZ: false,
    absorption: 5.0,
    renderSteps: 64,
    lightSteps: 6,
    renderMode: 'Surface',
    anisotropy1: 0.5,
    anisotropy2: -0.3,
    phaseBlend: 0.5,
    sunX: 1.0,
    sunY: 1.0,
    sunZ: 0.5,
    ambient: 0.3,
    cloudColor: '#ffffff',
    cloudScale: 1.0,
    blendMode: 'Sharp',
    smoothness: 0.3,
    timeScale: 0.0,
    warpStrength: 0.15,
    meshResolution: 15,
    customMesh: null,
    radiusVariation: 0.5,
    curveType: 'S-Curve',
    curvePoints: 20,
    curveThickness: 0.2,
    curveBackboneNoise: 0.1,
    species: 'Mediocris',
    gridY: 4,
    windShear: 0.0,
    // Performance
    sdfResolution: 128,
  };

  function regenerate() {
    let data;
    const repOpts = {
      replicationIterations: params.iterations,
      childrenPerSphere: params.children,
      keepProbability: params.keepProb,
      scaleMult: params.scaleMult,
      seed: params.seed,
      radiusVariation: params.radiusVariation,
    };
    if (params.shape === 'Cumulus') {
      data = generateCumulus({
        species: params.species,
        gridX: params.gridX,
        gridY: params.gridY,
        gridZ: params.gridZ,
        pointSeparation: params.pointSeparation,
        windShear: params.windShear,
        ...repOpts,
      });
    } else if (params.shape === 'Wispy') {
      data = generateFromCurve({
        curveType: params.curveType,
        numPoints: params.curvePoints,
        thickness: params.curveThickness,
        backboneNoise: params.curveBackboneNoise,
        ...repOpts,
      });
    } else if (params.shape === 'Ellipsoid') {
      data = generateEllipsoid(repOpts);
    } else if (params.shape === 'Custom Mesh' && params.customMesh) {
      data = voxelizeMesh(params.customMesh.vertices, params.customMesh.indices, {
        resolution: params.meshResolution,
        ...repOpts,
      });
    } else {
      // Default to cumulus if nothing else
      data = generateCumulus(repOpts);
    }
    // Apply cloud scale
    const s = params.cloudScale;
    if (s !== 1.0) {
      for (let i = 0; i < data.length; i++) {
        data[i] *= s;
      }
    }
    rebuildSpheres(data);
    console.log(`[${params.shape}] Generated ${sphereCount} spheres`);
  }

  const gui = new GUI();
  gui.add(params, 'shape', ['Cumulus', 'Wispy', 'Ellipsoid', 'Custom Mesh']).name('Shape').onChange(regenerate);

  const meshFolder = gui.addFolder('Mesh Settings');
  meshFolder.add(params, 'meshResolution', 5, 30, 1).name('Voxel Res');
  const meshFileObj = {
    loadMesh: () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.obj';
      input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
          params.customMesh = parseOBJ(event.target.result);
          params.shape = 'Custom Mesh';
          gui.controllers.find(c => c._name === 'Shape').updateDisplay();
          regenerate();
        };
        reader.readAsText(file);
      };
      input.click();
    }
  };
  meshFolder.add(meshFileObj, 'loadMesh').name('Upload OBJ (.obj)');

  const shapeFolder = gui.addFolder('Shape Settings');
  shapeFolder.add(params, 'species', ['Humilis', 'Mediocris', 'Congestus', 'Fractus']).name('Species').onChange(regenerate);
  shapeFolder.add(params, 'radiusVariation', 0.0, 1.0, 0.05).name('Radius Var').onChange(regenerate);
  shapeFolder.add(params, 'gridX', 1, 12, 1).name('Grid X').onChange(regenerate);
  shapeFolder.add(params, 'gridY', 1, 12, 1).name('Grid Y').onChange(regenerate);
  shapeFolder.add(params, 'gridZ', 1, 12, 1).name('Grid Z').onChange(regenerate);
  shapeFolder.add(params, 'pointSeparation', 0.1, 0.5, 0.01).name('Separation').onChange(regenerate);
  shapeFolder.add(params, 'windShear', -1.0, 1.0, 0.01).name('Wind Shear').onChange(regenerate);

  const curveFolder = gui.addFolder('Curve Settings');
  curveFolder.add(params, 'curveType', ['S-Curve', 'Spiral', 'Circle']).name('Curve Type').onChange(regenerate);
  curveFolder.add(params, 'curvePoints', 5, 100, 1).name('Segments').onChange(regenerate);
  curveFolder.add(params, 'curveThickness', 0.05, 0.5, 0.01).name('Thickness').onChange(regenerate);
  curveFolder.add(params, 'curveBackboneNoise', 0.0, 0.5, 0.01).name('Backbone Noise').onChange(regenerate);

  const replicationFolder = gui.addFolder('Replication');
  replicationFolder.add(params, 'iterations', 0, 4, 1).name('Iterations').onChange(regenerate);
  replicationFolder.add(params, 'children', 1, 8, 1).name('Children').onChange(regenerate);
  replicationFolder.add(params, 'keepProb', 0.1, 1.0, 0.05).name('Keep Prob').onChange(regenerate);
  replicationFolder.add(params, 'scaleMult', 0.2, 0.9, 0.05).name('Scale Mult').onChange(regenerate);
  replicationFolder.add(params, 'seed', 1, 100, 1).name('Seed').onChange(regenerate);

  const gradientFolder = gui.addFolder('Density Gradient');
  gradientFolder.add(params, 'gradientBottom', -1.0, 1.0, 0.05).name('Bottom');
  gradientFolder.add(params, 'gradientTop', -1.0, 1.0, 0.05).name('Top');
  gradientFolder.add(params, 'gradientStrength', 0.0, 1.0, 0.01).name('Strength');
  gradientFolder.add(params, 'zPadding', 0.0, 1.0, 0.01).name('Z Padding');
  gradientFolder.add(params, 'flipZ').name('Flip Z');

  const noiseFolder = gui.addFolder('Noise');
  noiseFolder.add(params, 'billowyScale', 0.5, 5.0, 0.1).name('Billowy Scale');
  noiseFolder.add(params, 'billowyStrength', 0.0, 0.5, 0.01).name('Billowy Strength');
  noiseFolder.add(params, 'wispyScale', 2.0, 20.0, 0.5).name('Wispy Scale');
  noiseFolder.add(params, 'wispyStrength', 0.0, 0.3, 0.01).name('Wispy Strength');
  noiseFolder.add(params, 'coverage', -0.5, 0.5, 0.01).name('Coverage');

  const lightingFolder = gui.addFolder('Lighting');
  lightingFolder.add(params, 'renderMode', ['Surface', 'Volume']).name('Render Mode');
  lightingFolder.add(params, 'absorption', 1.0, 20.0, 0.5).name('Absorption');
  lightingFolder.add(params, 'renderSteps', 16, 128, 1).name('Render Steps');
  lightingFolder.add(params, 'lightSteps', 1, 16, 1).name('Light Steps');
  lightingFolder.add(params, 'sunX', -1.0, 1.0, 0.01).name('Sun X');
  lightingFolder.add(params, 'sunY', -1.0, 1.0, 0.01).name('Sun Y');
  lightingFolder.add(params, 'sunZ', -1.0, 1.0, 0.01).name('Sun Z');
  lightingFolder.add(params, 'anisotropy1', -0.99, 0.99, 0.01).name('Anisotropy 1');
  lightingFolder.add(params, 'anisotropy2', -0.99, 0.99, 0.01).name('Anisotropy 2');
  lightingFolder.add(params, 'phaseBlend', 0.0, 1.0, 0.01).name('Phase Blend');

  const appearanceFolder = gui.addFolder('Appearance');
  appearanceFolder.addColor(params, 'cloudColor').name('Cloud Color');
  appearanceFolder.add(params, 'ambient', 0.0, 1.0, 0.01).name('Ambient');
  appearanceFolder.add(params, 'cloudScale', 0.2, 3.0, 0.05).name('Cloud Scale').onChange(regenerate);

  const animationFolder = gui.addFolder('Animation');
  animationFolder.add(params, 'timeScale', 0.0, 1.0, 0.01).name('Evolution Speed');
  animationFolder.add(params, 'warpStrength', 0.0, 1.0, 0.01).name('Warp Strength');

  gui.add(params, 'blendMode', ['Sharp', 'Smooth']).name('Blend Mode');
  gui.add(params, 'smoothness', 0.05, 1.0, 0.01).name('Smoothness');

  const performanceFolder = gui.addFolder('Performance');
  performanceFolder.add(params, 'sdfResolution', [32, 64, 128, 256]).name('SDF Resolution').onChange((value) => {
    createSDFTexture(value);
  });

  // Create initial SDF texture
  createSDFTexture(params.sdfResolution);

  // Orbit camera state
  let orbitTheta = Math.PI / 4;   // horizontal angle
  let orbitPhi = Math.PI / 4;     // vertical angle (from top)
  let orbitDistance = 4;
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
    stats.begin();
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
    device.queue.writeBuffer(cubeUniforms.buffer, 64, new Float32Array([1.0, 0.5, 0.2, 1.0]));

    // Update Grid Uniforms
    device.queue.writeBuffer(gridUniforms.buffer, 0, modelViewProjectionMatrix);
    device.queue.writeBuffer(gridUniforms.buffer, 64, new Float32Array([0.5, 0.5, 0.5, 1.0]));

    // Update Volume Uniforms
    mat4.multiply(viewProjectionMatrix, projectionMatrix, viewMatrix);
    mat4.invert(inverseViewProjectionMatrix, viewProjectionMatrix);
    device.queue.writeBuffer(volumeUniformBuffer, 0, viewProjectionMatrix);
    device.queue.writeBuffer(volumeUniformBuffer, 64, inverseViewProjectionMatrix);
    device.queue.writeBuffer(volumeUniformBuffer, 128, new Float32Array([cameraPos[0], cameraPos[1], cameraPos[2]]));
    device.queue.writeBuffer(volumeUniformBuffer, 140, new Uint32Array([sphereCount]));
    const smoothnessValue = params.blendMode === 'Smooth' ? params.smoothness : 0.0;
    device.queue.writeBuffer(volumeUniformBuffer, 144, new Float32Array([
      smoothnessValue, params.gradientBottom, params.gradientTop, params.gradientStrength,
    ]));
    // boxMin (vec3) + billowyScale (f32)
    device.queue.writeBuffer(volumeUniformBuffer, 160, new Float32Array([
      ...cloudBounds.min, params.billowyScale,
    ]));
    // boxMax (vec3) + billowyStrength (f32)
    device.queue.writeBuffer(volumeUniformBuffer, 176, new Float32Array([
      ...cloudBounds.max, params.billowyStrength,
    ]));
    // wispyScale, wispyStrength, coverage, zPadding, flipZ, absorption, renderSteps, lightSteps
    device.queue.writeBuffer(volumeUniformBuffer, 192, new Float32Array([
      params.wispyScale, params.wispyStrength, params.coverage, params.zPadding,
      params.flipZ ? 1.0 : 0.0, params.absorption, params.renderSteps, params.lightSteps,
    ]));
    device.queue.writeBuffer(volumeUniformBuffer, 224, new Float32Array([
      params.renderMode === 'Volume' ? 1.0 : 0.0, params.anisotropy1, params.anisotropy2, params.phaseBlend,
    ]));
    // Parse cloud color hex to RGB floats
    const cc = parseInt(params.cloudColor.slice(1), 16);
    const cr = ((cc >> 16) & 0xff) / 255;
    const cg = ((cc >> 8) & 0xff) / 255;
    const cb = (cc & 0xff) / 255;
    device.queue.writeBuffer(volumeUniformBuffer, 240, new Float32Array([
      params.sunX, params.sunY, params.sunZ, params.ambient,
      cr, cg, cb, performance.now() / 1000,
      params.timeScale, params.warpStrength, 0.0, 0.0,
    ]));

    const commandEncoder = device.createCommandEncoder();
    const textureView = context.getCurrentTexture().createView();

    const renderPassDescriptor = {
      colorAttachments: [
        {
          view: textureView,
          clearValue: { r: 64 / 255, g: 62 / 255, b: 63 / 255, a: 1.0 },
          loadOp: 'clear',
          storeOp: 'store',
        },
      ],
      depthStencilAttachment: {
        view: depthTexture.createView(),
        depthClearValue: 1.0,
        depthLoadOp: 'clear',
        depthStoreOp: 'store',
      },
    };

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(pipeline);
    
    // Draw Grid
    passEncoder.setVertexBuffer(0, gridVertexBuffer);
    passEncoder.setIndexBuffer(gridIndexBuffer, 'uint16');
    passEncoder.setBindGroup(0, gridUniforms.bindGroup);
    passEncoder.drawIndexed(gridIndices.length);

    // Draw Cube (wireframe)
    passEncoder.setVertexBuffer(0, vertexBuffer);
    passEncoder.setIndexBuffer(indexBuffer, 'uint16');
    passEncoder.setBindGroup(0, cubeUniforms.bindGroup);
    passEncoder.drawIndexed(indices.length);

    // Draw Volume (raymarched fog inside the cube)
    passEncoder.setPipeline(volumePipeline);
    passEncoder.setVertexBuffer(0, vertexBuffer);
    passEncoder.setIndexBuffer(solidIndexBuffer, 'uint16');
    passEncoder.setBindGroup(0, volumeBindGroup);
    passEncoder.drawIndexed(solidIndices.length);

    passEncoder.end();

    device.queue.submit([commandEncoder.finish()]);

    stats.end();
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    depthTexture.destroy();
    depthTexture = device.createTexture({
      size: [canvas.width, canvas.height],
      format: 'depth24plus',
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });
  });
}

init();