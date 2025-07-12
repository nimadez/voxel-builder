//
// This example load voxel data, bake meshes and export GLB
//
/*
Voxel:
    position: VEC3 FLOAT { x, y, z }
    color: HEX STRING UPPERCASE (#FFFFFF - no opacity)
    visible: 0 / 1
    idx: INTEGER (read-only)
*/


import { builder, bakery, pool, project, ui } from "../modules/core.js";
import { Vector3 } from "../../modules/babylon.js";


// Method 1 (as string)
// x,y,z,color,visible;
//const data = "0,0,0,FF0000,1;0,1,0,00FF00,1;0,2,0,0000FF,1;";
//builder.setStringData(data);


// Method 2 (as array)
const data = [
    { position: Vector3(0, 0, 0), color: '#FF0000', visible: 1 },
    { position: Vector3(0, 1, 0), color: '#00FF00', visible: 1 },
    { position: Vector3(0, 2, 0), color: '#0000FF', visible: 1 }
];
builder.voxels = [];
builder.addArray(data);
builder.create();


// Bake Voxels
setTimeout(() => {
    bakery.bakeVoxels();
}, 2000);

// Export Meshes
setTimeout(() => {
    ui.domExportFormat.selectedIndex = 0; // [ GLB, glTF, OBJ, STL ]
    project.exportMeshes();
}, 4000);

// Logging
setTimeout(() => {
    ui.notification('done');
    console.log(builder.voxels.length);
    console.log(pool.meshes.length);
}, 5000);
