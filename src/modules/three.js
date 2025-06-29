/* 
    Nov 2023
    @nimadez

    Three.js module
*/


import * as THREE from 'three';
import {
    acceleratedRaycast,
    computeBoundsTree, disposeBoundsTree,
    computeBatchedBoundsTree, disposeBatchedBoundsTree,
} from '../libs/three-mesh-bvh.js';


THREE.Mesh.prototype.raycast = acceleratedRaycast;
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;

THREE.BatchedMesh.prototype.raycast = acceleratedRaycast;
THREE.BatchedMesh.prototype.computeBoundsTree = computeBatchedBoundsTree;
THREE.BatchedMesh.prototype.disposeBoundsTree = disposeBatchedBoundsTree;


const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('canvas_three'),
    preserveDrawingBuffer: true,
    antialias: true,
    alpha: true
});

export { THREE, renderer };

console.log(`Three.js r${ THREE.REVISION } - WebGL2`);
