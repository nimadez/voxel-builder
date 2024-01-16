/* 
    Nov 2023
    @nimadez

    Modules entry point
*/

import { worker } from './modules/worker/worker.js';
import { baker } from './modules/baker/baker.js';
import { pt } from './modules/pathtracer/pathtracer.js';
import { rc, voxelizeMesh, voxelizeBake } from './modules/raycaster/raycaster.js';
import { SimplexNoise } from './modules/three.js';

window.worker = worker;
window.baker = baker;
window.pt = pt;
window.rc = rc;
window.voxelizeMesh = voxelizeMesh;
window.voxelizeBake = voxelizeBake;
window.simplexNoise = SimplexNoise;
