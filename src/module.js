import * as pt from './modules/pathtracer/app.js';
import * as voxelizer from './modules/voxelizer/app.js';

window.ptActivate = pt.activate;
window.ptDeactivate = pt.deactivate;
window.ptToggle = pt.toggle;
window.ptIsActive = pt.isActive;
window.ptReset = pt.reset;
window.ptGetShot = pt.getShot;
window.ptDispose = pt.dispose;

window.voxelize = voxelizer.voxelize;
