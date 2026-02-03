/*
    Sep 2024
    @nimadez

    Main entry point
*/


setAppId();


import { engine } from './modules/babylon.js';
import * as CORE from './modules/core.js';


const startTime = performance.now();
CORE.preferences.init();

engine.init().then(eng => {

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
    const THRESHOLD = 3.6e+6; // ms == 60 min

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

    const appId = localStorage.getItem('appid');
    const now = Date.now();

    if (getQueryParam('id')) {
        if (!appId || (now - parseInt(appId, 10) > THRESHOLD)) {
            // update url, no reload needed
            localStorage.setItem('appid', now.toString());
            updateQueryParam('id', now.toString());
        } else {
            // recent url, no action needed
        }
    } else {
        // fresh url, assign a new id
        localStorage.setItem('appid', now.toString());
        updateQueryParam('id', now.toString());
    }
}
