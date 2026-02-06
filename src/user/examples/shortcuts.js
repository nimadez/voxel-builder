//
// This example bind tools to shortcuts
//


import { MODE, builder, tool, xformer, ui } from "../modules/core.js";


document.addEventListener("keydown", (ev) => {

    // model|render|export
    if (MODE == 0) {

        switch (ev.key.toLowerCase()) {

            case '0':
                // switch to export tab
                ui.setMode(2);
                break;

            case '1':
                tool.toolSelector('camera');
                break;

            case '2':
                tool.toolSelector('box_add');
                break;

            case '3':
                // xform voxels
                const voxels = builder.getVoxelsByColor('#8398AF');
                xformer.begin(voxels);
                break;

            case '4':
                // create your own tool
                for (const voxel of builder.voxels) {
                    if (voxel.position.y > 10)
                        voxel.color = '#FFA500';
                }
                builder.create();
                break;
        }
    }
    
}, false);
