/* 
    Nov 2023
    @nimadez

    Bake voxels to mesh
*/

import { VEC6_ONE, VEC6_HALF } from '../babylon.js';
import { builder, pool } from '../../main.js';


const PIH = Math.PI / 2;
const indices = [ 0,1,2, 0,2,3 ];
const positions = [ -0.5,-0.5,0,  0.5,-0.5,0,  0.5,0.5,0,  -0.5,0.5,0 ];
const normals = [ 0,0,1, 0,0,1, 0,0,1, 0,0,1 ]; // right handed
const uvs = [ 0,1, 1,1, 1,0, 0,0 ];


class Bakery {
    constructor() {
        this.ADD_CAP = true;
        this.planes = [];
    }

    bake(voxels) {
        this.planes = [];

        for (let i = 0; i < voxels.length; i++) {
            this.constructFace( // X+
                    voxels[i],
                    VEC6_HALF[0],
                    VEC6_ONE[0],
                    0, PIH);
            this.constructFace( // X-
                    voxels[i],
                    VEC6_HALF[1],
                    VEC6_ONE[1],
                    0, -PIH);
            this.constructFace( // Y+
                    voxels[i],
                    VEC6_HALF[2],
                    VEC6_ONE[2],
                    -PIH, 0);
            this.constructFace( // Y-
                    voxels[i],
                    VEC6_HALF[3],
                    VEC6_ONE[3],
                    PIH, 0);
            this.constructFace( // Z+
                    voxels[i],
                    VEC6_HALF[4],
                    VEC6_ONE[4],
                    0, 0);
            this.constructFace( // Z-
                    voxels[i],
                    VEC6_HALF[5],
                    VEC6_ONE[5],
                    0, Math.PI);
        }
    
        return this.planes;
    }

    constructFace(voxel, position, nearby, rotX, rotY) {
        const idx = builder.getIndexAtPosition(voxel.position.add(nearby));
        if (!idx && idx !== 0) { // test by side
            const plane = pool.constructPlane(positions, normals, uvs, indices, voxel.color);
            plane.position = voxel.position.add(position);
            plane.rotation.x = rotX;
            plane.rotation.y = rotY;
            this.planes.push(plane);
        } else { // + test by color (add cap)
            if (this.ADD_CAP) {
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
}

export const bakery = new Bakery();
