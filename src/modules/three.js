/* 
    Nov 2023
    @nimadez
*/

import * as THREE from 'three';
import {
    computeBoundsTree, disposeBoundsTree, acceleratedRaycast
} from '../libs/three-mesh-bvh.module.js';


THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;


export const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('canvas_three'),
    //precision: "mediump",
    preserveDrawingBuffer: true,
    antialias: true,
    alpha: true
});


export { THREE };
export { OrbitControls } from '../libs/addons/OrbitControls.js';
export { TransformControls } from '../libs/addons/TransformControls.js';
export { FullScreenQuad } from '../libs/addons/Pass.js';
export { RGBELoader } from '../libs/addons/RGBELoader.js';
export { SimplexNoise } from '../libs/addons/SimplexNoise.js';
export { mergeGeometries } from '../libs/addons/BufferGeometryUtils.js';
export {
    MeshBVHUniformStruct, //MeshBVH, CENTER, SAH
    FloatVertexAttributeTexture, //UIntVertexAttributeTexture
    shaderStructs, shaderIntersectFunction //shaderDistanceFunction
} from '../libs/three-mesh-bvh.module.js';
export { Tween, Easing } from '../libs/addons/tween.esm.js';


console.log('load three.js modules');
