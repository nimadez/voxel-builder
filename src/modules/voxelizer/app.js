/* 
    Nov 2023
    @nimadez
    
    3D Mesh Voxelizer
    Powered by "three-mesh-bvh" library by @gkjohnson

    These operations are built and optimized for Voxel Builder
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

    const xz = (scale / 2) + 0.5;
    const yy = (scale * 2) + 0.5;

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

export function voxelizeInner(positions, indices, size, color) {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
    geom.setIndex(new THREE.BufferAttribute(new Uint32Array(indices), 1));

    const mesh = new THREE.Mesh(geom, new THREE.MeshBasicMaterial());
    const bvh = new MeshBVH(mesh.geometry);

    const box = new THREE.Box3();
    const invMat = new THREE.Matrix4().copy(mesh.matrixWorld).invert();
    const position = new THREE.Vector3();

    size.x = (size.x / 2) + 0.5;
    size.y = (size.y / 2) + 0.5;
    size.z = (size.z / 2) + 0.5;

    const ray = new THREE.Ray();
    const dir = [
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 0, 1)
    ];

    const data = [];
    let hit = null;

    for (let x = -size.x; x < size.x; x++) {
        for (let y = -size.y; y < size.y; y++) {
            for (let z = -size.z; z < size.z; z++) {
                position.set(x, y, z);
                box.min.setScalar(-0.5).add(position);
                box.max.setScalar(0.5).add(position);

                // the invented multi-directional ray
                // we couldn't capture all the details without it
                if (bvh.intersectsBox(box, invMat)) {
                    hit = null;
                    
                    for (let r = 0; r < 3; r++) {
                        ray.origin.copy(position).applyMatrix4(invMat);
                        ray.direction = dir[r];

                        const res = bvh.raycastFirst(ray, 2); // 2: DoubleSide
                        if (res && res.face.normal.dot(ray.direction) < 0.0) {
                            hit = position;
                        }
                    }

                    if (hit) { // one position returned after 3 possible hits
                        data.push({
                            position: new BABYLON.Vector3(hit.x, hit.y, hit.z),
                            color: color,
                            visible: true
                        });
                    }
                }
            }
        }
    }
    
    return data;
}
