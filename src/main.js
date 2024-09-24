/*
    Sep 2024
    @nimadez

    Main entry point
*/

import { engine } from './modules/babylon.js';
import * as CORE from './modules/core.js';


const startTime = performance.now();


engine.init().then(eng => {

    CORE.preferences.init();

    CORE.mainScene.create(eng).then(scn => {

        scene = scn;

        CORE.camera.init();
        CORE.light.init();
        CORE.material.init();

        CORE.builder.init();
        CORE.xformer.init();

        CORE.uix.init();
        CORE.helper.init();
        CORE.ghosts.init();
        CORE.axisView.init();

        CORE.tool.init();
        
        CORE.renderTarget.init();

        CORE.preferences.finish(startTime);

        CORE.registerRenderLoops();
    });
});


export let scene = undefined;
