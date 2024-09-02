/* 
    Nov 2023
    @nimadez
*/

import { bakery } from './bakery/bakery.js';
import { pt } from './pathtracer/pathtracer.js';
import { rc, rcv } from './raycaster/raycaster.js';
import { ws_client } from './websockets/client.js';
import { WorkerPool } from '../libs/addons/WorkerPool.js';
import { SimplexNoise } from '../libs/addons/SimplexNoise.js';

window.bakery = bakery;
window.pt = pt;
window.rc = rc;
window.rcv = rcv;
window.ws_client = ws_client;
window.SimplexNoise = SimplexNoise;

window.workerPool = new WorkerPool();
window.workerPool.setWorkerCreator(() => {
    const worker = new Worker('modules/worker/worker.js', { type: "module" });
    worker.postMessage({ id: 'init' });
    return worker;
});

console.log('load modules');
