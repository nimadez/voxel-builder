/* 
    Sep 2024
    @nimadez
    
    Sandbox
*/

import { THREE, renderer } from '../three.js';
import { WebGLPathTracer, PhysicalCamera } from '../../libs/three-gpu-pathtracer.js';
import { RGBELoader } from '../../libs/addons/RGBELoader.js';
import { OrbitControls } from '../../libs/addons/OrbitControls.js';
import { mergeGeometries } from '../../libs/addons/BufferGeometryUtils.js';
import { Tween, Group, Easing } from '../../libs/addons/tween.esm.js';

import { engine, Vector3, PositionKind, UVKind, ColorKind } from '../babylon.js';
import { ui, camera, hdri, light, builder, ghosts, palette } from '../core.js';


const TILE = 1;
const DPR_FAST = 0.6;
const CAM_FAR = 1000;
const TEX_CHECKER = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAAArdJREFUeF7t3UGKwlAQhOEXFEEi2Si48v6HcqUiblyJCxExw0ucMXOG+rxBP5uX+ruqk+Z8PvfFL/YEmuPx2D8ej8gD6Pux95umiay/bdsyNMD7/S7b7TbqEF6vV7ndbkPNm82mLBaLqPr3+33RABrADeAG8AjwCKABaAAikAhEAUkYgAJgIAw0BzAIMggyCTQJNAo2CuYF8AKYQUkUWGAgDISBMBAGwkAYCANhIAyEgTAQBsLApBMQChUKlQoWCxcLtxdgL8BiiMUQm0E2g6yGWQ1LosACA2EgDISBMBAGwkAYCANhIAyEgTAQBgadgFSwVLBUsFSwVLBUsFSwVLBUsFSwVLBUsFRwEAQWy6HsYHYwO5gdzA5mB7OD2cHsYHYwO5gdzA6O4mAYCANhIAyEgTAQBsJAGAgDYSAMhIEwMOgEpIKlgqWCpYInqeD1eh10AY6lThsgrfjD4fC9AZ7PZ1kul2lnEF3v/X4vq9Vq/HawBsjrhX8NUMtPw8Ba8/V6Hf75ruviOuByuXwfAbX63W4XdQj11ps2wHw+j6r/dDppAA3woQA3QFfcAB4BHgFJJ0AD0ABE4G8iiAagAWAgDDQHSNJA5gAGQQZBBkEGQX9egEGQQVCSBCg0AA1AA9AANAANUBNBJoEmgSaBJoEmgUkYgAJQAApAASgABaCAMRZuFGwUnKQBjYJlAmUCZQJlAr+rYTQADUADJJ0ADUAD0AA0AA0wvCCCHWwQxA5mB7ODk0QwO5gdzA5mB7OD2cEogB0MA+UBvCaOGcQMSqJAgRBmEDOIGcQMYgYxgz4viyYCiUAiMOkEiEAikAgkAolAIpAIFAmzG+iTMZZDfTPIN4OSKLDAQBgIA2EgDISBMBAGwkAYCANhYDgGRjHgp9iKgvWXlgWoNdfa2ykFJDZAes2z2az8AHQh6tsoo9tQAAAAAElFTkSuQmCC";
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
        this.shadowGround = undefined;
        this.camera = undefined;
        this.controls = undefined;
        this.transform = undefined;
        this.light = undefined;
        this.lightHelper = undefined;
        this.mouse = new THREE.Vector2();
        this.clock = new THREE.Clock();
        this.tween1 = undefined;
        this.tween2 = undefined;
        this.tweens = new Group();

        this.meshes = [];
        this.pickBox = undefined;
        this.raycaster = new THREE.Raycaster();

        this.geom = undefined;
        this.geomBox = undefined;
        this.mat_illum = undefined;
        this.mat_shade = undefined;
        this.mat_pbr = undefined;
        this.textures = [];

        this.isShadeMode = false;

        this.pathTracer = undefined;        
        this.flagUpdateScene = 0;

        this.init();
    }

    init() {
        renderer.setClearColor(0x000000, 0);
        renderer.autoClearColor = true;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap;

        this.scene = new THREE.Scene();

        this.camera = new PhysicalCamera(45, window.innerWidth / window.innerHeight, 1.0, CAM_FAR);
        this.camera.updateProjectionMatrix();

        this.controls = new OrbitControls(this.camera, renderer.domElement);
        this.controls.minDistance = 2.0;
        this.controls.maxDistance = CAM_FAR;
        this.controls.zoomSpeed = 1.0;
        this.controls.panSpeed = 0.6;
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.09;
        this.controls.addEventListener('change', () => {
            this.pathTracer.updateCamera();
        });

        this.createScene();

        this.pathTracer = new PathTracer();
        this.pathTracer.create(this.scene, this.camera);

        this.pickBox = new THREE.BoxHelper(this.scene, 0xFFA500);

        console.log('load sandbox');
    }

    createScene() {
        this.ambient = new THREE.AmbientLight(0xAAAAAA, 1);
        this.hemisphere = new THREE.HemisphereLight(0x666666, 0x333333, 1);
        this.scene.add(this.ambient, this.hemisphere);

        this.light = new THREE.DirectionalLight(0xCCCCCC, 1); // overrided
        this.light.position.set(17, 100, 46);
        this.light.target.position.set(0, 0, 0);
        this.light.castShadow = true;
        this.light.shadow.mapSize.width = 1024;
        this.light.shadow.mapSize.height = 1024;
        this.light.shadow.camera.near = 1.0;
        this.light.shadow.camera.far = 1000;
        this.light.shadow.camera.top = 100;
        this.light.shadow.camera.bottom = -100;
        this.light.shadow.camera.left = -100;
        this.light.shadow.camera.right = 100;
        this.light.shadow.bias = -0.0005;
        this.scene.add(this.light);

        this.lightHelper = new THREE.DirectionalLightHelper(this.light, 10, 0xFFFF80);
        this.lightHelper.lightPlane.material.opacity = 0.3;
        this.lightHelper.lightPlane.material.transparent = true;
        //this.scene.add(this.lightHelper);

        const axis = new THREE.AxesHelper(10);
        axis.position.setScalar(-0.5);
        this.scene.add(axis);
        
        const mat_shadow = new THREE.ShadowMaterial({ opacity: 0.12 });
        this.shadowGround = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000, 1, 1), mat_shadow);
        this.shadowGround.position.setScalar(-0.5);
        this.shadowGround.position.y -= 0.05;
        this.shadowGround.rotation.x = -Math.PI / 2;
        this.shadowGround.receiveShadow = true;
        this.shadowGround.matrixAutoUpdate = false;
        this.shadowGround.updateMatrix();
        this.scene.add(this.shadowGround);

        this.geomBox = new THREE.BoxGeometry(1.02, 1.02, 1.02);

        // overrided
        this.mat_illum = new THREE.MeshStandardMaterial({ emissive: new THREE.Color(0x5EC3C5), side: THREE.FrontSide });
        this.mat_illum.emissiveIntensity = 20;
        this.mat_shade = new THREE.MeshStandardMaterial({ color: new THREE.Color(0xAAAAAA), side: THREE.BackSide, precision: "mediump" });
        this.mat_pbr = new THREE.MeshPhysicalMaterial({ vertexColors: true, side: THREE.BackSide });
        this.mat_pbr.specularIntensity = 1;
        this.mat_pbr.roughness = 1;
        this.mat_pbr.metalness = 0;
        this.mat_pbr.transmission = 0;
        this.mat_pbr.clearcoat = 0; // high gpu usage
        this.mat_pbr.clearcoatRoughness = 1;
        this.mat_pbr.color.convertSRGBToLinear();
        this.mat_pbr.needsUpdate = true;

        this.textures.push(null);
        this.textures.push(createVoxelTexture());
        this.textures.push(new THREE.TextureLoader().load(TEX_CHECKER));
    }

    createBatchedMesh() {
        const box = new THREE.BoxGeometry(1, 1, 1);
        const batchedMesh = new THREE.BatchedMesh(
            builder.voxels.length,
            builder.vPositions.length, builder.vIndices.length,
            this.mat_pbr.clone());
        const boxGeoId = batchedMesh.addGeometry(box);
        const col = new THREE.Color();
        for (let i = 0; i < builder.voxels.length; i++) {
            const boxInst = batchedMesh.addInstance(boxGeoId);
            batchedMesh.setMatrixAt(boxInst, builder.bufferWorld[i]);
            col.r = builder.bufferColors[i * 4];
            col.g = builder.bufferColors[i * 4 + 1];
            col.b = builder.bufferColors[i * 4 + 2];
            batchedMesh.setColorAt(boxInst, col);
        }
        batchedMesh.frustumCulled = true;
        batchedMesh.sortObjects = false;
		batchedMesh.perObjectFrustumCulled = true;
        batchedMesh.material.vertexColors = false;
        batchedMesh.material.side = THREE.FrontSide;
        return batchedMesh;
    }

    createMeshFromBuffersFast() {        
        const geom = new THREE.BufferGeometry();
        geom.setAttribute('position', new THREE.BufferAttribute(builder.positions, 3));
        geom.setAttribute('uv', new THREE.BufferAttribute(builder.uvs, 2));
        geom.setAttribute('color', new THREE.BufferAttribute(builder.colors, 4));
        geom.setIndex(new THREE.BufferAttribute(builder.indices, 1));
        geom.computeVertexNormals();

        return [ new THREE.Mesh(geom, this.mat_pbr.clone()) ];
    }

    createMeshes() {
        this.clearMeshes();

        this.mat_illum.emissive = new THREE.Color(ui.domRenderMaterialEmissive.value);
        this.mat_shade.map = this.textures[parseInt(ui.domRenderTexture.value)];
        this.mat_pbr.map = this.textures[parseInt(ui.domRenderTexture.value)];
        this.mat_pbr.roughness = ui.domRenderMaterialRoughness.value;
        this.mat_pbr.metalness = ui.domRenderMaterialMetalness.value;
        this.mat_pbr.transmission = ui.domRenderMaterialTransmission.value;

        this.meshes = this.createMeshFromBuffersFast();

        for (let i = 0; i < this.meshes.length; i++) {
            this.meshes[i].castShadow = true;
            this.meshes[i].receiveShadow = true;
            if (ui.domRenderShade.checked) {
                this.meshes[i].material.dispose();
                this.meshes[i].material = this.mat_shade.clone();
            }

            this.scene.add(this.meshes[i]);
        }

        this.createLightSources();

        this.isLoaded = true;
    }

    createLightSources() {
        const voxels = builder.getVoxelsByColor("#000000");
        if (voxels.length > 0) {
            let geometry = this.geomBox.clone();
            geometry.translate(voxels[0].position.x, voxels[0].position.y, voxels[0].position.z);
            for (let i = 1; i < voxels.length; i++) {
                const box = this.geomBox.clone();
                box.translate(voxels[i].position.x, voxels[i].position.y, voxels[i].position.z);
                geometry = mergeGeometries([ geometry, box ], false);
            }
            const mesh = new THREE.Mesh(geometry, this.mat_illum);
            this.scene.add(mesh);
            this.meshes.push(mesh);
        }
    }

    updateMeshes() {
        this.createMeshes();
        if (this.isRendering)
            this.flagUpdateScene = 1;
    }

    clearMeshes() {
        for (let i = 0; i < this.meshes.length; i++) {
            this.meshes[i].geometry.dispose();
            this.meshes[i].material.dispose();
            this.scene.remove(this.meshes[i]);
        }
        this.meshes = [];
        this.disposePick();
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

        this.pathTracer.updateCamera();
    }

    updateHDR() {
        if (!hdri.hdrMapRender) return;
        this.scene.environment = hdri.hdrMapRender;
        this.scene.environment.mapping = THREE.EquirectangularReflectionMapping;
        this.scene.environment.encoding = THREE.sRGBEncoding;
        this.updateBackground(ui.domRenderHdriBackground.checked);
        this.pathTracer.updateEnvironment();
    }

    updateEnvIntensity(val) {
        this.scene.environmentIntensity = parseFloat(val);
        this.pathTracer.updateEnvironment();
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
        this.pathTracer.updateEnvironment();
    }

    updateLight() {
        this.light.position.set(light.directional.position.x, light.directional.position.y, light.directional.position.z).multiplyScalar(3);
        this.light.target.position.set(0, 0, 0);
        this.light.color = new THREE.Color(ui.domRenderLightColor.value);
        this.light.intensity = ui.domRenderLightIntensity.value;
        this.lightHelper.update();
        this.pathTracer.updateLights();
    }

    animate() {
        if (sandbox.isLoaded) {
            requestAnimationFrame(sandbox.animate);

            if (sandbox.isRendering) {
                if (sandbox.isProgressing && sandbox.pathTracer.pt.samples < sandbox.pathTracer.maxSamples) {
                    sandbox.pathTracer.render();

                    ui.showProgress(sandbox.pathTracer.pt.samples, sandbox.pathTracer.maxSamples);
                    ui.domInfoRender.children[0].innerHTML = ui.domProgressBar.style.width;
                    ui.domInfoRender.children[1].innerHTML = ~~Math.abs((sandbox.pathTracer.pt.samples/sandbox.pathTracer.maxSamples)*(sandbox.pathTracer.maxSamples));
                    ui.domInfoRender.children[2].innerHTML = sandbox.pathTracer.maxSamples;
                    ui.domInfoRender.children[3].innerHTML = timeFormat(sandbox.pathTracer.pt.samples);
                    ui.domInfoRender.children[4].innerHTML = ui.domRenderBounces.value;
                }
            } else {
                renderer.render(sandbox.scene, sandbox.camera);
            }

            sandbox.tweens.update(performance.now());
            sandbox.controls.update();

            if (sandbox.flagUpdateScene == 1) {
                sandbox.flagUpdateScene = 0;
                setTimeout(() => {
                    sandbox.isProgressing = true;
                    sandbox.pathTracer.create(sandbox.scene, sandbox.camera);
                });
            }
        }
    }

    resize(ratio = 1.0) {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio * ratio);

        this.pathTracer.updateCamera();
    }

    pickMesh() {
        this.disposePick();

        if (this.meshes.length > 0) {
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObjects(this.meshes);
            if (intersects.length > 0) {
                this.pickBox.setFromObject(intersects[0].object);
                this.scene.add(this.pickBox);
            }
        }
    }

    disposePick() {
        if (this.pickBox)
            this.scene.remove(this.pickBox);
    }

    cameraAnimator(position, center) {
        if (this.tween1) {
            this.tweens.remove(this.tween1);
            this.tweens.remove(this.tween2);
        }

        this.tween1 = new Tween(this.camera.position).to(position, 550)
            .easing(Easing.Cubic.InOut).start();

        this.tween2 = new Tween(this.controls.target).to(center, 560)
            .easing(Easing.Cubic.InOut)
            .onComplete(() => {
                this.camera.updateProjectionMatrix();
            }).start();

        this.tweens.add(this.tween1);
        this.tweens.add(this.tween2);
    }

    frameCamera() {
        const framed = camera.getFramed(builder.mesh);
        const center = new THREE.Vector3(framed.target.x, framed.target.y, framed.target.z);
        const direction = this.controls.target.clone().sub(this.camera.position).normalize().multiplyScalar(framed.radius);
        const position = this.camera.position.clone().copy(center).sub(direction);

        this.cameraAnimator(position, center);
    }

    startPathTracer(isEnabled) {
        this.isRendering = isEnabled;
        this.controls.enableDamping = !isEnabled;
        renderer.toneMapping = parseInt(ui.domRenderTonemap.value);
        renderer.domElement.style.pointerEvents = 'unset';

        if (isEnabled) {
            renderer.toneMappingExposure = 1;

            this.scene.remove(this.shadowGround);

            this.pathTracer.updateBounces(ui.domRenderBounces.value);
            this.pathTracer.updateMaxSamples(ui.domRenderMaxSamples.value);
            this.flagUpdateScene = 1;

            ui.domInfoRender.style.display = 'unset';
            ui.domMenuInScreenRender.children[0].firstChild.innerHTML = 'stop';
        } else {
            renderer.toneMappingExposure = 0.8;

            this.scene.add(this.shadowGround);
            this.isProgressing = false;

            ui.domInfoRender.style.display = 'none';
            ui.domMenuInScreenRender.children[0].firstChild.innerHTML = 'play_arrow';
            ui.domMenuInScreenRender.children[1].children[0].innerHTML = 'pause';
            ui.showProgress(0);
        }
    }

    setAutoStart(isStart) {
        this.startPathTracer(isStart);
        this.updateBackground(isStart);
    }

    setTonemap(id) {
        renderer.toneMapping = toneMappingOptions[id];
        if (this.pathTracer.pt.samples == this.pathTracer.maxSamples)
            this.pathTracer.update();
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
                ui.domMenuInScreenRender.children[1].children[0].innerHTML = 'pause';
                renderer.domElement.style.pointerEvents = 'unset';
            } else {
                ui.domMenuInScreenRender.children[1].children[0].innerHTML = 'play_arrow';
                renderer.domElement.style.pointerEvents = 'none';
            }
        }
    }

    toggleShadeMode() {
        this.isShadeMode = !this.isShadeMode;
        ui.domRenderShade.checked = this.isShadeMode;
        this.updateMeshes();
        //this.scene.overrideMaterial
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
        const uri = renderer.domElement.toDataURL('image/png');
        downloadImage(uri, `${ ui.domProjectName.value }_${ new Date().toJSON().slice(0,10) }_${ randomRangeInt(1000, 9999) }.png`);
    }

    isActive() {
        return this.isLoaded && !engine.isRendering;
    }

    isActiveRender() {
        return this.isLoaded && !engine.isRendering && this.isRendering;
    }

    activate() {
        if (this.isLoaded) return; // avoid overdraw

        engine.isRendering = false;

        this.startPathTracer(ui.domRenderAutoStart.checked);

        this.createMeshes();

        this.updateCamera();
        this.updateHDR();
        this.updateEnvIntensity(ui.domRenderEnvPower.value);
        this.updateLight();

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
        
        ui.domMenuInScreenRender.children[1].children[0].innerHTML = 'pause';
        ui.domInfoRender.style.display = 'none';
        ui.showProgress(0);
    }

    async loadHDR(url, onLoad) {
        await loadRGBE(url).then(tex => {
            tex.mapping = THREE.EquirectangularReflectionMapping;
            tex.minFilter = THREE.LinearFilter;
            tex.magFilter = THREE.LinearFilter;
            tex.generateMipmaps = false;
            onLoad(tex);
        });
    }
}


// -------------------------------------------------------
// Path Tracer


class PathTracer {
    constructor() {
        this.pt = new WebGLPathTracer(renderer);
        this.pt.bounces = 1;
        this.pt.renderDelay = 300;
        this.pt.fadeDuration = 300;
        this.pt.minSamples = 1;
        this.pt.renderToCanvas = true;
        this.pt.textureSize = new THREE.Vector2(512, 512);
	    this.pt.tiles.set(TILE, TILE);
        this.pt.dynamicLowRes = true;
        this.pt.lowResScale = DPR_FAST;
        this.pt.updateCamera();

        this.maxSamples = 0;
    }

    create(scene, camera) { // TODO: Async
        this.pt.setScene(scene, camera);
    }

    render() {
        this.pt.renderSample();
    }

    update() {
        this.pt.reset();
    }

    updateMaxSamples(num) {
        this.maxSamples = num;
        this.pt.reset();
    }

    updateBounces(num) {
        this.pt.bounces = num;
        this.pt.reset();
    }

    updateRenderScale(num) {
        this.pt.renderScale = num;
        this.pt.reset();
    }

    updateTiles(num) {
        this.pt.tiles.set(num, num);
        this.pt.reset();
    }

    updateCamera() {
        this.pt.updateCamera();
    }

    updateEnvironment() {
        this.pt.updateEnvironment();
    }

    updateLights() {
        this.pt.updateLights();
    }

    updateMaterials() {
        this.pt.updateMaterials();
    }
}


export const sandbox = new Sandbox();


// -------------------------------------------------------
// Events


renderer.domElement.onpointerdown = (ev) => {
    sandbox.mouse.x = (ev.clientX / window.innerWidth) * 2 - 1;
    sandbox.mouse.y = -(ev.clientY / window.innerHeight) * 2 + 1;
    sandbox.pathTracer.update();
    sandbox.pickMesh();
};

renderer.domElement.onpointermove = (ev) => {
    sandbox.mouse.x = (ev.clientX / window.innerWidth) * 2 - 1;
    sandbox.mouse.y = -(ev.clientY / window.innerHeight) * 2 + 1;
};


// -------------------------------------------------------
// Utils


async function loadRGBE(url) {
    return new Promise(resolve => {
        new RGBELoader().load(url, resolve);
    });
}

function downloadImage(imgSrc, filename) {
    const a = document.createElement("a");
    a.href = imgSrc;
    a.download = filename;
    a.click();
}

function randomRangeInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function createVoxelTexture(size = 64) {
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const ctx = c.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, size, size);
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#00000080';
    //ctx.filter = 'blur(1px)';
    ctx.strokeRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(c);
    tex.minFilter = THREE.NearestMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
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
