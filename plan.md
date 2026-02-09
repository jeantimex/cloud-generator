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
- **Geometry Nodes:** Uses procedural generation (spheres/points) to create the "Bulk."
- **Volume Object:** Uses a dedicated Volume type (similar to VDB) to store density.
- **Principled Volume Shader:** Handles light scattering (Henyey-Greenstein anisotropy) and absorption.
- **Match:** The workflow is consistent with Houdini: **SDF Base -> Volume Conversion -> Noise Modulation**.

---

## 2. Implementation Strategy (The WebGPU Way)

Since we are rendering inside a fixed Cube Container, we will use **Raymarching**.

### The Cloud Function
We will define a Density Function `D(p)` where `p` is a point in 3D space:
1.  **SDF Base:** Calculate distance to one or more spheres.
2.  **Noise Injection:** Subtract 3D Noise from the SDF value to create "erosion" and "wisps."
3.  **Thresholding:** Convert the SDF value into a density value (0.0 to 1.0).

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

### Phase 1: Foundation & Noise
- [ ] Implement a 3D Noise function in WGSL (Perlin or Simplex).
- [ ] Create a Fractional Brownian Motion (fBm) wrapper for multi-layered detail.
- [ ] Update `shaderCode` to include a dedicated volume rendering pass.

### Phase 2: Raymarching Engine
- [ ] Implement Ray-Box (AABB) intersection logic in the vertex/fragment shader.
- [ ] Create the core Raymarching loop (stepping through the volume).
- [ ] Implement a basic "Density" sample based on the cube's bounds.

### Phase 3: Cloud Shaping (The "Houdini" Look)
- [ ] Implement Sphere SDF as the base cloud shape.
- [ ] Integrate fBm noise to erode the SDF edges (Billowy effect).
- [ ] Add a second layer of high-frequency noise for the "Wispy" effect.
- [ ] Implement a "Density Gradient" to make the bottom of the cloud flatter/denser.
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
- **Next Step:** Implement Phase 1 (3D Noise and fBm) and the Ray-Box intersection.
- **Immediate Follow-up:** Extract Blender node properties (Math ops, Map Range clamps,
  Mix blend types, Attribute names) to mirror the exact density function.

---

## 5. References
- **Houdini Cloud Modeling:** [https://www.sidefx.com/docs/houdini/model/cloud.html](https://www.sidefx.com/docs/houdini/model/cloud.html)
- **Blender Project:** `blender/CloudCreatorPro_Blender4.5.blend`
