import * as pathtracer from './modules/pathtracer/app.js';
import * as voxelizer from './modules/voxelizer/app.js';

window.pt = pathtracer.pt;
window.ptIsActive = pathtracer.isActive;

window.voxelize = voxelizer.voxelize;
window.voxelizeInner = voxelizer.voxelizeInner;
