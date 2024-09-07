All notable changes to this project will be documented in this file.

## 4.4.1 Unlocked
- Remove fullscreen engine-based loading screen
- Add universal progressbar at bottom
- Remove unnecessary camera framing behaviors
- New 'Async Bake' option (three.js worker, try 'bake color groups' to see the effect)
- Encapsulate BABYLON (90% done)
- Viewaxis-box frame voxel selection on transforms
- Fix PT not taking screenshot
- Fix bakery not respect the first voxel at 0,0,0
- Fix (almost) a few hundred milliseconds of startup lag (BABYLON.HDRCubeTexture locks the main thread - see 4.3.4)
- Animate the sandbox camera framing behavior similar to babylon.js

> - BABYLON.Quaternion.RotationAxis bug (the update of the babylon.js has been stopped, see 'setOverlayPlane()')

## 4.4.0 Sandbox
- Generator moved to modules
- Voxelizer moved to modules
- Less complex user-interface (no more hide-and-seek ui)
- Merge cameras for less confusion
- Officially multi-engine (new three.js sandbox tab)
- Match the sandbox hdri, camera and materials to babylon's PBR shader

> - The new three.js tab doesn't replace the current functionality, it's a new world and I won't reveal what it's for!

## 4.3.9 ES6
- Load main.js as module
- Manage and prepare axisview scene
- Encapsulate the babylon.js engine (prepare for webgpu)
- Functions to classes from bottom to top!
- Window is no longer used to transfer modules
- Terrain generator uses height-gradient when 'New Scene' unchecked
- Fix pointerdown conflict with the main scene when workplanes are active

> - Babylon will not be imported as a module, I will not use webpack, react, typescript and other corporate stuff.

## 4.3.8
- Add keyboard shortcuts (see about menu)
- Delete key can delete voxels during transforms
- Fix the debug layer, make it useful!
- Prepare for ES6 (cleanup the dom)

## 4.3.7
- New directory structure
- Improve project management and speed up the build time of github pages
- Update the update.py script

## 4.3.6
- Update three.js to r168
- New camera frame tools (frame to color group or selected voxels)
- Improve snapshots (prevent accidental touch)
- Voxel transformation preserves the floor plane when xforming all voxels
- Reduce the chance of accidental topbar touch
- Remove partial unbake due to impossible bug (will return after meeting the conditions)
- The space key works like the alt key to avoid conflict

> - The gap between babylon.js releases and our library update was extended.

## 4.3.5
- ~~Update to babylonjs 7.22.3~~
  - The update was rolled back (breaking bug: no mouseover on Z axis)
- New detachable floating panels!
- Improve websockets client and server
- Standalone node.js server (Electron alternative)
- Improve three.js module (less memory, faster load time)
- Fix camera-related visual artifacts (fov 0.1 issue)
- Add three.js WorkerPool library

> - The left button moves the panel, the center button hides the panel and the right button resets the panel to its original position and close it.

## 4.3.4 x1.5
- Faster startup time (avg. 2s to 0.5s - x1.5 faster)
- Change default PT material to lambert
- Remove color grading from FX mode
- Snapshot frames the camera
- Automatic camera framing (allow to work with a small group of voxels)
- Shortcut 'F' can be used to frame camera during voxel transformation
- New project generates 1 voxel
- Default ice color is used to generate new voxels (instead of selected color)
- Darker color theme, larger hover menu, axis view and color picker
- Improve hover code, we can use this to float multiple elements
- Improve and manage all the in-screen buttons
- Measure volume tool show XYZ position on single click
- Add 'new scene' option for terrain generator
- Reduce the chance of random holes on the terrain surface
- Allow double-click for color palette in desktop
- Add voxel by X,Y,Z direct coordinate input as string
- The websockets client has been rewritten (auto disconnect after 10 retries)
- New 'ws-connect.py' script, to connect with machine learning models
- Fix a bug when the startup project is heavy and the UI doesn't wait for it
- Fix a bug where you can't select the first voxel at 0,0,0

> - Please clear your browser cache or force reload voxel-builder
> - BABYLON.HDRCubeTexture seems to be responsible for the potential startup lag/freeze, but other optimizations were done to reach 0.5 second.

## 4.3.3
- Update three-mesh-bvh to 0.7.6
- Update three to r167
- Update to babylonjs 7.17.0
- Prevent frame camera on quickload voxels (holds the camera for further changes)
- Remove showSaveFilePicker, this experimental technology is not ready for production
  - Fix save file functionality in electron and mobile
  - Fix save format from .txt to .json in mobile

## 4.3.2
- Update to babylonjs 7.13.1
- Update to three r166
- Fix all convertToUnIndexedMesh related issues introduced by update
- Fix firefox scrollbars (broken by new firefox update)
- PT: fix frame camera when floor is checked (overflow, force update)

## 4.3.1
- Add merge-selected to export tab
- Add render source to PT (render baked meshes from export tab)
  - Fix multiple camera conflict, camera position returns to the selected source
  - Shortcut R respect selected source
- Add max-samples to PT (8-8192, 4096 default)
- Firefox optimization (fix save file, css styles, palette right-click)
- Update to babylonjs 7.10.0
- Fix workplanes undetected picking
- Fix attachableMeshes error in export tab
- Fix baked meshes visible in model tab under certain conditions
- Remove deprecated ini format to save resources

## 4.3.0 Nightly
> This version is a breath of fresh air after the SPS fallout
- Add tool indicator, display the name of the selected tool
- Add import voxels and bakes from json file
- Add voxel measurement tools
- New normal picking method eliminates bvh-picking (high performance picking by default)
- No more duplicate voxels (they are automatically removed with no performance penalty)
- Clean up and improve voxel transforms
- Update PT to support three r165 framebuffers
- Voxel colors are used for the point-cloud
- Fix unwanted camera rotation in most cases
- Fix PT crashes on 0.0 inputs
- Fix camera fov

### 4.2.9
- New power saver for PT and tools (enabled by default in mobile devices)
- CSS updates, new roboto font
- Linux compatibility checks
- Update floor plane to support linux and windows
- Update all dependencies
- Fix pixel-eyedropper tool in chromium for linux
- Fix bakery functionality
