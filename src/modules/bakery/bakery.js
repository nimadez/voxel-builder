/* 
    Nov 2023
    @nimadez

    Bake voxels to mesh
*/

import { Vector3 } from '../babylon.js';
import { builder, pool } from '../core.js';


const PIH = Math.PI / 2;
const VEC6_ONE = [
    Vector3(1, 0, 0),
    Vector3(-1, 0, 0),
    Vector3(0, 1, 0),
    Vector3(0, -1, 0),
    Vector3(0, 0, 1),
    Vector3(0, 0, -1)
];
const VEC6_HALF = [
    Vector3(0.5, 0, 0),
    Vector3(-0.5, 0, 0),
    Vector3(0, 0.5, 0),
    Vector3(0, -0.5, 0),
    Vector3(0, 0, 0.5),
    Vector3(0, 0, -0.5)
];

const indices = [ 0,1,2, 0,2,3 ];
const positions = [ -0.5,-0.5,0,  0.5,-0.5,0,  0.5,0.5,0,  -0.5,0.5,0 ];
const normals = [ 0,0,1, 0,0,1, 0,0,1, 0,0,1 ]; // right handed
const uvs = [ 0,1, 1,1, 1,0, 0,0 ];


class Bakery {
    constructor() {
        this.planes = [];
    }

    bake(voxels) {
        this.planes = [];

        voxels.forEach((voxel) => {
            this.constructFace(voxel, VEC6_HALF[0], VEC6_ONE[0], 0, PIH);    // X+
            this.constructFace(voxel, VEC6_HALF[1], VEC6_ONE[1], 0, -PIH);   // X-
            this.constructFace(voxel, VEC6_HALF[2], VEC6_ONE[2], -PIH, 0);   // Y+
            this.constructFace(voxel, VEC6_HALF[3], VEC6_ONE[3], PIH, 0);    // Y-
            this.constructFace(voxel, VEC6_HALF[4], VEC6_ONE[4], 0, 0);      // Z+
            this.constructFace(voxel, VEC6_HALF[5], VEC6_ONE[5], 0, Math.PI);// Z-
        });
    
        return this.planes;
    }

    constructFace(voxel, position, nearby, rotX, rotY) {
        const idx = builder.getIndexAtPosition(voxel.position.add(nearby));
        if (idx === undefined) {
            const plane = pool.constructPlane(positions, normals, uvs, indices, voxel.color);
            plane.position = voxel.position.add(position);
            plane.rotation.x = rotX;
            plane.rotation.y = rotY;
            this.planes.push(plane);
        } else {
            if (voxel.color !== builder.voxels[idx].color) {
                const plane = pool.constructPlane(positions, normals, uvs, indices, voxel.color);
                plane.position = voxel.position.add(position);
                plane.rotation.x = rotX;
                plane.rotation.y = rotY;
                this.planes.push(plane);
            }
        }
    }
}

export const bakery = new Bakery();
