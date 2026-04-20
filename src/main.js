/*
    Sep 2024
    @nimadez

    Main entry point
*/


setAppId();


import * as CORE from './core/core.js';
import { engine } from './core/babylon.js';


const startTime = performance.now();
CORE.preferences.init();

engine.init(CORE.preferences.getFpsMax()).then(eng => {

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


function setAppId() {
    const THRESHOLD = 3.6e+6; // 60-min ms
    const now = Date.now();

    if (getQueryParam('id')) {
        const appId = localStorage.getItem('appid');
        if (!appId || (now - parseInt(appId, 10) > THRESHOLD)) {
            // update url, no reload needed
            localStorage.setItem('appid', now.toString());
            updateQueryParam('id', now.toString());
        }
    } else {
        // fresh url, assign a new id
        localStorage.setItem('appid', now.toString());
        updateQueryParam('id', now.toString());
    }

    function getQueryParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // update query param without reloading
    function updateQueryParam(name, value) {
        const url = new URL(window.location);
        url.searchParams.set(name, value);
        window.history.replaceState(null, '', url.toString());
    }
}
