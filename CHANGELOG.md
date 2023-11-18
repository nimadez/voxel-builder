## 4.1.2 nightly
- Babylon.js updated to 6.29.2
- Fix lambert material
- Optimize pt shader performance
- Manage and refactor pathtracer code
- Update blender-importer script for blender 4
- Add optional opaque background for pt
- Reduce shader calculations (move to cpu)
- Add basic directional sun light
- New universal and dynamic sun-locator system
- PT sun direction is equal to babylon.js scene
- PT hdri is merged with babylon.js scene
- Sort all the scene lighting functions (funcs to class)
- in progress...

## 4.1.1
- Fix bvh voxelizer floor issue
- Simplified the hover menu
- Render tab renamed to sandbox
- Gravity is enabled in sandbox (see wiki)
- Optimize and cleanup pt shader
- Speed up bvh generation
- Take care of ibl clamp (support all hdr images now)
- Add multi-pass rendering
- Fix chrome save-as dialog (navigator.vendor has been deprecated)

## 4.1.0
- Fix the uvs in bakery mode, grid texture enabled
- Metallic replaced roughness
- Equalize babylon.js hdri for pt
- Voxelizer updated to use BVH by default
- Fix major lighting issue
- Speed up override-colors, no bvh regeneration
- Implant the multi-material system (unused, see comments)
- New floor generator, create floor and stand for pt renders
- Add optional post-process effects

## 4.0.9
- PT supports bakery
- Add keyboard shortcut R for pt renderer
- Optimize and speed up the bake-to-mesh process
- Manage and speed up pt activation
- Remove biased mode, merged with fast-mode
- Fix metallic roughness and camera aperture
- Speed up rendering in general
- Screenshot is now allowed for pt
- Optimize pt camera navigation performance
- Add grid texture in bakery mode

## 4.0.8
- Add progress bar
- Add optional emissive color
- Add optional ground
- Add metallic material
- Add hdri loader
- Add camera focal length
- Add render modes
- Remove app iframes, they slow down everything
- Update hover to use cpu only (free the gpu for pt)
- Update workplane to support remove, box-remove, box-hide tools
- Symmetry supported for box-paint and box-hide tools

## 4.0.7
- Split the source code (vscode freezes a lot, html issue)
- The first step towards modules (see wiki)
- Match cameras in all 3 modes
- Add a basic pathtracer based on three-mesh-bvh
- Add "root/modules" directory for all the user modules
- Add cornell-box sample to play around! (for gi tests)

## 4.0.6
- Add reset button to workplane gizmo
- Update engine to 6.26.0
- Improve rendering in all 3 modes
- Lots of minor improvements

## Recent changes from 4.0.3 to 4.0.5
- Add GLTF, OBJ, STL export options
- Add more items to VBX project
- Add height option to sun-light
- Add backface-culling option to bakery
- Add numeric inputs to material properties
- New store and apply material
- Update engine to 6.23.0
- Update electron package for the windows build 
- Update screenshot to 4x on all platforms
- Improve font and visuals
- Improve the accessibility of babylon.js inspector (+ offline support)
- Improve and manage colorpickers (improve ui performance)
- Fix invisible palette when loading vbx in bakery/render modes
