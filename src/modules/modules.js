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
export { palette } from './interfaces/palette.js';
export { confirm } from './interfaces/confirm.js';
export { colorPicker } from './interfaces/colorpicker.js';
export { sandbox } from './sandbox/sandbox.js';
export { generator } from './generator/generator.js';
export { voxelizer } from './raycaster/voxelizer.js';
export { translator } from './translator.js';
export { exporters } from './exporters/exporters.js';
export { exportersVox } from './exporters/magicavoxel.js';
export { loaders } from './loaders/loaders.js';

export { ReinventedColorWheel } from "../libs/utils/reinvented-color-wheel.bundle.js";


console.log('init modules');
