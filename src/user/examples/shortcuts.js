//
// This example bind tools to shortcuts
//


import { MODE, tool } from "../modules/core.js";


document.addEventListener("keydown", (ev) => {

    if (MODE == 0) {

        switch (ev.key.toLowerCase()) {

            case 'q':
                tool.toolSelector('camera');
                break;

            case 'w':
                tool.toolSelector('box_add');
                break;
        }
        
    }

}, false);
