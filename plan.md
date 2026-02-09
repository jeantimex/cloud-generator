# Volumetric Cloud Generation Plan (WebGPU)

## 1. Technical Research Summary

### Houdini Workflow (Reference)
- **Base Shape:** Generation of primitive spheres/blobs (SDFs).
- **VDB Conversion:** Converting geometry into a Fog Volume (Density Field).
- **Noise Displacement:** 
  - *Billowy Noise:* Large-scale displacement for major cloud structures.
  - *Wispy Noise:* Fine-grained detail for "fuzzy" edges.
- **Density Profiling:** Adjusting density based on height or distance from center.

### Blender Analysis (CloudCreatorPro)
- **Match:** The workflow is consistent with Houdini: **SDF Base → Volume Conversion → Noise Modulation**.

#### Geometry Nodes — Sphere Shape Pipeline
Two key node groups build the cloud shape:

**`AL_CloudCreator_Generator`** (shape from straight lines):
1. Two perpendicular Curve Lines (`Length` × `Width`) resampled into a 2D point grid
   at `PointSeparation` intervals.
2. **Random jitter** on each point: `[-1,1]³ × PointSeparation` (seed-controlled).
3. **Flatten bottom**: points below a Z threshold (`FlattenBottom`) are clamped flat.
4. **Ico Sphere** (subdivisions=3, radius=`PointSeparation`) instanced at each point
   with random uniform scale **0.90–1.42**.
5. **Replication loop** (N `Iterations`):
   - Realize current sphere instances into mesh.
   - `Distribute Points on Faces` (density=5.0) to scatter points on sphere surfaces.
   - Instance **smaller** Ico Spheres at those face points.
   - Scale shrinks each iteration via `ScaleMult × loopN`.
   - Random boolean mask + noise comparison for organic thinning.
   - Join new geometry with previous pass.

**`AL_CloudCreator_GeneratorCurve`** — identical logic but follows an input curve
instead of a straight line grid.

**`AL_CloudCreator_Converter`** (mesh → volume for rendering):
1. MeshSmooth (1 subdivision).
2. Noise-based position offset on vertices.
3. `Mesh to Volume` (voxel size = `Resolution`).
4. `Distribute Points in Volume` (Grid mode, spacing = `Resolution`).
5. `Points to Volume` (radius from `Resolution`).
6. Switch: viewport shows points, render shows full volume.

#### Key Shape Parameters (from Blender dump)
| Parameter | Value | Role |
|---|---|---|
| Ico Sphere radius | = `PointSeparation` | Base sphere size |
| Ico Sphere subdivisions | 3 | Sphere smoothness |
| Random scale range | 0.90 – 1.42 | Size variation per sphere |
| Position jitter | `[-1,1]³ × PointSeparation` | Breaks grid regularity |
| Replicate face density | 5.0 | Points scattered per face |
| Scale per iteration | `ScaleMult × loopN` | Spheres shrink each pass |
| Distribution mode | Grid | Uniform fill in converter |

---

## 2. Implementation Strategy (The WebGPU Way)

Since we are rendering inside a fixed Cube Container, we will use **Raymarching**.

### The Cloud Function
We will define a Density Function `D(p)` where `p` is a point in 3D space:
1.  **SDF Base:** Evaluate distance to N spheres, blend with smooth-min.
2.  **Noise Injection:** Subtract 3D Noise from the SDF value to create "erosion" and "wisps."
3.  **Thresholding:** Convert the SDF value into a density value (0.0 to 1.0).

### Sphere Data Pipeline (CPU → GPU)
The cloud shape is defined by a collection of spheres (vec4: xyz = center, w = radius).
These are generated on the **CPU** (JavaScript) and uploaded once via a **storage buffer**:
```
struct Sphere { center: vec3<f32>, radius: f32 };
@group(0) @binding(N) var<storage, read> spheres : array<Sphere>;
@group(0) @binding(M) var<uniform> sphereCount : u32;
```
The WGSL density function loops over all spheres, computing `smooth-min` of their SDFs:
```
fn cloudSDF(p: vec3<f32>) -> f32 {
  var d = 1e10;
  for (var i = 0u; i < sphereCount; i++) {
    let s = spheres[i];
    d = smin(d, length(p - s.center) - s.radius, k);  // k = smoothness
  }
  return d;
}
```

### CPU Sphere Generation (mirrors Blender Generator)
1. **Grid points** along two axes (`length × width`), spaced by `pointSeparation`.
2. **Jitter** each point by `random[-1,1]³ × pointSeparation`.
3. **Flatten bottom**: clamp Z below a threshold.
4. **Assign radius** = `pointSeparation × randomUniform(0.90, 1.42)`.
5. **Replication loop** (N iterations):
   - For each existing sphere, scatter M child points on its surface
     (uniform random directions, offset by parent radius).
   - Child radius = `parentRadius × scaleMult` (shrinks each iteration).
   - Random thinning: only keep a fraction of children for organic variation.
6. Collect all `(center, radius)` pairs → upload to GPU storage buffer.

### Blender Shader Findings (CloudCreator_Fancy_Mtl)
From `blender_shader_dump_full.json`, the actual cloud shader is a **custom shader group**:
- The material feeds **Volume** from a node group named `CloudCreator_Fancy_Mtl`.
- The `Principled Volume` node in the material is **not wired**; all logic is inside the group.
- The group exposes parameters we should mirror as uniforms:
  - `Density`, `Absorption Color`, `Top`, `Bottom`, `Z Offset`, `Billowy Factor`,
    `Shadows`, `Zpadding`, `ZBlur`, `Intensity`, `FlipZ`, `Coverage`, `Mix`,
    `Color Offset`, `Big Scale`, `Mid Scale`, `Small Scale`.

**Inside the group (high-level):**
- **Three 3D Noise layers** (big/mid/small) blended together:
  - Big scale ~ `0.1`
  - Mid scale ~ `4.12`
  - Small scale ~ `12.0`
- **Coverage + Billowy shaping**: Map Range remaps noise based on `Coverage` and `Billowy Factor`.
- **Vertical shaping**: Z-gradient uses `Zpadding`, `ZBlur`, `Z Offset`, and `FlipZ`.
- **Coloring**: `Top` and `Bottom` colors are mixed, with a `Color Offset` ramp bias.
- **Dual-volume shading**: two `Principled Volume` nodes are added together
  (anisotropy around ~0.5 and ~0.9) for lighting/shadow behavior.

These should be reflected in our density function and shading step so WebGPU matches Blender.

### Blender Shader Properties (Exact)
From `blender_shader_dump_props.json`, we can mirror the exact node settings:
- **Noise Textures**
  - All are **3D**.
  - `Noise Texture` and `Noise Texture.001` have `normalize = True`.
  - `Noise Texture.002` has `normalize = False`.
- **Attribute / Volume Info**
  - Attribute name is `density`.
- **Map Range**
  - All Map Range nodes have `clamp = True`, `interpolation = LINEAR`.
- **Mix nodes**
  - `Mix.001` = `LINEAR_LIGHT` (RGBA)
  - `Mix.002` = `OVERLAY` (RGBA)
  - `Mix.003` = `LINEAR_LIGHT` (RGBA)
  - `Mix.004` = `LINEAR_LIGHT` (RGBA), `clamp_result = True`
  - `Mix.007` = `MIX` (RGBA), `clamp_result = True`
  - Others are standard `MIX` (FLOAT/RGBA).
- **Math ops**
  - `MULTIPLY`, `POWER`, `ADD`, `SUBTRACT`, `LESS_THAN` exactly as in the node graph.

### The Renderer
1.  **Ray-AABB Intersection:** Calculate where the ray enters and exits our Cube.
2.  **Raymarching Loop:** Step through the cube, sampling `D(p)`.
3.  **Volume Integration:** Accumulate density and calculate light attenuation (Beer's Law).

---

## 3. Project Roadmap

> **Pipeline** (matches Houdini workflow & reference strip):
> Shape Source → Sphere Fill → Replicate → Billowy Noise → Wispy Noise
>
> **Shape sources** (three modes, mirroring Houdini):
> 1. *Cloud Shape Generate* — Primitive spheres for cumulus shapes
> 2. *Cloud Shape from Line* — Spheres placed along line/curve primitives
> 3. *Cloud Shape from Polygon* — Fill arbitrary 3D meshes with adaptively-sized spheres

### Phase 1: Raymarching Engine
- [ ] Implement Ray-Box (AABB) intersection logic in the vertex/fragment shader.
- [ ] Create the core Raymarching loop (stepping through the volume).
- [ ] Implement a basic "Density" sample based on the cube's bounds.
- [ ] Update `shaderCode` to include a dedicated volume rendering pass.

### Phase 2: Cloud Shape

#### 2a. GPU Sphere SDF Foundation
- [ ] Implement `sphereSDF(p, center, radius)` in WGSL.
- [ ] Implement `smin(a, b, k)` (polynomial smooth-min) for blending sphere SDFs.
- [ ] Create a `cloudSDF(p)` function that loops over a storage buffer of spheres
      and returns the smooth-union of all sphere distances.
- [ ] Create the storage buffer + bind group for sphere data (`vec4[]`: xyz=center, w=radius).
- [ ] Upload a few hand-placed test spheres and visualize the SDF in the raymarcher.

#### 2b. CPU Sphere Generator (mirrors Blender `AL_CloudCreator_Generator`)
- [ ] **Grid generation:** Create a 2D grid of points along two axes
      (`length × width`), spaced by `pointSeparation`.
- [ ] **Random jitter:** Offset each point by `random[-1,1]³ × pointSeparation`
      (seeded RNG for reproducibility).
- [ ] **Flatten bottom:** Clamp Z values below a configurable threshold.
- [ ] **Assign radius:** `pointSeparation × randomUniform(0.90, 1.42)` per sphere.
- [ ] **Upload & verify:** Push sphere array to GPU, confirm cloud blob renders.

#### 2c. Sphere Replication (mirrors Blender Repeat Zone)
- [ ] **Replication loop** (N iterations, configurable):
      For each existing sphere, scatter M child points on its surface
      (uniform random directions at parent radius distance).
- [ ] **Shrinking scale:** Child radius = `parentRadius × scaleMult` per iteration.
- [ ] **Random thinning:** Keep only a fraction of children (probability mask)
      for organic variation.
- [ ] **Join:** Append child spheres to the master array, re-upload to GPU.

#### 2d. Shape Modes
- [ ] **Mode A — Generate:** Hand-authored `(position, radius)` list for direct sculpting.
- [ ] **Mode B — From Line:** Define a polyline/curve backbone (control points);
      distribute spheres along it with varying radii (mirrors `AL_CloudCreator_GeneratorCurve`).
- [ ] **Mode C — From Polygon:** Accept an arbitrary 3D mesh, sample points
      inside its volume (grid fill), place spheres at each sample point with
      radius proportional to distance-to-surface.

#### 2e. Density Gradient
- [ ] Implement a vertical density falloff: denser at the bottom, softer at the top.
- [ ] Make the gradient configurable (height range, falloff curve).

### Phase 3: Noise & Detail
- [ ] Implement a 3D Noise function in WGSL (Perlin or Simplex).
- [ ] Create a Fractional Brownian Motion (fBm) wrapper for multi-layered detail.
- [ ] Integrate large-scale fBm noise to erode the SDF edges ("Billowy Noise").
- [ ] Add a second layer of high-frequency noise for soft edges ("Wispy Noise").
- [ ] Match Blender controls: `Coverage`, `Billowy Factor`, and multi-scale noise blend
      (`Big Scale`, `Mid Scale`, `Small Scale`).
- [ ] Add a Z-based shaping block: `Zpadding`, `ZBlur`, `Z Offset`, and `FlipZ`.

### Phase 4: Lighting & Refinement
- [ ] Implement Beer's Law for light absorption (translucency).
- [ ] Add a simple "Sun" light source.
- [ ] Implement "directional scattering" (sampling density towards the light).
- [ ] Optimize step size and performance.
- [ ] Add optional "dual-volume" style shading (two anisotropy settings) to mimic
      the Blender group behavior.

### Phase 5: Interaction (Optional)
- [ ] Add UI controls for Cloud Scale, Density, and Noise Intensity.

---

## 4. Current Task
- **Next Step:** Implement Phase 1 (Raymarching Engine) — ray-box intersection and
  basic density visualization inside the cube.
- **Then:** Phase 2a (Sphere SDF on GPU) — `smin`-blended sphere SDFs via storage buffer.
- **Then:** Phase 2b (CPU Sphere Generator) — grid + jitter + flatten + radius assignment.
- **Then:** Phase 2c (Replication) — iterative child sphere scattering.
- **Then:** Phase 2d (Shape Modes) — line-based and mesh-based sphere placement.

---

## 5. References
- **Houdini Cloud Modeling:** [https://www.sidefx.com/docs/houdini/model/cloud.html](https://www.sidefx.com/docs/houdini/model/cloud.html)
- **Blender Project:** `blender/CloudCreatorPro_Blender4.5.blend`
