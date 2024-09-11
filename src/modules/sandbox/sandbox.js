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
import { Tween, Easing } from '../../libs/addons/tween.esm.js';

import {
    engine,
    Vector3
} from '../babylon.js';

import {
    ui,
    camera, hdri, light,
    builder,
    FPS
} from '../../main.js';


const DPR_FAST = 0.6;
const TILE = 1;
const CAM_FAR = 1000;


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
        this.framed = undefined;
        this.light = undefined;
        this.lightHelper = undefined;
        this.mouse = new THREE.Vector2();
        this.tween = undefined;
        this.then = performance.now();

        this.meshes = [];
        this.pick = undefined;
        this.pickBox = undefined;
        this.raycaster = new THREE.Raycaster();

        this.geom = undefined;
        this.mat_pbr = undefined;
        this.tex_grid = undefined;

        this.pathTracer = undefined;
        this.isFastMode = false;
        this.isShadeMode = false;
        this.flagUpdateScene = 0;

        this.init();
    }

    init() {
        this.scene = new THREE.Scene();

        this.camera = new PhysicalCamera(45, window.innerWidth / window.innerHeight, 0.1, CAM_FAR);
        this.camera.updateProjectionMatrix();

        this.controls = new OrbitControls(this.camera, renderer.domElement);
        this.controls.minDistance = 0.1;
        this.controls.maxDistance = CAM_FAR;
        this.controls.zoomSpeed = 1.0;
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.08;
        this.controls.addEventListener('change', () => {
            this.pathTracer.updateCamera();
        });

        this.createScene();

        this.pathTracer = new PathTracer();
        this.pathTracer.create(this.scene, this.camera);

        console.log('load sandbox');
    }

    createScene() {
        this.ambient = new THREE.AmbientLight(0x555555, 1);
        this.hemisphere = new THREE.HemisphereLight(0x444444, 0x222222, 1);
        this.scene.add(this.ambient, this.hemisphere);

        this.light = new THREE.DirectionalLight(0xDCDCDC, 1);
        this.light.position.set(17, 100, 46);
        this.light.target.position.set(0, 0, 0);
        this.light.castShadow = true;
        this.light.shadow.mapSize.width = 1024;
        this.light.shadow.mapSize.height = 1024;
        this.light.shadow.camera.near = 0.01;
        this.light.shadow.camera.far = 1000;
        this.light.shadow.camera.top = 200;
        this.light.shadow.camera.bottom = -200;
        this.light.shadow.camera.left = -200;
        this.light.shadow.camera.right = 200;
        this.light.shadow.bias = -0.0005;
        this.scene.add(this.light);

        this.lightHelper = new THREE.DirectionalLightHelper(this.light, 10, 0xFFFF80);
        this.lightHelper.lightPlane.material.opacity = 0.3;
        this.lightHelper.lightPlane.material.transparent = true;
        this.scene.add(this.lightHelper);

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

        this.tex_grid = createVoxelTexture();
        this.tex_grid.encoding = THREE.sRGBEncoding;
        //this.tex_grid.minFilter = THREE.LinearFilter;
        //this.tex_grid.magFilter = THREE.LinearFilter;

        // overrided
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
    }

    create() {
        this.createMesh();

        this.updateCamera();

        this.updateHDR();
        this.updateEnvironmentIntensity(ui.domRenderEnvPower.value);
        
        this.updateLight();

        this.resize();
        this.animate();
    }

    // If batchedmesh is supported by pathtracer, we can do more!
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

    createMeshFromBuffers() {
        builder.fillArrayBuffers();
        const geom = new THREE.BufferGeometry();
        geom.setAttribute('position', new THREE.BufferAttribute(builder.positions, 3));
        geom.setAttribute('uv', new THREE.BufferAttribute(builder.uvs, 2));
        geom.setAttribute('color', new THREE.BufferAttribute(builder.colors, 4));
        geom.setIndex(new THREE.BufferAttribute(builder.indices, 1));
        geom.computeVertexNormals();
        return new THREE.Mesh(geom, this.mat_pbr.clone());
    }

    createMesh() {
        this.clearMeshes();

        this.mat_shade.map = (ui.domRenderGrid.checked) ? this.tex_grid : null;
        this.mat_pbr.map = (ui.domRenderGrid.checked) ? this.tex_grid : null;
        this.mat_pbr.roughness = ui.domRenderMaterialRoughness.value;
        this.mat_pbr.metalness = ui.domRenderMaterialMetalness.value;
        this.mat_pbr.transmission = ui.domRenderMaterialTransmission.value;

        this.meshes[0] = this.createMeshFromBuffers();
        this.meshes[0].castShadow = true;
        this.meshes[0].receiveShadow = true;
        this.scene.add(this.meshes[0]);

        if (ui.domRenderShade.checked)
            this.meshes[0].material = this.mat_shade.clone();

        this.isLoaded = true;
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

    updateCamera(fetchPos = true) {
        this.framed = camera.getFramed(builder.mesh);

        if (fetchPos) {
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
        this.updateBackground(ui.domRenderBackground.checked);
        this.pathTracer.updateEnvironment();
    }

    updateEnvironmentIntensity(val) {
        this.scene.environmentIntensity = parseFloat(val) / 10;
        this.pathTracer.updateEnvironment();
    }

    updateBackground(isEnabled) {
        if (isEnabled) {
            if (ui.domRenderBackground.checked) {
                this.scene.background = this.scene.environment;
                this.scene.background.mapping = THREE.EquirectangularReflectionMapping;
                this.scene.backgroundIntensity = 1.1;
                this.scene.backgroundBlurriness = 0.01;
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
        this.light.color = new THREE.Color(ui.domColorPickerLightColor.value);
        this.light.intensity = ui.domLightIntensity.value;
        this.lightHelper.update();
        this.pathTracer.updateLights();
    }

    pause() {
        this.isProgressing = !this.isProgressing;
        if (this.isProgressing) {
            ui.domRenderPause.innerHTML = 'Pause';
            ui.domRenderPause.classList.remove('btn_select_pt');
            renderer.domElement.style.pointerEvents = 'unset';
        } else {
            ui.domRenderPause.innerHTML = 'Continue';
            ui.domRenderPause.classList.add('btn_select_pt');
            renderer.domElement.style.pointerEvents = 'none';
        }
    }

    fastMode() {
        this.isFastMode = !this.isFastMode;
        if (this.isFastMode) {
            this.pathTracer.updateRenderScale(DPR_FAST);
            ui.domRenderFast.classList.add('btn_select_pt');
        } else {
            this.pathTracer.updateRenderScale(ui.domRenderDPR.value);
            ui.domRenderFast.classList.remove('btn_select_pt');
        }
    }

    shadeMode() {
        this.isShadeMode = !this.isShadeMode;
        ui.domRenderShade.checked = this.isShadeMode;
        //this.scene.overrideMaterial
        
        this.createMesh();
        if (this.isRendering)
            this.flagUpdateScene = 1;
    }

    animate() {
        requestAnimationFrame(sandbox.animate);
        if (sandbox.isLoaded) {
            const now = performance.now();
            const elapsed = now - sandbox.then;
            if (elapsed > FPS) {
                sandbox.then = now - (elapsed % FPS);

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
            }

            if (!sandbox.isRendering) {
                sandbox.controls.update();
                if (sandbox.tween)
                    sandbox.tween.update(now);
            }

            if (sandbox.flagUpdateScene == 1) {
                sandbox.flagUpdateScene = 0;
                setTimeout(() => { // TODO: Async
                    sandbox.pathTracer.create(sandbox.scene, sandbox.camera);
                });
            }
        }
    }

    resize(ratio = 1) {
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
                this.pickBox = new THREE.BoxHelper(intersects[0].object, 0x00ffff);
                this.scene.add(this.pickBox);

                this.pick = intersects[0].object;
            }
        }
    }

    disposePick() {
        this.pick = null;
        if (this.pickBox) {
            this.scene.remove(this.pickBox);
            this.pickBox = null;
        }
    }

    frameCamera() {
        const center = new THREE.Vector3(this.framed.target.x, this.framed.target.y, this.framed.target.z);
        const direction = this.controls.target.clone().sub(this.camera.position).normalize().multiplyScalar(this.framed.radius);

        if (this.isRendering) {
            this.camera.position.copy(center).sub(direction);
            this.camera.lookAt(center);
            this.controls.target.copy(center);
            this.camera.updateProjectionMatrix();
            this.controls.update();
        } else {
            const position = this.camera.position.clone().copy(center).sub(direction);
            this.tween = new Tween(this.camera.position).to(position, 600)
                .easing(Easing.Quadratic.InOut)
                .onUpdate(() => {
                    this.camera.lookAt(center);
                    this.controls.target.copy(center);
                })
                .onComplete(() => {
                    this.camera.updateProjectionMatrix();
                    this.tween = null;
                }).start();
        }
    }

    startPathTracer(isEnabled) {
        this.isRendering = isEnabled;
        if (isEnabled) {
            renderer.setClearColor(0x000000, 0);
            renderer.autoClearColor = false;
            renderer.toneMapping = THREE.NoToneMapping;
            renderer.shadowMap.enabled = false;

            this.controls.enableDamping = false;
            this.scene.remove(this.shadowGround);
            this.pathTracer.updateBounces(ui.domRenderBounces.value);
            this.pathTracer.updateMaxSamples(ui.domRenderMaxSamples.value);
            this.flagUpdateScene = 1;
            this.isProgressing = true;

            ui.domInfoRender.style.display = 'unset';
            ui.domSandboxRender.children[0].firstChild.innerHTML = 'stop';
        } else {
            renderer.setClearColor(0x000000, 0);
            renderer.autoClearColor = true;
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1;
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFShadowMap;
            renderer.domElement.style.pointerEvents = 'unset';

            this.controls.enableDamping = true;
            this.scene.add(this.shadowGround);
            this.isProgressing = false;

            ui.domInfoRender.style.display = 'none';
            ui.domSandboxRender.children[0].firstChild.innerHTML = 'play_arrow';
            ui.domRenderPause.innerHTML = 'Pause';
            ui.domRenderPause.classList.remove('btn_select_pt');
            ui.showProgress(0);
        }
    }

    toggleRender() {
        this.isRendering = !this.isRendering;
        this.startPathTracer(this.isRendering);
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

        this.isRendering = true;
        this.controls.enabled = true;
        this.startPathTracer(ui.domRenderAutoRender.checked);
        this.create();
        
        renderer.domElement.style.display = 'unset';
    }

    deactivate() {
        if (!this.isLoaded) return;

        this.isLoaded = false;
        this.isRendering = false;
        this.isProgressing = false;
        cancelAnimationFrame(this.animate);

        engine.isRendering = true;
        camera.camera0.position = Vector3(this.camera.position.x, this.camera.position.y, this.camera.position.z);
        camera.camera0.target = Vector3(this.controls.target.x, this.controls.target.y, this.controls.target.z);
        
        this.disposePick();
        this.startPathTracer(false);
        this.controls.enabled = false;

        ui.domRenderPause.innerHTML = 'Pause';
        ui.domRenderPause.classList.remove('btn_select_pt');
        ui.showProgress(0);
        
        renderer.domElement.style.display = 'none';
        ui.domInfoRender.style.display = 'none';
    }

    async loadHDR(url, callback) {
        await loadRGBE(url).then(tex => {
            tex.mapping = THREE.EquirectangularReflectionMapping;
            tex.minFilter = THREE.LinearFilter;
            tex.magFilter = THREE.LinearFilter;
            tex.generateMipmaps = false;
            callback(tex);
        });
    }
}


class PathTracer {
    constructor() {
        this.pt = undefined;
        this.maxSamples = 0;

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

function createVoxelTexture(size=256) {
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const ctx = c.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, size, size);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#000000EE';
    ctx.strokeRect(0, 0, size, size);
    return new THREE.CanvasTexture(c);
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
