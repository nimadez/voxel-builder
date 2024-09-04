/* 
    Nov 2023
    @nimadez

    Bake voxels to mesh
*/

import { scene, builder } from '../../main.js';

const PIH = Math.PI / 2;
const facePositions = [
    new BABYLON.Vector3(0.5, 0, 0),
    new BABYLON.Vector3(-0.5, 0, 0),
    new BABYLON.Vector3(0, 0.5, 0),
    new BABYLON.Vector3(0, -0.5, 0),
    new BABYLON.Vector3(0, 0, 0.5),
    new BABYLON.Vector3(0, 0, -0.5)
];
const nearPositions = [
    new BABYLON.Vector3(1, 0, 0),
    new BABYLON.Vector3(-1, 0, 0),
    new BABYLON.Vector3(0, 1, 0),
    new BABYLON.Vector3(0, -1, 0),
    new BABYLON.Vector3(0, 0, 1),
    new BABYLON.Vector3(0, 0, -1)
];
const indices = [ 0,1,2, 0,2,3 ];
const positions = [ -0.5,-0.5,0,  0.5,-0.5,0,  0.5,0.5,0,  -0.5,0.5,0 ];
const normals = [ 0,0,1, 0,0,1, 0,0,1, 0,0,1 ]; // right handed
const uvs = [ 0,1, 1,1, 1,0, 0,0 ];

class Bakery {
    constructor() {
        this.ADD_CAP = true;
        this.planes = [];
    }

    bake(name, voxels) {
        this.planes = [];

        for (let i = 0; i < voxels.length; i++) {
            this.constructFace( // X+
                    voxels[i],
                    facePositions[0],
                    nearPositions[0],
                    0, PIH);
            this.constructFace( // X-
                    voxels[i],
                    facePositions[1],
                    nearPositions[1],
                    0, -PIH);
            this.constructFace( // Y+
                    voxels[i],
                    facePositions[2],
                    nearPositions[2],
                    -PIH, 0);
            this.constructFace( // Y-
                    voxels[i],
                    facePositions[3],
                    nearPositions[3],
                    PIH, 0);
            this.constructFace( // Z+
                    voxels[i],
                    facePositions[4],
                    nearPositions[4],
                    0, 0);
            this.constructFace( // Z-
                    voxels[i],
                    facePositions[5],
                    nearPositions[5],
                    0, Math.PI);
        }
    
        const mesh = BABYLON.Mesh.MergeMeshes(this.planes, true, true);
        mesh.overrideMaterialSideOrientation = BABYLON.Material.CounterClockWiseSideOrientation;
        mesh.name = name;
        this.planes = [];
        return mesh;
    }

    constructFace(voxel, position, nearby, rotX, rotY) {
        const idx = builder.getIndexAtPosition(voxel.position.add(nearby));
        if (!idx) { // test by side
            const plane = this.constructPlane(voxel.color);
            plane.position = voxel.position.add(position);
            plane.rotation.x = rotX;
            plane.rotation.y = rotY;
            this.planes.push(plane);
        } else { // + test by color (add cap)
            if (this.ADD_CAP) {
                if (voxel.color !== builder.voxels[idx].color) {
                    const plane = this.constructPlane(voxel.color);
                    plane.position = voxel.position.add(position);
                    plane.rotation.x = rotX;
                    plane.rotation.y = rotY;
                    this.planes.push(plane);
                }
            }
        }
    }

    constructPlane(hex) {
        //BABYLON.VertexData.ComputeNormals(positions, indices, normals, { useRightHandedSystem: true });
        const col = hexToRgbFloat(hex, 2.2);
        const mesh = new BABYLON.Mesh('plane', scene);
        const vertexData = new BABYLON.VertexData();
        vertexData.positions = positions;
        vertexData.normals = normals;
        vertexData.uvs = uvs;
        vertexData.indices = indices;
        vertexData.colors = [
            col.r, col.g, col.b, 1,
            col.r, col.g, col.b, 1,
            col.r, col.g, col.b, 1,
            col.r, col.g, col.b, 1
        ];
        vertexData.applyToMesh(mesh);
        return mesh;
    }    
}

function hexToRgbFloat(hex, gamma = 2.2) { // 1 / 0.4545
    return {
        r: Math.pow(parseInt(hex.substring(1, 3), 16) / 255, gamma),
        g: Math.pow(parseInt(hex.substring(3, 5), 16) / 255, gamma),
        b: Math.pow(parseInt(hex.substring(5, 7), 16) / 255, gamma)
    }
}

export const bakery = new Bakery();
