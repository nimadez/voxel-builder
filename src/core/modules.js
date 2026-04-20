/* 
    Nov 2023
    @nimadez

    Core Modules
*/


import { VERSION } from '../app.js';
import * as THREE from 'three';
import {
    acceleratedRaycast,
    computeBoundsTree, disposeBoundsTree,
    computeBatchedBoundsTree, disposeBatchedBoundsTree
} from 'three-mesh-bvh';
import { WorkerPool } from 'three/examples/jsm/utils/WorkerPool.js';


export { colorPicker, createColorPickerInScreen } from './interfaces/colorpicker.js';
export { confirm } from './interfaces/confirm.js';
export { exporters } from './exporters/exporters.js';
export { exportersVox } from './exporters/magicavoxel.js';
export { generator } from './generator/generator.js';
export { hover } from './interfaces/hover.js';
export { loaders } from './loaders/loaders.js';
export { palette } from './interfaces/palette.js';
export { panels } from './interfaces/panels.js';
export { sandbox } from './sandbox/sandbox.js';
export { translator } from './translator.js';
export { voxelizer } from './raycaster/voxelizer.js';


THREE.Mesh.prototype.raycast = acceleratedRaycast;
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.BatchedMesh.prototype.raycast = acceleratedRaycast;
THREE.BatchedMesh.prototype.computeBoundsTree = computeBatchedBoundsTree;
THREE.BatchedMesh.prototype.disposeBoundsTree = disposeBatchedBoundsTree;
export { THREE };


export const workerPool = new WorkerPool();
const worker = new Worker('core/worker/worker.js', { type: "module" });
worker.postMessage({ id: 'init' });
workerPool.setWorkerCreator(() => {
    return new Worker('core/worker/worker.js', { type: "module" });
});


console.log(`V-Core ${ VERSION }`);
console.log(`Three.js r${ THREE.REVISION } - WebGL2`);
