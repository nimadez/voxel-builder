/* 
    Nov 2023
    @nimadez
*/

import { bakery } from './bakery/bakery.js';
import { pt } from './pathtracer/pathtracer.js';
import { rc, voxelizeMesh, voxelizeBake } from './raycaster/raycaster.js';
import { WorkerPool } from '../libs/addons/WorkerPool.js';
import { SimplexNoise } from '../libs/addons/SimplexNoise.js';

const workerPool = new WorkerPool();
workerPool.setWorkerCreator(() => {
    const worker = new Worker('modules/worker/worker.js', { type: "module" });
    worker.postMessage({ id: 'init' });
    return worker;
});

window.bakery = bakery;
window.pt = pt;
window.rc = rc;
window.voxelizeMesh = voxelizeMesh;
window.voxelizeBake = voxelizeBake;
window.workerPool = workerPool;
window.SimplexNoise = SimplexNoise;
