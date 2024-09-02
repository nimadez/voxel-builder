/* 
    Nov 2023
    @nimadez
*/

import { BufferGeometry, Mesh } from 'three';
import {
    computeBoundsTree, disposeBoundsTree, acceleratedRaycast
} from '../libs/three-mesh-bvh.module.js';

BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
Mesh.prototype.raycast = acceleratedRaycast;

export * as THREE from 'three';
export { OrbitControls } from '../libs/addons/OrbitControls.js';
export { FullScreenQuad } from '../libs/addons/Pass.js';
export { RGBELoader } from '../libs/addons/RGBELoader.js';
export { mergeGeometries } from '../libs/addons/BufferGeometryUtils.js';
export {
    MeshBVHUniformStruct, //MeshBVH, CENTER, SAH
    FloatVertexAttributeTexture, //UIntVertexAttributeTexture
    shaderStructs, shaderIntersectFunction //shaderDistanceFunction
} from '../libs/three-mesh-bvh.module.js';

console.log('load three.js');
