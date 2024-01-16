/* 
    Nov 2023
    @nimadez

    Bake voxels to mesh
*/

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

export function baker(name, voxels, isAddCap = true) {
    const planes = [];
    
    function constructFace(index, position, nearby, rotX, rotY) {
        const idx = builder.getIndexAtPosition(voxels[index].position.add(nearby));
        if (!idx) { // test by side
            const plane = constructPlane(voxels[index].color);
            plane.position = voxels[index].position.add(position);
            plane.rotation.x = rotX;
            plane.rotation.y = rotY;
            planes.push(plane);
        } else { // + test by color (add cap)
            if (isAddCap) {
                if (voxels[index].color !== builder.voxels[idx].color) {
                    const plane = constructPlane(voxels[index].color);
                    plane.position = voxels[index].position.add(position);
                    plane.rotation.x = rotX;
                    plane.rotation.y = rotY;
                    planes.push(plane);
                }
            }
        }
    }

    for (let i = 0; i < voxels.length; i++) {
        constructFace(i, // X+
                facePositions[0],
                nearPositions[0],
                0, PIH);
        constructFace(i, // X-
                facePositions[1],
                nearPositions[1],
                0, -PIH);
        constructFace(i, // Y+
                facePositions[2],
                nearPositions[2],
                -PIH, 0);
        constructFace(i, // Y-
                facePositions[3],
                nearPositions[3],
                PIH, 0);
        constructFace(i, // Z+
                facePositions[4],
                nearPositions[4],
                0, 0);
        constructFace(i, // Z-
                facePositions[5],
                nearPositions[5],
                0, Math.PI);
    }

    const mesh = BABYLON.Mesh.MergeMeshes(planes, true, true);
    mesh.overrideMaterialSideOrientation = BABYLON.Material.CounterClockWiseSideOrientation;
    mesh.name = name;
    return mesh;
}

const indices = [ 0,1,2, 0,2,3 ];
const positions = [ -0.5,-0.5,0,  0.5,-0.5,0,  0.5,0.5,0,  -0.5,0.5,0 ];
const normals = [ 0,0,1, 0,0,1, 0,0,1, 0,0,1 ]; // right handed
const uvs = [ 0,1, 1,1, 1,0, 0,0 ];

function constructPlane(hex) {
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
