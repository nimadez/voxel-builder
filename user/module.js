console.log('init user-module');

/*
Using Electron:     import { builder } from "../src/modules/core.js";
Using server.js:    import { builder } from "../modules/core.js";


// Exports
MODE, pointer, axisView, bakery, builder, camera, faceNormalProbe, ghosts, hdri, helper, light, mainScene, memory, material, pool, postFx, preferences, project, renderTarget, snapshot, symmetry, tool, toolMesh, ui, uix, vMesh, xformer


// Modes
MODE == 0   // model
MODE == 1   // render
MODE == 2   // export


// Voxel
position: VEC3 INTEGER { x, y, z } (no floats)
color: HEX STRING UPPERCASE (#FFFFFF - no opacity)
visible: BOOLEAN true/false
idx: INTEGER (read-only)


// Build Method 1 (as string)
const data = "0,0,0,FF0000,1;0,1,0,00FF00,1;0,2,0,0000FF,1;"; // x,y,z,color,visible;
builder.setStringData(data);


// Build Method 2 (as array)
const data = [
    { position: Vector3(0, 0, 0), color: '#FF0000', visible: true },
    { position: Vector3(0, 1, 0), color: '#00FF00', visible: true },
    { position: Vector3(0, 2, 0), color: '#0000FF', visible: true }
];
builder.createVoxelsFromArray(data); // clear and rebuild voxels array


// Build Method 3 (add voxels as array)
const data = [
    { position: Vector3(0, 0, 0), color: '#FF0000', visible: true },
    { position: Vector3(0, 1, 0), color: '#00FF00', visible: true },
    { position: Vector3(0, 2, 0), color: '#0000FF', visible: true }
];
builder.addArray(data);   // add more voxels
builder.create();         // rebuild voxels


// Bake Voxels
bakery.bakeColors();
bakery.bakeIslands();


// Export Meshes
project.exportMeshes('untitled', 'glb'); // glb, gltf, obj, stl


// Logging
console.log(builder.voxels.length);
console.log(pool.meshes.length);
ui.notification('string');
ui.warningMessage('string');
ui.errorMessage('string');
*/
