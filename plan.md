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
- [x] Implement Ray-Box (AABB) intersection logic in the vertex/fragment shader.
  > *Outcome:* `intersectAABB()` function in WGSL uses the slab method to return `(tNear, tFar)` for any ray against the `[-1,1]³` cube. Rays that miss the box are discarded (fragment outputs transparent black).
- [x] Create the core Raymarching loop (stepping through the volume).
  > *Outcome:* Fragment shader steps 64 samples from `tNear` to `tFar`, accumulating opacity via Beer's Law (`transmittance *= exp(-density * stepSize)`). Early exit when transmittance < 0.01.
- [x] Implement a basic "Density" sample based on the cube's bounds.
  > *Outcome:* `sampleDensity(p)` evaluates a sphere SDF at origin (radius 0.5) and returns a `smoothstep` density — 1.0 inside, 0.0 outside, with a soft 0.2-unit transition edge.
- [x] Update `shaderCode` to include a dedicated volume rendering pass.
  > *Outcome:* A second render pipeline (triangle-list, alpha-blended) draws a full-screen quad after the wireframe. Both pipelines share one render pass.

> **Phase 1 Expected Outcome:** A semi-transparent white sphere fog (radius 0.5) centered in the wireframe cube, rendered via a full-screen quad with alpha blending. The grid floor and green wireframe remain visible through the fog. The sphere has smooth, soft edges (not a hard cutoff) produced by `smoothstep` density and Beer's Law transmittance.

### Phase 2: Cloud Shape

#### 2a. GPU Sphere SDF Foundation
- [x] Implement `sphereSDF(p, center, radius)` in WGSL.
  > *Outcome:* A helper function `sphereSDF(p, center, radius) -> f32` returns the signed distance from point `p` to a sphere surface. Negative inside, positive outside.
- [x] Implement `smin(a, b, k)` (polynomial smooth-min) for blending sphere SDFs.
  > *Outcome:* A polynomial smooth-min function that blends two SDF values with smoothness factor `k`. Where two spheres overlap, their surfaces merge into a smooth organic join instead of a hard intersection.
- [x] Create a `cloudSDF(p)` function that loops over a storage buffer of spheres
      and returns the smooth-union of all sphere distances.
  > *Outcome:* `cloudSDF(p)` iterates over all spheres in the storage buffer, calling `sphereSDF` for each and accumulating with `smin`. Returns a single blended distance value representing the entire cloud shape.
- [x] Create the storage buffer + bind group for sphere data (`vec4[]`: xyz=center, w=radius).
  > *Outcome:* A GPU storage buffer holds an array of `vec4` (xyz = center, w = radius). A separate uniform holds `sphereCount`. Both are bound to the volume pipeline via a new bind group entry.
- [x] Upload a few hand-placed test spheres and visualize the SDF in the raymarcher.
  > *Outcome:* 3–5 test spheres at hand-picked positions (e.g. one at origin, others offset) with varying radii. The raymarcher's `sampleDensity` now calls `cloudSDF` instead of the hardcoded single sphere.

> **Phase 2a Expected Outcome:** The single hardcoded sphere is replaced by 3–5 hand-placed test spheres of varying sizes that smoothly blend into each other via `smin`. The result looks like an organic, blobby mass — overlapping spheres merge seamlessly without visible seams. Sphere data is driven by a GPU storage buffer, not hardcoded in the shader.

#### 2b. CPU Sphere Generator (mirrors Blender `AL_CloudCreator_Generator`)
- [x] **Grid generation:** Create a 2D grid of points along two axes
      (`length × width`), spaced by `pointSeparation`.
  > *Outcome:* A JavaScript function generates a flat 2D grid of `(x, z)` positions. For example, `length=5, width=3, pointSeparation=0.3` produces a 5×3 grid of evenly spaced points in the XZ plane.
- [x] **Random jitter:** Offset each point by `random[-1,1]³ × pointSeparation`
      (seeded RNG for reproducibility).
  > *Outcome:* Each grid point is displaced randomly in X, Y, and Z by up to `±pointSeparation`. A seeded PRNG ensures the same seed always produces the same layout.
- [x] **Flatten bottom:** Clamp Z values below a configurable threshold.
  > *Outcome:* Any sphere whose Y coordinate falls below the `flattenBottom` threshold has its Y clamped to that value, producing a flat base.
- [x] **Assign radius:** `pointSeparation × randomUniform(0.90, 1.42)` per sphere.
  > *Outcome:* Each sphere gets a radius of `pointSeparation * random(0.90, 1.42)`, so neighboring spheres vary slightly in size for natural irregularity.
- [x] **Upload & verify:** Push sphere array to GPU, confirm cloud blob renders.
  > *Outcome:* The generated sphere array is written to the GPU storage buffer. The raymarcher renders the full set as a single blobby cloud mass inside the wireframe cube.

> **Phase 2b Expected Outcome:** A roughly elliptical cloud blob made of ~20–50 spheres arranged in a jittered grid pattern. The bottom is flat (clamped), the top is rounded. Each sphere has a slightly different radius (0.90–1.42× base), giving the shape natural irregularity. The blob fills roughly half the wireframe cube and reads as a crude cumulus base shape.

#### 2c. Sphere Replication (mirrors Blender Repeat Zone)
- [x] **Replication loop** (N iterations, configurable):
      For each existing sphere, scatter M child points on its surface
      (uniform random directions at parent radius distance).
  > *Outcome:* Each iteration walks the current sphere list, generates M random directions per sphere, and places child spheres on the parent's surface at those directions. Children are added to the list for the next iteration.
- [x] **Shrinking scale:** Child radius = `parentRadius × scaleMult` per iteration.
  > *Outcome:* Each iteration's children are smaller than their parents (e.g. `scaleMult=0.6`). After 3 iterations: base → 60% → 36% → 22% of original radius, creating progressively finer detail.
- [x] **Random thinning:** Keep only a fraction of children (probability mask)
      for organic variation.
  > *Outcome:* A `keepProbability` (e.g. 0.5) randomly discards some children each iteration. This prevents exponential blowup and creates irregular, natural-looking gaps in the surface detail.
- [x] **Join:** Append child spheres to the master array, re-upload to GPU.
  > *Outcome:* All spheres (original + all replication passes) are concatenated into one flat array and re-uploaded to the storage buffer. `sphereCount` uniform is updated to the new total.

> **Phase 2c Expected Outcome:** The base cloud blob from 2b now has bumpy, cauliflower-like surface detail. Each replication iteration adds progressively smaller spheres on the surface of existing ones, creating fractal-like organic protrusions. With 2–3 iterations, the sphere count grows to ~200–500. The shape looks noticeably more cloud-like than the smooth blob from 2b — lumpy and irregular with varied scale detail.

#### 2d. Shape Modes
- [x] **Mode A — Cumulus (Generate):** Grid-based sphere generation with jitter, flatten, and replication (`generateCumulus()`).
  > *Outcome:* Refactored from `generateCloudSpheres`. Produces a flat-bottomed, puffy cumulus shape via a 2D grid of jittered spheres with 2 replication iterations. Replication logic extracted into reusable `replicateSpheres()` helper.
- [x] **Mode B — Wispy (From Curve):** Polyline backbone with sine-profile radii (`generateWispy()`).
  > *Outcome:* 14 spheres placed along a 7-point S-curve polyline with small jitter. Sine profile makes spheres thicker in the middle and thinner at the ends. 1 replication iteration with 3 children produces an elongated wispy cloud.
- [x] **Mode C — Ellipsoid (From Mesh):** Implicit ellipsoid volume fill (`generateEllipsoid()`).
  > *Outcome:* 3D grid fill inside an implicit ellipsoid (radii 0.7/0.5/0.6, step 0.2). Sphere radius proportional to distance from surface + jitter. 1 replication iteration produces a dense elliptical cloud mass.
- [x] **Shape switching:** lil-gui dropdown with `rebuildSpheres()` for live GPU buffer rebuild.
  > *Outcome:* "Shape" dropdown in GUI switches between Cumulus/Wispy/Ellipsoid. `rebuildSpheres()` destroys old GPU buffer, creates new storage buffer + bind group, updates sphere count. All three modes produce visibly different silhouettes.

> **Phase 2d Expected Outcome:** Three distinct ways to define cloud shapes: (A) manually specify sphere positions/radii for precise control, (B) draw a curve and spheres automatically distribute along it — useful for elongated wispy clouds, (C) provide a mesh and spheres fill its interior — useful for arbitrary shapes. Switching between modes produces visibly different cloud silhouettes while all feeding the same SDF pipeline.

#### 2e. Density Gradient
- [x] Implement a vertical density falloff: denser at the bottom, softer at the top.
  > *Outcome:* `cloudSDF` applies height-based erosion via `smoothstep(gradientBottom, gradientTop, p.y) * gradientStrength`, pushing the SDF outward at higher Y values. The cloud surface erodes at the top while remaining solid at the base.
- [x] Make the gradient configurable (height range, falloff curve).
  > *Outcome:* GUI "Density Gradient" folder with Bottom (-1..1), Top (-1..1), and Strength (0..1) controls. Strength defaults to 0 (off). Values passed as uniforms to the shader each frame.
- [x] Auto-fitting bounding box for the wireframe cube and raymarcher AABB.
  > *Outcome:* `computeBounds()` scans all sphere centers ± radii with padding. Both the green wireframe cube vertices and the shader's `intersectAABB` use dynamic `boxMin`/`boxMax` uniforms. Bounds auto-update on every regeneration.

> **Phase 2e Expected Outcome:** The cloud is no longer uniform density throughout — the bottom half appears thicker/more opaque (denser core), while the top gradually fades out with wispy, translucent edges. This mimics real cumulus clouds where moisture is densest at the base. Adjusting the gradient parameters visibly shifts where the dense-to-transparent transition occurs.

> **Phase 2 Overall Outcome:** An organic, cumulus-shaped cloud form inside the wireframe cube, built from hundreds of smooth-blended spheres with fractal surface detail and height-based density variation. The shape is recognizably cloud-like even without noise — a lumpy, flat-bottomed, rounded-top mass with natural irregularity.

### Phase 3: Noise & Detail
- [x] Implement a 3D Noise function in WGSL (Perlin or Simplex).
  > *Outcome:* Hash-based 3D gradient noise (`noise3D`) in WGSL using `hash33` for gradient generation. Smooth Hermite interpolation (`3t²-2t³`) produces continuous values with no visible grid artifacts.
- [x] Create a Fractional Brownian Motion (fBm) wrapper for multi-layered detail.
  > *Outcome:* `fbm3D(p, octaves)` layers multiple `noise3D` calls. Each octave doubles frequency and halves amplitude, producing natural multi-scale detail.
- [x] Integrate large-scale fBm noise to erode the SDF edges ("Billowy Noise").
  > *Outcome:* `cloudSDF` adds `fbm3D(p * billowyScale, 4) * billowyStrength`. Low-frequency noise pushes the cloud surface in and out, creating rolling bumps and cavities. GUI: Billowy Scale (0.5–5.0), Billowy Strength (0–0.5).
- [x] Add a second layer of high-frequency noise for soft edges ("Wispy Noise").
  > *Outcome:* `cloudSDF` adds `fbm3D(p * wispyScale, 3) * wispyStrength`. High-frequency noise dissolves hard edges into soft wisps. GUI: Wispy Scale (2–20), Wispy Strength (0–0.3).
- [x] Match Blender controls: `Coverage`, `Billowy Factor`, and multi-scale noise blend
      (`Big Scale`, `Mid Scale`, `Small Scale`).
  > *Outcome:* `Coverage` uniform shifts the entire SDF inward/outward (`d -= coverage`). Positive = puffier, negative = eroded. Two noise layers (billowy + wispy) with independent scale/strength. GUI: Coverage (-0.5 to 0.5).
- [x] Add a Z-based shaping block: `Zpadding` and `FlipZ`.
  > *Outcome:* `zPadding` clips the cloud at top/bottom bounds using smoothstep masks — pushes SDF outward near the bounding box edges, trimming the cloud. `flipZ` inverts the gradient direction (erode bottom instead of top). Both added to the "Density Gradient" GUI folder. Z Offset and ZBlur already covered by existing Bottom/Top/Strength controls.

> **Phase 3 Expected Outcome:** The smooth sphere-blob cloud from Phase 2 transforms into a realistic, detailed cloud. Large-scale "billowy" noise creates dramatic rolling shapes and deep cavities in the silhouette. Fine "wispy" noise adds soft, fuzzy edges that dissolve into the air. Three noise scales (big ~0.1, mid ~4.12, small ~12.0) layer together for multi-frequency detail. The `Coverage` parameter controls overall cloud size (more coverage = puffier), `Billowy Factor` controls the intensity of large deformations, and Z-shaping parameters sculpt the vertical profile. The result closely matches the Blender CloudCreatorPro reference — a photorealistic cloud silhouette with organic, non-repeating detail.

### Phase 4: Lighting & Refinement
- [ ] Implement Beer's Law for light absorption (translucency).
  > *Outcome:* Light transmittance through the cloud follows `exp(-absorption * density * distance)`. Dense regions appear darker/more opaque when lit from behind; thin regions glow with transmitted light. This replaces the current uniform white color with physically-based attenuation.
- [ ] Add a simple "Sun" light source.
  > *Outcome:* A directional light defined by a `lightDirection` uniform vector and `lightColor`. The cloud's illumination varies across its surface — the sun-facing side is bright, the opposite side is in shadow.
- [ ] Implement "directional scattering" (sampling density towards the light).
  > *Outcome:* At each raymarch sample, a secondary march toward the light direction estimates how much cloud material the light must pass through to reach that point. Points deep inside or on the shadow side receive less light; points near the sun-facing surface receive full illumination. This creates realistic self-shadowing within the cloud.
- [ ] Optimize step size and performance.
  > *Outcome:* Adaptive step sizing: large steps through empty space (low density), smaller steps in dense regions for accuracy. Optional early-exit refinements and reduced light-march step counts. Target: interactive frame rates (30+ FPS) with ~200 spheres and noise.
- [ ] Add optional "dual-volume" style shading (two anisotropy settings) to mimic
      the Blender group behavior.
  > *Outcome:* Two Henyey-Greenstein phase functions (anisotropy ~0.5 and ~0.9) are evaluated and blended. The low-anisotropy term provides soft, diffuse in-scattering. The high-anisotropy term creates a bright forward-scattering halo (silver lining) when viewed near the sun direction. Combined, they produce the characteristic dual-tone look of the Blender reference.

> **Phase 4 Expected Outcome:** The cloud gains realistic lighting — bright on the sun-facing side, shadowed on the opposite side, with light scattering through thin areas (silver lining effect). Self-shadowing creates depth and dimension. The dual-volume shading produces both soft diffuse scattering and bright forward-scattering halos. Performance is optimized for interactive frame rates. The cloud looks volumetric and three-dimensional — not flat.

### Phase 5: Interaction (Optional)
- [ ] Add UI controls for Cloud Scale, Density, and Noise Intensity.
  > *Outcome:* An on-screen control panel with sliders for: cloud scale (overall size), density (opacity/thickness), noise intensity (detail level), coverage, billowy factor, and light direction. Each slider writes to its corresponding GPU uniform. Changes are reflected in the next frame — real-time interactive feedback with no reload required.

> **Phase 5 Expected Outcome:** Artists can experiment with cloud shapes interactively. Dragging sliders immediately updates the cloud's appearance in the viewport — adjusting size, density, noise detail, and lighting without editing code.

---

## 4. Current Task
- [x] ~~Phase 1 (Raymarching Engine) — ray-box intersection and basic density visualization.~~
- [x] ~~Phase 2a (Sphere SDF on GPU) — `smin`-blended sphere SDFs via storage buffer.~~
- [x] ~~Phase 2b (CPU Sphere Generator) — grid + jitter + flatten + radius assignment.~~
- [x] ~~Phase 2c (Replication) — iterative child sphere scattering.~~
- [x] ~~Phase 2d (Shape Modes) — Cumulus/Wispy/Ellipsoid with lil-gui switching.~~
- [x] ~~Phase 2e (Density Gradient) — vertical density falloff + auto-fitting bounding box.~~
- [x] ~~Phase 3 (Noise & Detail) — 3D noise, fBm, billowy + wispy noise, coverage, Z-shaping.~~
- **Next Step:** Phase 4 (Lighting & Refinement) — Beer's Law, sun light, directional scattering.

---

## 5. Blender Parameter Mapping (Future Work)

Reference: `AL_CloudCreator_Generator` panel in Blender.

### Already Implemented
| Blender Param | Our Param | Notes |
|---|---|---|
| Seed | `seed` | RNG seed for reproducibility |
| PointSeparation | `pointSeparation` | Grid spacing between base spheres |
| FlattenBottom | `flattenBottom` | Clamp Y below threshold |
| Children > Iterations | `iterations` | Replication passes |
| Children > ScaleMult | `scaleMult` | Child sphere scale factor |

### To Add Later
| Blender Param | Value | What It Does | How to Map |
|---|---|---|---|
| Cloud Specie | Fractus, Cumulus, etc. | Cloud type preset | Extend Shape dropdown with presets that set multiple params at once |
| Length / Width | 1.0 / 0.25 | Grid dimensions as continuous values | Replace integer `gridX`/`gridZ` with length-based sizing: `gridX = Math.round(length / pointSeparation)` |
| Scale | 7.0 | Overall scale multiplier | New uniform — multiply all sphere positions + radii before upload |
| Distortion | 3.0 | Noise-based position warping amplitude | Apply 3D noise displacement to sphere positions after grid placement |
| DistortionSeed | 0 | Separate seed for distortion noise | Second RNG or noise seed offset |
| Displacement > Iterations | 5 | Mesh subdivision passes before volume conversion | Less relevant for SDF raymarching; could apply iterative noise refinement |
| Displacement > Displacement | 2.0 | Noise amplitude on vertices | Post-generation noise offset on sphere positions (pairs with Phase 3 noise) |
| Displacement > Spread | 0.3 | How far displacement reaches | Noise frequency/falloff control |
| Displacement > Cleanup | 1.0 | Remove small/isolated pieces | Cull spheres below a radius threshold or isolated from neighbors |
| Children > Density | 10.0 | Points scattered per face | Maps to `childrenPerSphere` — Blender uses higher values because it scatters on mesh faces |

### Notes
- The **Displacement** section is the biggest gap — it adds organic irregularity beyond sphere placement by warping positions with noise. This pairs naturally with Phase 3 (noise) since it's applying noise-based offsets to sphere geometry on the CPU before the shader noise adds surface detail.
- **Cloud Specie** presets could be a convenience feature: selecting "Fractus" auto-sets grid size, separation, iterations, etc. to known-good values for that cloud type.
- **Scale** is straightforward but important for fitting clouds into different scene sizes.

---

## 6. References
- **Houdini Cloud Modeling:** [https://www.sidefx.com/docs/houdini/model/cloud.html](https://www.sidefx.com/docs/houdini/model/cloud.html)
- **Blender Project:** `blender/CloudCreatorPro_Blender4.5.blend`
