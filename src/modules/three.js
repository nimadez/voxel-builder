/* 
    Nov 2023
    @nimadez
*/


import * as THREE from 'three';
import {
    computeBoundsTree, disposeBoundsTree, acceleratedRaycast,
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
    //precision: "mediump",
    preserveDrawingBuffer: true,
    antialias: true,
    alpha: true
});


export { THREE, renderer };

console.log('load three.js modules');
