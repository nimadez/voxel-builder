/* 
    Nov 2023
    @nimadez
*/

import { WorkerPool } from '../libs/addons/WorkerPool.js';

export const workerPool = new WorkerPool();
workerPool.setWorkerCreator(() => {
    const worker = new Worker('modules/worker/worker.js', { type: "module" });
    worker.postMessage({ id: 'init' });
    return worker;
});

export { bakery } from './bakery/bakery.js';
export { pt } from './pathtracer/pathtracer.js';
export { rc, rcv } from './raycaster/raycaster.js';
export { ws_client } from './websockets/client.js';
export { SimplexNoise } from '../libs/addons/SimplexNoise.js';

console.log('load modules');
