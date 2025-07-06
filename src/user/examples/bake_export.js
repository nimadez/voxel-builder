//
// This example load voxel data, bake meshes and export GLB
//

import { builder, pool, project } from "../modules/core.js";

// x,y,z,color,visible;
const data = "0,0,0,FF0000,1;0,1,0,00FF00,1;0,2,0,0000FF,1;";

builder.setStringData(data);
console.log(builder.voxels.length);

setTimeout(() => {
    pool.bake();
    console.log(pool.meshes.length);
}, 2000);

setTimeout(() => {
    project.exportMeshes();
}, 4000);
