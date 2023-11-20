/* 
    Nov 2023
    @nimadez
    
    3D Mesh Voxelizer
    Powered by "three-mesh-bvh" library by @gkjohnson
*/
import * as THREE from 'three';
import { MeshBVH } from '../../../libs/three-mesh-bvh.module.js'; // 0.6.8


export function voxelize(positions, indices, scale, color) {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
    geom.setIndex(new THREE.BufferAttribute(new Uint32Array(indices), 1));

    const mesh = new THREE.Mesh(geom, new THREE.MeshBasicMaterial());
    const bvh = new MeshBVH(mesh.geometry);

    const box = new THREE.Box3();
    const invMat = new THREE.Matrix4().copy(mesh.matrixWorld).invert();

    const data = [];
    const position = new THREE.Vector3();

    const xz = (scale / 2) + 1;
    const yy = (scale * 2) + 1;

    for (let x = -xz; x < xz; x++) {
        for (let y = 0; y < yy; y++) {
            for (let z = -xz; z < xz; z++) {
                position.set(x, y, z);
                box.min.setScalar(-0.5).add(position);
                box.max.setScalar(0.5).add(position);

                if (bvh.intersectsBox(box, invMat)) {
                    data.push({
                        position: new BABYLON.Vector3(position.x, position.y, position.z),
                        color: color,
                        visible: true
                    });
                }
            }
        }
    }
    
    return data;
}
