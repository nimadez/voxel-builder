All notable changes to this project will be documented in this file.

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
