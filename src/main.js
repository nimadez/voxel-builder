/*
    Sep 2024
    @nimadez

    Main entry point
*/


import { engine } from './modules/babylon.js';
import * as CORE from './modules/core.js';


const startTime = performance.now();
const adapter = navigator.gpu && await navigator.gpu.requestAdapter();


CORE.preferences.init(adapter);

engine.init(adapter && CORE.preferences.isWebGPU()).then(eng => {

    CORE.mainScene.create(eng).then(scn => {

        scene = scn;

        CORE.camera.init();
        CORE.light.init();
        CORE.material.init();

        CORE.vMesh.init();
        CORE.builder.init();
        CORE.xformer.init();

        CORE.axisView.create(eng);
        CORE.uix.init();
        CORE.helper.init();
        CORE.ghosts.init();

        CORE.tool.init();
        
        CORE.renderTarget.init();
        CORE.faceNormalProbe.init();

        CORE.preferences.finish(startTime);

        CORE.registerRenderLoops();

        engine.isRendering = true;
    });
});


export let scene = undefined;
