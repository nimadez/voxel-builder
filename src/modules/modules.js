/* 
    Nov 2023
    @nimadez

    Modules
*/


import { WorkerPool } from '../libs/addons/WorkerPool.js';


export const workerPool = new WorkerPool();
workerPool.setWorkerCreator(() => {
    const worker = new Worker('modules/worker/worker.js', { type: "module" });
    worker.postMessage({ id: 'init' });
    return worker;
});


export { hover } from './interfaces/hover.js';
export { panels } from './interfaces/panels.js';
export { colorPicker } from './interfaces/colorpicker.js';
export { sandbox } from './sandbox/sandbox.js';
export { generator } from './generator/generator.js';
export { rcm, rcv } from './raycaster/raycaster.js';

export { ReinventedColorWheel } from "../libs/utils/reinvented-color-wheel.bundle.js";


console.log('init modules');
