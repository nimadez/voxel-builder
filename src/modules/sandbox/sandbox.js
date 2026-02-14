/* 
    Sep 2024
    @nimadez
    
    Three.js Sandbox
*/


import { THREE, renderer } from '../three.js';
import { WebGLPathTracer, PhysicalCamera } from '../../libs/three-gpu-pathtracer.js';
import { OrbitControls } from '../../libs/addons/OrbitControls.js';

import { engine, Vector3 } from '../babylon.js';
import { camera, hdri, light, builder, ui, preferences } from '../core.js';
import { translator } from '../translator.js';
import { loaders } from '../loaders/loaders.js';

import { Tween, Group, Easing } from '../../libs/utils/tween.esm.js';


const DPR_FAST = 0.5;
const toneMappingOptions = {
    0: THREE.NoToneMapping,
    1: THREE.LinearToneMapping,
    2: THREE.ReinhardToneMapping,
    3: THREE.CineonToneMapping,
    4: THREE.ACESFilmicToneMapping,
    5: THREE.AgXToneMapping,
    6: THREE.NeutralToneMapping
};


class Sandbox {
    constructor() {
        this.isLoaded = false;
        this.isRendering = false;
        this.isProgressing = false;

        this.scene = undefined;
        this.ambient = undefined;
        this.hemisphere = undefined;
        this.camera = undefined;
        this.light = undefined;
        this.lightHelper = undefined;
        this.shadowGround = undefined;

        this.controls = undefined;
        this.framed = undefined;
        this.tween1 = undefined;
        this.tween2 = undefined;
        this.tweens = new Group();
        
        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        this.intersects = undefined;
        this.pickBox = undefined;

        this.geom = undefined;
        this.plane = undefined;

        this.meshes = [];
        this.materials = [];

        this.far = undefined;

        this.mat_shadow = undefined;
        this.mat_pbr = undefined;
        this.mat_shade = undefined;
        this.mat_emissive = undefined;
        
        this.isShadeMode = false;

        this.pt = undefined;        
        this.flagUpdateScene = 0;

        this.fps = -1;
        this.now, this.elapsed = 0;
        this.then = performance.now();
    }

    init() {
        renderer.setClearColor(0x000000, 0);
        renderer.autoClearColor = true;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap;

        this.scene = new THREE.Scene();

        this.far = preferences.isMobile ? 1500 : 3000;
        this.camera = new PhysicalCamera(45, window.innerWidth / window.innerHeight, 1.0, this.far);
        this.camera.updateProjectionMatrix();

        this.controls = new OrbitControls(this.camera, renderer.domElement);
        this.controls.minDistance = 2.0;
        this.controls.maxDistance = this.far;
        this.controls.zoomSpeed = 1.0;
        this.controls.panSpeed = 0.6;
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.09;
        this.controls.addEventListener('change', () => {
            this.pt.updateCamera();
        });

        this.createScene();
        this.initPathTracer();

        console.log('init three-sandbox');
    }

    initPathTracer() {
        this.pt = new PathTracer();
        this.pt.create(this.scene, this.camera);
    }


    // Create Scene


    createScene() {
        this.ambient = new THREE.AmbientLight(0xAAAAAA, 1);
        this.hemisphere = new THREE.HemisphereLight(0x888888, 0x444444, 1);
        this.scene.add(this.ambient, this.hemisphere);

        this.light = new THREE.DirectionalLight(0xCCCCCC, 1); // overridden
        this.light.position.set(17, 100, 46);
        this.light.target.position.set(0, 0, 0);
        this.light.castShadow = true;
        this.light.shadow.mapSize.width = preferences.isMobile ? 256 : 1024;
        this.light.shadow.mapSize.height = preferences.isMobile ? 256 : 1024;
        this.light.shadow.camera.near = 1.0;
        this.light.shadow.camera.far = 1000;
        this.light.shadow.camera.top = 100;
        this.light.shadow.camera.bottom = -100;
        this.light.shadow.camera.left = -100;
        this.light.shadow.camera.right = 100;
        this.light.shadow.bias = -0.0005;
        this.scene.add(this.light);

        const axis = new THREE.AxesHelper(10);
        axis.position.setScalar(-0.5);
        this.scene.add(axis);
        
        this.mat_shadow = new THREE.ShadowMaterial({ opacity: 0.15 });
        this.mat_pbr = new THREE.MeshPhysicalMaterial({ vertexColors: true, side: THREE.BackSide });
        this.mat_pbr.specularIntensity = 1;
        this.mat_pbr.clearcoat = 0; // high gpu usage
        this.mat_pbr.clearcoatRoughness = 1;
        this.mat_pbr.color.convertSRGBToLinear();
        this.mat_pbr.needsUpdate = true;
        this.mat_shade = new THREE.MeshStandardMaterial({ color: new THREE.Color(0x000000), side: THREE.BackSide, precision: "mediump" });
        this.mat_emissive = new THREE.MeshStandardMaterial({ emissive: new THREE.Color(0x000000), side: THREE.BackSide });
        this.mat_emissive.emissiveIntensity = 1;

        this.shadowGround = new THREE.Mesh(new THREE.PlaneGeometry(this.far, this.far, 1, 1), this.mat_shadow);
        this.shadowGround.rotation.x = -Math.PI / 2;
        this.shadowGround.receiveShadow = true;
        this.shadowGround.matrixAutoUpdate = false;
        this.shadowGround.updateMatrix();
        this.scene.add(this.shadowGround);

        this.plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1, 1), this.mat_shade.clone());
        this.plane.rotation.x = Math.PI / 2;
        this.plane.receiveShadow = true;
        this.plane.visible = false;
        this.plane.matrixAutoUpdate = false;
        this.plane.updateMatrix();
        this.scene.add(this.plane);

        this.pickBox = new THREE.BoxHelper(this.scene, 0xFFA500);

        this.lightHelper = new THREE.DirectionalLightHelper(this.light, 10, 0xFFFF80);
        this.lightHelper.lightPlane.material.opacity = 0.3;
        this.lightHelper.lightPlane.material.transparent = true;
        this.scene.add(this.lightHelper);
    }


    // Create Meshes


    createMeshesFromBuffers() {
        this.meshes = translator.getMeshesVoxels();
        translator.dispose();

        for (let i = 0; i < this.meshes.length; i++) {
            const isEmissive = this.meshes[i].material.name === 'emissive';
            this.meshes[i].material.dispose();

            (isEmissive) ?
                this.meshes[i].material = (ui.domRenderShade.checked) ? this.mat_shade : this.mat_emissive :
                this.meshes[i].material = (ui.domRenderShade.checked) ? this.mat_shade : this.mat_pbr;

            this.meshes[i].name = 'mesh';
            this.meshes[i].frustumCulled = true;
            this.meshes[i].castShadow = true;
            this.meshes[i].receiveShadow = true;
            
            this.scene.add(this.meshes[i]);
        }
    }

    disposeMeshes() {
        for (let i = 0; i < this.meshes.length; i++) {
            this.meshes[i].geometry.dispose();
            //this.meshes[i].material.dispose(); // no multi-material yet
            this.scene.remove(this.meshes[i]);
        }
        this.meshes = [];
        this.disposePick();
    }


    // Update Scene


    updateSceneOnce() {
        if (this.isRendering)
            this.flagUpdateScene = 1;
    }

    updateCamera(isFetchPos = true) {
        if (isFetchPos) {
            this.camera.position.set(camera.camera0.position.x, camera.camera0.position.y, camera.camera0.position.z);
            this.controls.target = new THREE.Vector3(camera.camera0.target.x, camera.camera0.target.y, camera.camera0.target.z);
        }
        
        this.camera.fov = camera.camera0.fov * 180 / Math.PI;
        this.camera.fStop = ui.domCameraFStop.value;
        this.camera.focusDistance = ui.domCameraFocalLength.value;
        this.camera.updateProjectionMatrix();
        this.controls.update();
        this.pt.updateCamera();
    }

    updateHDR() {
        if (!hdri.hdrMapRender) return;
        this.scene.environment = hdri.hdrMapRender;
        this.scene.environment.mapping = THREE.EquirectangularReflectionMapping;
        this.scene.environment.encoding = THREE.sRGBEncoding;
        this.updateBackground(ui.domRenderHdriBackground.checked);
        this.pt.updateEnvironment();
    }

    updateEnvIntensity(val) {
        this.scene.environmentIntensity = parseFloat(val);
        this.pt.updateEnvironment();
    }

    updateBackground(isEnabled) {
        if (isEnabled) {
            if (ui.domRenderHdriBackground.checked) {
                this.scene.background = this.scene.environment;
                this.scene.background.mapping = THREE.EquirectangularReflectionMapping;
                this.scene.backgroundIntensity = 0.8;
                this.scene.backgroundBlurriness = ui.domRenderHdriBlur.value;
            } else {
                this.scene.background = null;
            }
        } else{
            this.scene.background = null;
        }
        this.pt.updateEnvironment();
    }

    updateLights() {
        this.light.position.set(light.directional.position.x, light.directional.position.y, light.directional.position.z).multiplyScalar(3);
        this.light.target.position.set(0, 0, 0);
        this.light.color = new THREE.Color(ui.domRenderLightColor.value);
        this.light.intensity = ui.domRenderLightIntensity.value;
        this.lightHelper.update();
        this.pt.updateLights();
    }

    updateMaterials() {
        this.mat_pbr.map = translator.textures[preferences.getVoxelTextureId()];
        this.mat_pbr.roughness = ui.domRenderMaterialRoughness.value;
        this.mat_pbr.metalness = ui.domRenderMaterialMetalness.value;
        this.mat_pbr.transmission = ui.domRenderMaterialTransmission.value;
        this.mat_shade.color = new THREE.Color(parseInt(preferences.getRenderShadeColor().replace('#', '0x')));
        this.mat_emissive.emissive = new THREE.Color(ui.domRenderMaterialEmissive.value);
        this.mat_emissive.emissiveIntensity = ui.domRenderMaterialEmissiveIntensity.value;
        this.pt.updateMaterials();
    }

    updateMeshes() {
        this.disposeMeshes();
        this.updateMaterials();
        this.createMeshesFromBuffers();
        this.updatePlane();
        this.isLoaded = true;
        this.updateSceneOnce();
    }

    updatePlane() {
        const center = builder.getCenter();

        this.plane.visible = ui.domRenderPlane.value > 0;
        this.plane.material.color = new THREE.Color(parseInt(ui.domRenderPlaneColor.value.replace('#', '0x')));
        
        this.plane.position.set(center.x, builder.minY - 0.5, center.z);
        this.plane.scale.set(ui.domRenderPlane.value, ui.domRenderPlane.value, 1);
        this.plane.updateMatrix();

        this.shadowGround.position.set(center.x, builder.minY - 0.51, center.z);
        this.shadowGround.updateMatrix();
    }


    // Rendering


    animate() {
        if (sandbox.isLoaded) {
            requestAnimationFrame(sandbox.animate);

            sandbox.now = performance.now();
            sandbox.elapsed = sandbox.now - sandbox.then;

            if (sandbox.elapsed > sandbox.fps) {
                sandbox.then = sandbox.now - (sandbox.elapsed % sandbox.fps);

                if (sandbox.isRendering) {
                    if (sandbox.isProgressing && sandbox.pt.gpt.samples < sandbox.pt.maxSamples) {
                        
                        sandbox.pt.render();

                        ui.showProgress(sandbox.pt.gpt.samples, sandbox.pt.maxSamples);
                        ui.domInfoRender.children[0].innerHTML = ui.domProgressBar.style.width;
                        ui.domInfoRender.children[1].innerHTML = ~~Math.abs((sandbox.pt.gpt.samples/sandbox.pt.maxSamples)*(sandbox.pt.maxSamples));
                        ui.domInfoRender.children[2].innerHTML = sandbox.pt.maxSamples;
                        ui.domInfoRender.children[3].innerHTML = timeFormat(sandbox.pt.gpt.samples);
                        ui.domInfoRender.children[4].innerHTML = ui.domRenderBounces.value;
                    }
                } else {
                    if (sandbox.elapsed > sandbox.fps)
                        renderer.render(sandbox.scene, sandbox.camera);
                }
            }

            sandbox.tweens.update(sandbox.now);
            sandbox.controls.update();

            if (sandbox.flagUpdateScene == 1) {
                sandbox.flagUpdateScene = 0;
                setTimeout(() => {
                    sandbox.isProgressing = true;
                    sandbox.pt.create(sandbox.scene, sandbox.camera);
                });
            }
        }
    }


    // Picking


    pickMesh() {
        this.disposePick();

        if (this.meshes.length > 0) {
            this.raycaster.setFromCamera(this.mouse, this.camera);
            this.intersects = this.raycaster.intersectObjects(this.meshes);
            if (this.intersects.length > 0) {
                this.pickBox.setFromObject(this.intersects[0].object);
                this.scene.add(this.pickBox);
            }
        }
    }

    disposePick() {
        this.intersects = null;
        if (this.pickBox)
            this.scene.remove(this.pickBox);
    }


    // Animations


    cameraAnimator(position, center) {
        if (this.tween1) {
            this.tweens.remove(this.tween1);
            this.tweens.remove(this.tween2);
        }

        this.tween1 = new Tween(this.camera.position).to(position, 300)
            .easing(Easing.Cubic.InOut).start();

        this.tween2 = new Tween(this.controls.target).to(center, 300)
            .easing(Easing.Cubic.InOut)
            .onComplete(() => {
                this.camera.updateProjectionMatrix();
            }).start();

        this.tweens.add(this.tween1);
        this.tweens.add(this.tween2);
    }


    // Shared Functions


    resize(ratio = 1.0) {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio * ratio);

        this.pt.updateCamera();
    }

    frameCamera() {
        if (this.intersects && this.intersects.length > 0) {
            this.intersects[0].object.geometry.computeBoundingBox();
            const boundingBox = this.intersects[0].object.geometry.boundingBox;

            this.framed = camera.getFramedBoundingBox(
                Vector3(boundingBox.min.x, boundingBox.min.y, boundingBox.min.z),
                Vector3(boundingBox.max.x, boundingBox.max.y, boundingBox.max.z));
        } else {
            this.framed = camera.getFramedMesh(builder.mesh);
        }

        const center = new THREE.Vector3(this.framed.target.x, this.framed.target.y, this.framed.target.z);
        const direction = this.controls.target.clone().sub(this.camera.position).normalize().multiplyScalar(this.framed.radius);
        const position = this.camera.position.clone().copy(center).sub(direction);

        this.cameraAnimator(position, center);
    }

    setView(position, center) {
        position = new THREE.Vector3(position.x, position.y, position.z);
        center = new THREE.Vector3(center.x, center.y, center.z);

        this.camera.position.copy(position.multiplyScalar(this.controls.getDistance()).add(center));
        this.controls.target.copy(center);
        this.camera.updateProjectionMatrix();
    }

    loadHDR(url, onLoad) {
        loaders.loadRGBE(url).then(tex => {
            tex.mapping = THREE.EquirectangularReflectionMapping;
            tex.minFilter = THREE.LinearFilter;
            tex.magFilter = THREE.LinearFilter;
            tex.generateMipmaps = false;
            onLoad(tex);
        });
    }

    setAutoStart(isStart) {
        this.startPathTracer(isStart);
        this.updateBackground(isStart);
    }

    setTonemap(id) {
        renderer.toneMapping = toneMappingOptions[id];
        if (this.pt.gpt.samples == this.pt.maxSamples)
            this.pt.update();
    }

    toggleAutoStart() {
        ui.domRenderAutoStart.checked = !ui.domRenderAutoStart.checked;
        this.setAutoStart(ui.domRenderAutoStart.checked);
    }

    toggleRender() {
        this.isRendering = !this.isRendering;
        this.startPathTracer(this.isRendering);
    }

    togglePause() {
        if (this.isRendering) {
            this.isProgressing = !this.isProgressing;
            if (this.isProgressing) {
                ui.domToolbarScreenRender.children[1].children[0].firstChild.innerHTML = 'pause';
                renderer.domElement.style.pointerEvents = 'unset';
            } else {
                ui.domToolbarScreenRender.children[1].children[0].firstChild.innerHTML = 'play_arrow';
                renderer.domElement.style.pointerEvents = 'none';
            }
        }
    }

    toggleShadeMode() {
        this.isShadeMode = !this.isShadeMode;
        this.updateMeshes();
        //this.scene.overrideMaterial is not supported by three-gpu-pathtracer
    }

    toggleBackground() {
        if (!this.scene.background) {
            ui.domRenderHdriBackground.checked = true;
            this.updateBackground(true);
        } else {
            ui.domRenderHdriBackground.checked = false;
            this.updateBackground(false);
        }
    }

    shot() {
        (sandbox.isRendering) ?
            sandbox.pt.render() :
            renderer.render(this.scene, this.camera);

        const uri = renderer.domElement.toDataURL('image/png');
        downloadImage(uri, `${ ui.domProjectName.value }_${ new Date().toJSON().slice(0,10) }_${ randomRangeInt(1000, 9999) }.png`);
    }


    // Activation

    
    startPathTracer(isEnabled) {
        this.isRendering = isEnabled;
        this.controls.enableDamping = !isEnabled;
        this.setTonemap(ui.domRenderTonemap.selectedIndex);
        renderer.domElement.style.pointerEvents = 'unset';

        if (isEnabled) {
            renderer.toneMappingExposure = 1;

            this.shadowGround.visible = false;

            this.pt.updateBounces(ui.domRenderBounces.value);
            this.pt.updateMaxSamples(ui.domRenderMaxSamples.value);
            this.pt.updateTiles(ui.domRenderTiles.value);
            this.updateSceneOnce();

            ui.domInfoRender.style.display = 'unset';
            ui.domToolbarScreenRender.children[0].children[0].firstChild.innerHTML = 'stop';
        } else {
            renderer.toneMappingExposure = 0.8;

            this.shadowGround.visible = true;
            this.isProgressing = false;

            ui.domInfoRender.style.display = 'none';
            ui.domToolbarScreenRender.children[0].children[0].firstChild.innerHTML = 'play_arrow';
            ui.domToolbarScreenRender.children[1].children[0].firstChild.innerHTML = 'pause';
            ui.showProgress(0);
        }
    }

    activate() {
        if (this.isLoaded) return; // avoid overdraw

        engine.isRendering = false;

        this.fps = 1000 / preferences.getFpsMax();
        this.startPathTracer(ui.domRenderAutoStart.checked);

        this.updateCamera();
        this.updateHDR();
        this.updateEnvIntensity(ui.domRenderEnvPower.value);
        this.updateLights();
        this.updateMeshes();

        this.resize();
        this.animate();
        
        document.getElementById('canvas').style.pointerEvents = 'none';
        renderer.domElement.style.display = 'unset';
    }

    deactivate() {
        if (!this.isLoaded) return;

        this.isLoaded = false;
        this.isRendering = false;
        this.isProgressing = false;
        this.disposePick();
        cancelAnimationFrame(this.animate);

        engine.isRendering = true;
        camera.camera0.position = Vector3(this.camera.position.x, this.camera.position.y, this.camera.position.z);
        camera.camera0.target = Vector3(this.controls.target.x, this.controls.target.y, this.controls.target.z);

        renderer.domElement.style.display = 'none';
        document.getElementById('canvas').style.pointerEvents = 'unset';
        
        ui.domToolbarScreenRender.children[1].children[0].firstChild.innerHTML = 'pause';
        ui.domInfoRender.style.display = 'none';
        ui.showProgress(0);
    }

    isActive() {
        return this.isLoaded && !engine.isRendering;
    }
}


// -------------------------------------------------------
// Path Tracer


class PathTracer {
    constructor() {
        this.gpt = new WebGLPathTracer(renderer);
        this.gpt.bounces = 1;
        this.gpt.renderDelay = 100;
        this.gpt.fadeDuration = 250;
        this.gpt.minSamples = 1;
        this.gpt.renderToCanvas = true;
        this.gpt.textureSize = new THREE.Vector2(512, 512);
	    this.gpt.tiles.set(1, 1);
        this.gpt.dynamicLowRes = true;
        this.gpt.lowResScale = DPR_FAST;
        this.gpt.updateCamera();

        this.maxSamples = 0;
    }

    create(scene, camera) { // TODO: Async
        this.gpt.setScene(scene, camera);
    }

    render() {
        this.gpt.renderSample();
    }

    update() {
        this.gpt.reset();
    }

    updateMaxSamples(num) {
        this.maxSamples = num;
        this.gpt.reset();
    }

    updateBounces(num) {
        this.gpt.bounces = num;
        this.gpt.reset();
    }

    updateRenderScale(num) {
        this.gpt.renderScale = num;
        this.gpt.reset();
    }

    updateTiles(num) {
        this.gpt.tiles.set(num, num);
        this.gpt.reset();
    }

    updateCamera() {
        this.gpt.updateCamera();
    }

    updateEnvironment() {
        this.gpt.updateEnvironment();
    }

    updateLights() {
        this.gpt.updateLights();
    }

    updateMaterials() {
        this.gpt.updateMaterials();
    }
}


export const sandbox = new Sandbox();


// -------------------------------------------------------
// Events


renderer.domElement.onpointerdown = (ev) => {
    sandbox.mouse.x = (ev.clientX / window.innerWidth) * 2 - 1;
    sandbox.mouse.y = -(ev.clientY / window.innerHeight) * 2 + 1;
    sandbox.pt.update();
    if (ev.buttons == 1)
        sandbox.pickMesh();
};

renderer.domElement.onpointermove = (ev) => {
    sandbox.mouse.x = (ev.clientX / window.innerWidth) * 2 - 1;
    sandbox.mouse.y = -(ev.clientY / window.innerHeight) * 2 + 1;
};


// -------------------------------------------------------
// Utils


function downloadImage(imgSrc, filename) {
    const a = document.createElement("a");
    a.href = imgSrc;
    a.download = filename;
    a.click();
}

function randomRangeInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function timeFormat(t) {
    const sec_num = parseInt(t, 10);
    let h = Math.floor(sec_num / 3600);
    let m = Math.floor((sec_num - (h * 3600)) / 60);
    let s = sec_num - (h * 3600) - (m * 60);
    if (h < 10) { h = "0" + h; }
    if (m < 10) { m = "0" + m; }
    if (s < 10) { s = "0" + s; }
    return h + ':' + m + ':' + s;
}
