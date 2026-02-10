# Performance Optimization Plan

## 1. Problem Analysis

### Current Bottleneck
The `cloudSDF()` function in the fragment shader loops through **ALL spheres** for every sample point:

```wgsl
fn cloudSDF(p : vec3<f32>) -> f32 {
  var d = 1e10;
  for (var i = 0u; i < volumeUniforms.sphereCount; i++) {  // O(n) per call
    let s = spheres[i];
    d = smin(d, sphereSDF(p, s.xyz, s.w), k);
  }
  // ... noise calculations ...
  return d;
}
```

### Cost Breakdown (per frame)
| Stage | Operations |
|-------|------------|
| Pixels | ~2M (1920×1080) |
| Ray steps per pixel | 64 (renderSteps) |
| Light march steps | 6 (lightSteps) |
| SDF evaluations per pixel | 64 + (64 × 6) = **448** |
| Sphere iterations per SDF | ~200-500 (sphereCount) |
| **Total sphere checks per frame** | 2M × 448 × 300 = **~270 billion** |

This is why the renderer is slow — the sphere loop dominates everything.

---

## 2. Solution: Baked 3D SDF Texture

### The Idea
Pre-compute the SDF into a 3D texture using a **compute shader**, then sample the texture during raymarching instead of looping through spheres.

```
Before:  cloudSDF(p) → loop 300 spheres → return distance
After:   cloudSDF(p) → textureSample(sdfTexture, p) → return distance
```

### Benefits
| Metric | Before | After |
|--------|--------|-------|
| SDF lookup cost | O(sphereCount) | O(1) |
| Sphere loop | Every frame, every sample | Once per regeneration |
| Hardware acceleration | None | Trilinear filtering |
| Memory | ~5KB (sphere buffer) | ~16MB (128³ texture, rgba16float) |

### Tradeoffs
- **Memory usage**: 128³ × 4 bytes = 8MB (acceptable)
- **Precision loss**: Limited by voxel resolution (mitigated by trilinear filtering)
- **Regeneration cost**: Compute shader dispatch when spheres change (one-time cost)

---

## 3. Implementation Roadmap

### Phase 1: 3D Texture Infrastructure
- [ ] Create a 3D texture resource (`GPUTexture` with `dimension: '3d'`).
  > *Outcome:* A `GPUTexture` with format `r32float`, size 128×128×128, usage `STORAGE_BINDING | TEXTURE_BINDING`. This will hold the pre-computed SDF values. Texture dimensions are configurable via a `sdfResolution` parameter.

- [ ] Create a sampler for trilinear interpolation.
  > *Outcome:* A `GPUSampler` with `magFilter: 'linear'`, `minFilter: 'linear'` for smooth interpolation between voxels. Clamp-to-edge addressing to handle boundary samples.

- [ ] Add texture and sampler to the volume pipeline bind group.
  > *Outcome:* The fragment shader gains access to the 3D texture via `@binding(2) var sdfTexture : texture_3d<f32>` and `@binding(3) var sdfSampler : sampler`. Bind group layout updated to include both.

- [ ] Implement world-to-texture coordinate mapping.
  > *Outcome:* A helper function `worldToUVW(p, boxMin, boxMax) -> vec3<f32>` that maps a world-space position to normalized [0,1]³ texture coordinates based on the cloud's bounding box.

> **Phase 1 Expected Outcome:** The GPU infrastructure for a 3D SDF texture is in place — texture created, sampler configured, bind groups updated. No compute shader yet; the texture is empty. The fragment shader can attempt to sample it (will return 0).

---

### Phase 2: Compute Shader for SDF Baking
- [ ] Create a compute shader module for SDF evaluation.
  > *Outcome:* A new WGSL shader with `@compute @workgroup_size(8, 8, 8)` that evaluates the SDF at each voxel. The shader reads from the sphere storage buffer and writes to the 3D texture.

- [ ] Implement the compute shader kernel.
  > *Outcome:* Each thread computes one voxel:
  > ```wgsl
  > @compute @workgroup_size(8, 8, 8)
  > fn bakeSDF(@builtin(global_invocation_id) id : vec3<u32>) {
  >   let uvw = (vec3<f32>(id) + 0.5) / vec3<f32>(textureDimensions(sdfTexture));
  >   let worldPos = mix(boxMin, boxMax, uvw);
  >   var d = 1e10;
  >   for (var i = 0u; i < sphereCount; i++) {
  >     d = smin(d, sphereSDF(worldPos, spheres[i].xyz, spheres[i].w), smoothness);
  >   }
  >   textureStore(sdfTexture, id, vec4(d, 0.0, 0.0, 0.0));
  > }
  > ```

- [ ] Create the compute pipeline and bind group.
  > *Outcome:* A `GPUComputePipeline` with the bake shader. Bind group includes: sphere storage buffer (read), sphere count uniform, bounding box uniforms, smoothness uniform, and 3D texture (write via `storage_texture`).

- [ ] Dispatch the compute shader on sphere regeneration.
  > *Outcome:* `rebuildSpheres()` now dispatches the compute shader after uploading sphere data:
  > ```js
  > const workgroups = Math.ceil(sdfResolution / 8);
  > computePass.dispatchWorkgroups(workgroups, workgroups, workgroups);
  > ```
  > Console logs dispatch time for profiling.

> **Phase 2 Expected Outcome:** When spheres are regenerated, a compute shader runs once to fill the 3D texture with SDF values. The texture contains the smooth-blended distance field of all spheres. Dispatch completes in ~1-10ms depending on resolution and sphere count.

---

### Phase 3: Fragment Shader Integration
- [ ] Add a `sdfMode` uniform to toggle between baked and dynamic SDF.
  > *Outcome:* A new uniform `sdfMode : f32` (0.0 = dynamic/legacy, 1.0 = baked texture). GUI dropdown "SDF Mode" with options ["Dynamic", "Baked"]. Allows A/B comparison.

- [ ] Modify `cloudSDF()` to sample the 3D texture when in baked mode.
  > *Outcome:* The function checks `sdfMode` and branches:
  > ```wgsl
  > fn cloudSDF(p : vec3<f32>) -> f32 {
  >   var d : f32;
  >   if (volumeUniforms.sdfMode > 0.5) {
  >     // Baked mode: sample texture
  >     let uvw = (p - boxMin) / (boxMax - boxMin);
  >     d = textureSample(sdfTexture, sdfSampler, uvw).r;
  >   } else {
  >     // Dynamic mode: loop through spheres (legacy)
  >     d = 1e10;
  >     for (var i = 0u; i < sphereCount; i++) { ... }
  >   }
  >   // Apply noise, gradient, coverage as before
  >   return d;
  > }
  > ```

- [ ] Verify visual parity between dynamic and baked modes.
  > *Outcome:* Side-by-side comparison shows near-identical results. Minor differences at low texture resolutions are acceptable. Baked mode renders at significantly higher FPS.

> **Phase 3 Expected Outcome:** The fragment shader can now use the pre-baked 3D texture instead of looping through spheres. Visual quality is maintained. FPS increases dramatically (expect 5-20x improvement depending on sphere count).

---

### Phase 4: Noise Baking (Optional)
- [ ] Extend the compute shader to bake noise into the SDF texture.
  > *Outcome:* The compute shader applies billowy and wispy noise during baking:
  > ```wgsl
  > d += fbm3D(worldPos * billowyScale, 4) * billowyStrength;
  > d += fbm3D(worldPos * wispyScale, 3) * wispyStrength;
  > d -= coverage;
  > ```
  > This moves expensive noise calculations from per-frame to per-regeneration.

- [ ] Add "Bake Noise" checkbox to control whether noise is baked or computed live.
  > *Outcome:* GUI checkbox in Noise folder. When enabled, noise is part of the baked texture (faster but static). When disabled, noise is computed in the fragment shader (slower but animatable).

- [ ] Handle animated noise (time-varying) as a special case.
  > *Outcome:* If `timeScale > 0`, noise cannot be baked (it changes every frame). The shader automatically falls back to live noise computation when animation is enabled. A warning appears in the GUI: "Animation enabled — noise computed live."

> **Phase 4 Expected Outcome:** For static clouds, both SDF and noise are baked into the texture, maximizing performance. For animated clouds, noise remains live but the base SDF is still baked, providing partial speedup.

---

### Phase 5: Resolution & Quality Controls
- [ ] Add `sdfResolution` parameter (32, 64, 128, 256).
  > *Outcome:* GUI dropdown "SDF Resolution" in a new "Performance" folder. Lower = faster baking + less memory, higher = more detail. Default 128. Texture is recreated when resolution changes.

- [ ] Implement resolution-adaptive quality.
  > *Outcome:* At lower resolutions, trilinear filtering smooths voxel artifacts. For very low res (32³), consider adding a small noise offset in the fragment shader to hide stair-stepping.

- [ ] Add render resolution scaling (render at 0.5x, upscale).
  > *Outcome:* New `renderScale` parameter (0.25, 0.5, 0.75, 1.0). Canvas renders at `width * renderScale`, then CSS scales to full size. Combined with baked SDF, this can achieve 60fps on modest hardware.

> **Phase 5 Expected Outcome:** Full control over the quality/performance tradeoff. Artists can choose high resolution for final renders and low resolution for interactive editing. The combination of baked SDF + render scaling makes the renderer viable on a wide range of hardware.

---

## 4. Task Checklist

### Phase 1: 3D Texture Infrastructure
- [x] Create 3D texture resource
- [x] Create trilinear sampler
- [x] Update bind group layout (add texture + sampler to shader and bind group)
- [x] Implement coordinate mapping function

### Phase 2: Compute Shader
- [x] Write compute shader WGSL
- [x] Create compute pipeline
- [x] Create compute bind group
- [x] Dispatch on regeneration
- [x] Add profiling/logging

### Phase 3: Fragment Shader Integration
- [x] Add sdfMode uniform
- [x] Modify cloudSDF() to sample texture
- [x] Add GUI toggle
- [ ] Verify visual parity
- [ ] Measure performance improvement

### Phase 4: Noise Baking (Optional)
- [ ] Bake billowy noise into texture
- [ ] Bake wispy noise into texture
- [ ] Add "Bake Noise" toggle
- [ ] Handle animated noise fallback

### Phase 5: Quality Controls
- [ ] Add sdfResolution parameter
- [ ] Recreate texture on resolution change
- [ ] Add renderScale parameter
- [ ] Test on various hardware

---

## 5. Expected Performance Gains

| Configuration | Before (FPS) | After (FPS) | Improvement |
|---------------|--------------|-------------|-------------|
| 300 spheres, 1080p | ~5-10 | ~60+ | 6-12x |
| 500 spheres, 1080p | ~2-5 | ~60+ | 12-30x |
| 300 spheres, 4K | ~1-2 | ~30+ | 15-30x |

The baked SDF approach should bring the renderer from "slideshow" to "real-time interactive" for typical cloud configurations.

---

## 6. References
- [WebGPU Compute Shaders](https://www.w3.org/TR/webgpu/#compute-pass-encoder)
- [3D Textures in WebGPU](https://www.w3.org/TR/webgpu/#texture-3d)
- [SDF Baking Techniques](https://iquilezles.org/articles/distfunctions/)
