All notable changes to this project will be documented in this file.

## 4.3.3
- Update three-mesh-bvh to 0.7.6
- Update three to r167
- Update to babylonjs 7.17.0
- Prevent frame camera on quickload voxels (holds the camera for further changes)
- Remove showSaveFilePicker, this experimental technology is not ready for production<br>
  Fix save file functionality in electron and mobile<br>
  Fix save format from .txt to .json in mobile

## 4.3.2
- Update to babylonjs 7.13.1
- Update to three r166
- Fix all convertToUnIndexedMesh related issues introduced by update
- Fix firefox scrollbars (broken by new firefox update)
- PT: fix frame camera when floor is checked (overflow, force update)

## 4.3.1
- Add merge-selected to export tab
- Add render source to PT (render baked meshes from export tab)<br>
  Fix multiple camera conflict, camera position returns to the selected source<br>
  Shortcut R respect selected source
- Add max-samples to PT (8-8192, 4096 default)
- Firefox optimization (fix save file, css styles, palette right-click)
- Update to babylonjs 7.10.0
- Fix workplanes undetected picking
- Fix attachableMeshes error in export tab
- Fix baked meshes visible in model tab under certain conditions
- Remove deprecated ini format to save resources

## 4.3.0 nightly
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
