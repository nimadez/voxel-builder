/* 
    Nov 2023
    @nimadez
    
    3D Mesh Voxelizer
    Powered by "three-mesh-bvh" library by @gkjohnson
*/
import * as THREE from 'three';
import { MeshBVH } from '../../../libs/three-mesh-bvh.module.js'; // 0.6.8


export function voxelize(positions, indices, resolution, scale, color) {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
    geom.setIndex(new THREE.BufferAttribute(new Uint32Array(indices), 1));
    geom.computeVertexNormals();

    const mesh = new THREE.Mesh(geom, new THREE.MeshBasicMaterial());
    const bvh = new MeshBVH(mesh.geometry);

    const step = 1;
    const minStart = Math.floor((-scale / 2.0) + step * 0.5);
    const box = new THREE.Box3();
    const invMat = new THREE.Matrix4().copy(mesh.matrixWorld).invert();

    const data = [];
    const position = new THREE.Vector3();

    for (let x = 0; x < resolution; x++) {
        for (let y = 0; y < resolution; y++) {
            for (let z = 0; z < resolution; z++) {

                position.set(
                    minStart + x * step,
                    minStart + y * step,
                    minStart + z * step
                );

                box.min.setScalar(-0.5 * step).add(position);
                box.max.setScalar(0.5 * step).add(position);

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
