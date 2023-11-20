/* 
    Nov 2023
    @nimadez
    
    Real-time GPU Pathtracing Prototype
    Powered by "three-mesh-bvh" library by @gkjohnson
    Based on my previous experiment "nRAY: Raymarched Pathtracer"

    Notice: Mobile GPU is not supported
    Unable to run three-mesh-bvh examples on S22 ultra

    Notice: Multi-material is a known issue
    Unable to extract three.js geometry groups from babylon.js mesh,
    without performance hit on bvh regeneration, the startup is unbearable.

    Dev note: not all materials are good for hard-edge voxel surfaces,
    for example, dielectric and SSS look bad and just slow down the shader.

    Dev note: real-time voxel editing is possible by setting pointerEvents to none,
    but it uses more hardware resources because we have to keep both engines running.
*/
import * as THREE from 'three';
import { OrbitControls } from '../../../libs/addons/OrbitControls.js';
import { FullScreenQuad } from '../../../libs/addons/Pass.js';
import { mergeGeometries } from '../../../libs/addons/BufferGeometryUtils.js';
import { RGBELoader } from '../../../libs/addons/RGBELoader.js';
import {
    MeshBVH, MeshBVHUniformStruct, FloatVertexAttributeTexture,
	shaderStructs, shaderIntersectFunction, //shaderDistanceFunction,
    CENTER,// SAH,
    //UIntVertexAttributeTexture
} from '../../../libs/three-mesh-bvh.module.js'; // 0.6.8


const DPR = 1;
const DPR_MOVE = 0.5;
const DPR_FASTMODE = 0.75;
const CAM_FAR = 1000;
const MAXSAMPLES = 4096;
const MAXWHITE = 0.86;
const GRAY = MAXWHITE / 1.5;
const EMISSIVE_POWER = 12.0;
const RAD2DEG_STATIC = 180 / Math.PI;
let imageFragment = null;
let renderFragment = null;
let noiseTexture = null;


class Pathtracer {
    constructor() {
        this.then = performance.now();
        this.isLoaded = false;
        this.isProgressing = false;
        this.isFastMode = false;
        this.lastHDR = null;
        this.pingPong = 0;

        this.container = document.getElementById('pathtracer');
        this.canvas = document.getElementById('canvas_pt');
        this.info = document.getElementById('info_pt');

        this.renderer = undefined;
        this.scene = undefined;
        this.camera = undefined;
        this.controls = undefined;
        this.rtQuadA = undefined;
        this.rtQuadB = undefined;
        this.samples = 0;
        this.uniImage = undefined;
        this.uniRender = undefined;
        this.RTTA = undefined;
        this.RTTB = undefined;
        this.CRTT = undefined;
        this.envTexture = undefined;
        this.rtTexture = undefined;
        this.voxelTexture = createVoxelTexture('#1E1E1E');
        this.nullTexture = new THREE.Texture();
        this.geom = undefined;
        
        this.init();
    }

    init() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas, antialias: false, preserveDrawingBuffer: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio * DPR);
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.info.autoReset = false;

        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, CAM_FAR);
        this.camera.updateProjectionMatrix();

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.minDistance = 1;
        this.controls.maxDistance = CAM_FAR;
        this.controls.update();
        this.controls.addEventListener('start', () => {
            if (this.isLoaded)
                this.resize(DPR_MOVE);
        });
        this.controls.addEventListener('change', () => {
            if (this.isLoaded)
                this.resetSamples();
        });
        this.controls.addEventListener('end', () => {
            if (this.isLoaded)
                this.resize();
        });

        this.RTTA = new THREE.WebGLRenderTarget(1, 1, { type: THREE.FloatType, format: THREE.RGBAFormat, stencilBuffer: false, depthBuffer: false, minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter });
        this.RTTB = new THREE.WebGLRenderTarget(1, 1, { type: THREE.FloatType, format: THREE.RGBAFormat, stencilBuffer: false, depthBuffer: false, minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter });
        this.CRTT = new THREE.WebGLCubeRenderTarget(512, { type: THREE.FloatType, format: THREE.RGBAFormat, stencilBuffer: false, depthBuffer: false, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter });
        this.RTTA.texture.generateMipmaps = false;
        this.RTTB.texture.generateMipmaps = false;
        this.CRTT.texture.generateMipmaps = false;
    }

    create() {
        this.camera.position.set(scene.activeCamera.position.x, scene.activeCamera.position.y, scene.activeCamera.position.z);
        this.camera.fov = scene.activeCamera.fov * RAD2DEG_STATIC;
        this.camera.updateProjectionMatrix();
        this.controls.target = new THREE.Vector3(scene.activeCamera.target.x, scene.activeCamera.target.y, scene.activeCamera.target.z);
        this.controls.update();

        this.setShaderMaterials();
        this.createGeometry();
        this.animate();
        this.resize();

        // restore previous states
        if (hdri.hdrMap.url !== this.lastHDR)
            pt.loadHDR(hdri.hdrMap.url);
        this.updateUniformBounces(document.getElementById('input-pt-bounces').value);
        this.updateUniformRenderPassId(document.getElementById('input-pt-passes').value);
        this.updateUniformCameraAperture(ui.domCameraAperture.value);
        this.updateUniformCameraFocalLength(ui.domCameraFocalLength.value);
        this.updateUniformEnvPower(document.getElementById('input-pt-envpower').value);
        this.updateUniformSunLight(document.getElementById('input-pt-sunlight').checked);
        this.updateUniformSunDir(-light.getDirection().x, -light.getDirection().y, -light.getDirection().z);
        this.updateUniformSunCol(ui.domColorPickerLightColor.value);
        this.updateUniformBackground(document.getElementById('input-pt-background').checked);
        this.updateUniformMaterialId(document.getElementById('input-pt-material').value);
        this.updateUniformMaterialEmissive(document.getElementById('input-pt-emissive').value);
        this.updateUniformMaterialRoughness(document.getElementById('input-pt-roughness').value);
        this.updateUniformTexture(document.getElementById('input-pt-usetexture').checked);
    }

    setShaderMaterials() {
        this.uniImage = {
            uBuffer: { value: this.rtTexture },
            uRenderPassId: { value: 0 }
        };
        this.uniRender = {
            uBuffer: { value: this.RTTB.texture },
            uRenderPassId: { value: 0 },
            
            uBounces: { value: 4 },
            uSamples: { value: 0 },
            uAperture: { value: 0.0 },
            uFocalLength: { value: 50.0 },
            uEnvPower: { value: 1.0 },
            uSunLight: { value: false },
            uSunDir: { value: new THREE.Vector3() },
            uSunCol: { value: new THREE.Color() },
            uBackground: { value: true },
            uNoise: { value: noiseTexture },
            uCubeMap: { value: this.envTexture },
            uTexture: { value: this.nullTexture },
            uMaterialId: { value: 0 },
            uEmissive: { value: new THREE.Color() },
            uRoughness: { value: 0.0 },
            uFastMode: { value: this.isFastMode },

            cameraWorldMatrix: { value: new THREE.Matrix4() },
            invProjectionMatrix: { value: new THREE.Matrix4() },
            seed: { value: 0.00001 + Math.random() * (0.01, 0.00001) },

            bvh: { value: new MeshBVHUniformStruct() },
            normalAttribute: { value: new FloatVertexAttributeTexture() },
            colorAttribute: { value: new FloatVertexAttributeTexture() },
            uvAttribute: { value: new FloatVertexAttributeTexture() },
            //materialIndexAttribute: { value: new UIntVertexAttributeTexture() }
        };

        const vShader = "precision highp float; varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position, 1.0); }";
        const rtMaterialImage = new THREE.ShaderMaterial({
            uniforms: this.uniImage,
            vertexShader: vShader,
            fragmentShader: imageFragment,
            depthTest: false,
            depthWrite: false
        });
        const rtMaterialRender = new THREE.ShaderMaterial({
            uniforms: this.uniRender,
            vertexShader: vShader,
            fragmentShader: renderFragment,
            depthTest: false,
            depthWrite: false
        });
        rtMaterialImage.transparent = true;
        rtMaterialRender.transparent = false;

        this.rtQuadA = new FullScreenQuad(rtMaterialImage);
        this.rtQuadB = new FullScreenQuad(rtMaterialRender);
    }

    createGeometry() {
        if (MODE == 0) {
            this.createGeometryBVH({
                type: 'SPS',
                position: builder.SPS.mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind),
                //normal: builder.SPS.mesh.getVerticesData(BABYLON.VertexBuffer.NormalKind),
                uv: builder.SPS.mesh.getVerticesData(BABYLON.VertexBuffer.UVKind),
                color: builder.SPS.mesh.getVerticesData(BABYLON.VertexBuffer.ColorKind),
                indices: builder.SPS.mesh.getIndices()
            });
        } else if (MODE == 1) {
            const mesh = BABYLON.Mesh.MergeMeshes(bakery.meshes, false, true);
            const positions = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);

            const uvs = mesh.getVerticesData(BABYLON.VertexBuffer.UVKind);
            for (let i = 0; i < uvs.length/2; i++) // force per-face uvs
                uvs[2 * i + 1] *= 3.0;

            const colors = mesh.getVerticesData(BABYLON.VertexBuffer.ColorKind);
            for (let i = 0; i < colors.length; i++)
                colors[i] = Math.pow(colors[i], 0.4545);

            this.createGeometryBVH({
                type: 'BAKE',
                position: new Float32Array(positions),
                //normal: new Float32Array(mesh.getVerticesData(BABYLON.VertexBuffer.NormalKind)),
                uv: new Float32Array(uvs),
                color: new Float32Array(colors),
                indices: new Uint32Array(mesh.getIndices())
            });

            mesh.dispose();
        }
    }

    createGeometryBVH(data) {
        if (this.geom) this.geom.dispose();

        this.geom = new THREE.BufferGeometry();
        this.geom.setAttribute('position', new THREE.BufferAttribute(data.position, 3));
        //this.geom.setAttribute('normal', new THREE.BufferAttribute(data.normal, 3));
        this.geom.setAttribute('uv', new THREE.BufferAttribute(data.uv, 2));
        this.geom.setAttribute('color', new THREE.BufferAttribute(data.color, 4));
        this.geom.setIndex(new THREE.BufferAttribute(data.indices, 1));
        this.geom.computeVertexNormals();

        if (document.getElementById('input-pt-ground').checked)
            this.geom = this.createPlaneGeometry(this.geom);

        this.uniRender['bvh'].value.updateFrom(new MeshBVH(this.geom, {
            strategy: CENTER,  // CENTER|AVERAGE|SAH
            maxDepth: 40,   // def: 40
            maxLeafTris: 1  // def: 10
        }));

        this.uniRender['normalAttribute'].value.updateFrom(this.geom.attributes.normal);
        this.uniRender['uvAttribute'].value.updateFrom(this.geom.attributes.uv);
        this.updateAttributeColors(document.getElementById('input-pt-overmat').checked);

        this.isLoaded = true;
        this.resetSamples();
    }

    createPlaneGeometry(geom) {
        const plane = new THREE.PlaneGeometry(CAM_FAR*2, CAM_FAR*2, 1, 1);
        plane.rotateX(Math.PI / 2);
        plane.translate(0, -0.5, 0);
        const colors = new Float32Array(plane.attributes.position.count * 4);
        colors.fill(GRAY/1.1); // alpha channel ignored
        plane.setAttribute('color', new THREE.BufferAttribute(colors, 4));
        return mergeGeometries([ plane, geom ], false);
    }

    /* updateAttributeMaterialIndex(idx) {
        this.geom.addGroup(0, Infinity, this.materials[idx]);
        const materialIndex = getGroupMaterialIndicesAttribute(this.geom, this.materials, this.materials);
        this.geom.setAttribute('materialIndex', materialIndex);
        this.geom.clearGroups();

        this.uniRender['materialIndexAttribute'].value.updateFrom(this.geom.attributes.materialIndex);
        this.resetSamples();
    } */

    updateAttributeColors(isOverride) {
        if (isOverride) {
            const colors = new Float32Array(this.geom.attributes.position.count * 4);
            colors.fill(GRAY); // alpha channel ignored
            this.uniRender['colorAttribute'].value.updateFrom(new THREE.BufferAttribute(colors, 4));
        } else {
            this.uniRender['colorAttribute'].value.updateFrom(this.geom.attributes.color);
        }
        this.resetSamples();
    }

    updateUniformRenderPassId(id) {
        id = parseInt(id);
        this.uniImage['uRenderPassId'].value = id;
        this.uniRender['uRenderPassId'].value = id;
        this.resetSamples();
    }

    updateUniformBounces(num) {
        this.uniRender['uBounces'].value = parseInt(num);
        this.resetSamples();
    }

    updateUniformTexture(isEnabled) {
        (isEnabled) ?
            this.uniRender['uTexture'].value = this.voxelTexture :
            this.uniRender['uTexture'].value = this.nullTexture;
        this.resetSamples();
    }

    updateUniformMaterialId(id) {
        this.uniRender['uMaterialId'].value = parseInt(id);
        this.resetSamples();
    }

    updateUniformMaterialEmissive(hex) {
        const col = new THREE.Color(hex);
        col.r *= EMISSIVE_POWER * EMISSIVE_POWER;
        col.g *= EMISSIVE_POWER * EMISSIVE_POWER;
        col.b *= EMISSIVE_POWER * EMISSIVE_POWER;
        this.uniRender['uEmissive'].value = col;
        this.resetSamples();
    }

    updateUniformMaterialRoughness(val) {
        val = parseFloat(val);
        this.uniRender['uRoughness'].value = val * val;
        this.resetSamples();
    }

    updateUniformCameraAperture(val) {
        this.uniRender['uAperture'].value = parseFloat(val) / 1000;
        this.resetSamples();
    }

    updateUniformCameraFocalLength(val) {
        this.uniRender['uFocalLength'].value = parseFloat(val);
        this.resetSamples();
    }

    updateUniformEnvPower(val) {
        this.uniRender['uEnvPower'].value = parseFloat(val);
        this.resetSamples();
    }

    updateUniformSunLight(isEnabled) {
        this.uniRender['uSunLight'].value = isEnabled;
        this.resetSamples();
    }

    updateUniformSunDir(x, y, z) {
        this.uniRender['uSunDir'].value = new THREE.Vector3(x, y, z).normalize();
        this.resetSamples();
    }

    updateUniformSunCol(hex) {
        if (!this.uniRender) return;
        const col = new THREE.Color(hex);
        col.r *= ui.domLightIntensity.value * 3;
        col.g *= ui.domLightIntensity.value * 3;
        col.b *= ui.domLightIntensity.value * 3;
        this.uniRender['uSunCol'].value = col;
        this.resetSamples();
    }

    updateUniformBackground(isEnabled) {
        this.uniRender['uBackground'].value = isEnabled;
        this.resetSamples();
    }

    updateUniformFastMode(isEnabled) {
        this.uniRender['uFastMode'].value = isEnabled;
    }

    resetSamples() {
        this.samples = 0;
    }

    animate() {
        requestAnimationFrame(pt.animate);
        if (pt.isLoaded) {
            const now = performance.now();
            const elapsed = now - pt.then;
            if (pt.isProgressing && elapsed > FPS && pt.samples < MAXSAMPLES) {
                pt.then = now - (elapsed % FPS);

                // CPU AA jitter (GPU has more to do)
                if (pt.samples == 0) {
                    pt.camera.clearViewOffset();
                } else {
                    pt.camera.setViewOffset(
                        pt.renderer.domElement.width, pt.renderer.domElement.height,
                        Math.random() - 0.5, Math.random() - 0.5,
                        pt.renderer.domElement.width, pt.renderer.domElement.height,
                    );
                }

                pt.camera.updateMatrixWorld();

                pt.uniImage['uBuffer'].value = pt.rtTexture;
                pt.uniRender['uSamples'].value = pt.samples;
                pt.uniRender['uBuffer'].value = pt.pingPong ? pt.RTTB.texture : pt.RTTA.texture;
                pt.uniRender['cameraWorldMatrix'].value.copy(pt.camera.matrixWorld);
                pt.uniRender['invProjectionMatrix'].value.copy(pt.camera.projectionMatrixInverse);
                pt.uniRender['seed'].value = (pt.uniRender['seed'].value + 0.00001) % 2;

                pt.renderer.setRenderTarget(pt.pingPong ? pt.RTTA : pt.RTTB);
                //pt.renderer.clear();
                pt.rtQuadB.render(pt.renderer);

                pt.rtTexture = pt.pingPong ? pt.RTTA.texture : pt.RTTB.texture;
                pt.rtQuadA.material.map = pt.rtTexture;

                pt.renderer.setRenderTarget(null);
                pt.rtQuadA.render(pt.renderer);

                pt.pingPong ^= 1;
                pt.samples++;

                ui.domProgressBar.style.width = ~~Math.abs((pt.samples/MAXSAMPLES)*100) + '%';
                pt.info.children[0].innerHTML = ui.domProgressBar.style.width;
                pt.info.children[1].innerHTML = ~~Math.abs((pt.samples/MAXSAMPLES)*(MAXSAMPLES));
                pt.info.children[2].innerHTML = timeFormat(pt.samples);
                pt.info.children[3].innerHTML = pt.uniRender['uBounces'].value;
            }
        }
    }

    resize(ratio = DPR) {
        if (this.isFastMode) ratio = DPR_FASTMODE;

        const w = window.innerWidth;
        const h = window.innerHeight;
        const dpr = window.devicePixelRatio * ratio;

        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(w, h);
        this.renderer.setPixelRatio(dpr);
        this.RTTA.setSize(w * dpr, h * dpr);
        this.RTTB.setSize(w * dpr, h * dpr);

        //this.uniRender['uResolution'].value.set(this.renderer.domElement.width, this.renderer.domElement.height);

        // force update, prevent delay
        this.rtTexture = this.pingPong ? this.RTTA.texture : this.RTTB.texture;
        this.resetSamples();
    }

    loadHDR(url) {
        if (!this.uniRender) return; // workaround for error: loading hdr before pt.init
        loadRGBE(url).then(tex => {
            this.lastHDR = url;
            if (this.envTexture) this.envTexture.dispose();
            tex.minFilter = THREE.LinearFilter;
            tex.magFilter = THREE.LinearFilter;
            tex.generateMipmaps = false;
            tex.flipY = false;
            this.envTexture = this.CRTT.fromEquirectangularTexture(this.renderer, tex).texture;
            this.uniRender['uCubeMap'].value = this.envTexture;
            this.resetSamples();
        });
    }

    shot() { // TODO: read framebuffer pixels to eliminate preserveDrawingBuffer
        const uri = this.renderer.domElement.toDataURL('image/png');
        saveDialogImage(uri, `shot_${ new Date().toJSON().slice(0,10) }_${ randomRangeInt(1000, 9999) }.png`);
    }

    toggle() {
        if (isMobileDevice()) {
            ui.notification("mobile is not supported, try again later!");
        }
        if (MODE == 1 && bakery.meshes.length == 0) {
            ui.notification("no baked meshes");
            return;
        }
        (!this.isLoaded) ? this.activate() : this.deactivate();
    }

    activate() {
        if (this.isLoaded) return; // avoid overdraw

        isRendering = false;
        ui.domPathtracerBtn.classList.add('btn_select_pt');
        if (MODE == 0)
            ui.domHover.style.display = 'none';

        this.isProgressing = true;
        this.canvas.style.pointerEvents = 'unset';
        this.create();
        this.container.style.display = 'unset';
    }

    deactivate() {
        if (!this.isLoaded) return;

        scene.activeCamera.position = new BABYLON.Vector3(this.camera.position.x, this.camera.position.y, this.camera.position.z);
        scene.activeCamera.target = new BABYLON.Vector3(this.controls.target.x, this.controls.target.y, this.controls.target.z);
        
        this.isLoaded = false;
        this.isProgressing = false;
        cancelAnimationFrame(pt.animate);
        this.container.style.display = 'none';
        document.getElementById('btn-pt-pause').innerHTML = 'Pause';
        document.getElementById('btn-pt-pause').classList.remove('btn_select_pt');
        
        isRendering = true;
        ui.hideInterface(false);
        ui.domPathtracerBtn.classList.remove('btn_select_pt');
        ui.domProgressBar.style.width = 0;
        if (MODE == 0)
            builder.createSPS();
    }

    dispose() { // release memory and GPU
        if (!this.renderer) return;

        this.deactivate();
        
        this.renderer.dispose();
        this.controls.dispose();
        this.RTTA.dispose();
        this.RTTB.dispose();
        this.envTexture.dispose();
        this.rtTexture.dispose();
        this.RTTA = null;
        this.RTTB = null;
        this.CRTT = null;
        this.envTexture = null;
        this.rtTexture = null;
        this.renderer = null;
        this.controls = null;
        this.camera = null;
        this.scene = null;
        this.uniImage = null;
        this.uniRender = null;
    }
}

const pt = new Pathtracer();


// -------------------------------------------------------
// Load assets


loadFile('src/modules/pathtracer/shaders/image.fs').then(data => {
    imageFragment = `
        precision mediump samplerCube;
        ` + data;
});

loadFile('src/modules/pathtracer/shaders/render.fs').then(data => {
    renderFragment = `
        precision highp isampler2D;
        precision highp usampler2D;
        precision mediump samplerCube;
        ${ shaderStructs }
        ${ shaderIntersectFunction }
        ` + data;
});

loadTexture('assets/bluenoise256.png').then(tex => {
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.format = THREE.RGBAFormat;
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    tex.generateMipmaps = false;
    noiseTexture = tex;
});


// -------------------------------------------------------
// Register events


ui.domPathtracerBtn.onclick = () => {
    pt.toggle();
};

ui.domCameraFov.addEventListener('input', (ev) => {
    if (pt.isLoaded) {
        pt.camera.fov = ev.target.value * RAD2DEG_STATIC;
        pt.camera.updateProjectionMatrix();
        pt.resetSamples();
    }
}, false);

ui.domCameraAperture.oninput = (ev) => {
    if (pt.isLoaded)
        pt.updateUniformCameraAperture(ev.target.value);
};

ui.domCameraFocalLength.oninput = (ev) => {
    if (pt.isLoaded)
        pt.updateUniformCameraFocalLength(ev.target.value);
};

ui.domColorPickerLightColor.addEventListener('input', (ev) => {
    if (pt.isLoaded)
        pt.updateUniformSunCol(ev.target.value);
}, false);

ui.domLightIntensity.addEventListener('input', () => {
    if (pt.isLoaded)
        pt.updateUniformSunCol(ui.domColorPickerLightColor.value);
}, false);

document.getElementById('input-pt-passes').onchange = (ev) => {
    if (pt.isLoaded)
        pt.updateUniformRenderPassId(ev.target.value);
};

document.getElementById('input-pt-bounces').onchange = (ev) => {
    if (pt.isLoaded)
        pt.updateUniformBounces(ev.target.value);
};

document.getElementById('input-pt-envpower').onchange = (ev) => {
    if (pt.isLoaded) {
        if (ev.target.value < 0.01) ev.target.value = 0.01;
        pt.updateUniformEnvPower(ev.target.value);
    }
};

document.getElementById('input-pt-envpower').onwheel = (ev) => {
    if (pt.isLoaded)
        pt.updateUniformEnvPower(ev.target.value);
};

document.getElementById('input-pt-sunlight').oninput = (ev) => {
    if (pt.isLoaded)
        pt.updateUniformSunLight(ev.target.checked);
};

document.getElementById('input-pt-background').oninput = (ev) => {
    if (pt.isLoaded)
        pt.updateUniformBackground(ev.target.checked);
};

document.getElementById('input-pt-material').onchange = (ev) => {
    if (pt.isLoaded)
        pt.updateUniformMaterialId(ev.target.value);
};

document.getElementById('input-pt-emissive').oninput = (ev) => {
    if (pt.isLoaded)
        pt.updateUniformMaterialEmissive(ev.target.value);
};

document.getElementById('input-pt-roughness').onchange = (ev) => {
    if (pt.isLoaded)
        pt.updateUniformMaterialRoughness(ev.target.value);
};

document.getElementById('input-pt-usetexture').oninput = (ev) => {
    if (pt.isLoaded)
        pt.updateUniformTexture(ev.target.checked);
};

document.getElementById('input-pt-overmat').oninput = (ev) => {
    if (pt.isLoaded)
        pt.updateAttributeColors(ev.target.checked);
};

document.getElementById('input-pt-ground').oninput = () => {
    if (pt.isLoaded)
        pt.createGeometry();
};

document.getElementById('btn-pt-pause').onclick = (ev) => {
    if (pt.isLoaded) {
        pt.isProgressing = !pt.isProgressing;
        if (pt.isProgressing) {
            ev.target.innerHTML = 'Pause';
            ev.target.classList.remove('btn_select_pt');
            pt.canvas.style.pointerEvents = 'unset';
        } else {
            ev.target.innerHTML = 'Continue';
            ev.target.classList.add('btn_select_pt');
            pt.canvas.style.pointerEvents = 'none';
        }
    }
};

document.getElementById('btn-pt-shot').onclick = () => {
    if (pt.isLoaded)
        pt.shot();
};

document.getElementById('btn-pt-fast').onclick = (ev) => {
    pt.isFastMode = !pt.isFastMode;
    (pt.isFastMode) ?
        ev.target.classList.add('btn_select_pt') :
        ev.target.classList.remove('btn_select_pt');
    if (pt.isLoaded) {
        pt.updateUniformFastMode(pt.isFastMode);
        pt.resize();
    }
};

pt.canvas.addEventListener('wheel', () => {
    if (pt.isLoaded) {
        pt.resize(DPR_MOVE);
        setTimeout(() => {
            pt.resize();
        }, 100);
    }
}, false);

window.addEventListener('resize', () => {
    if (pt.isLoaded)
        pt.resize();
}, false);


// -------------------------------------------------------
// Utils


async function loadFile(url) {
    return new Promise(resolve => {
        new THREE.FileLoader().load(url, resolve);
    });
}

async function loadTexture(url) {
    return new Promise(resolve => {
        new THREE.TextureLoader().load(url, resolve);
    });
}

async function loadRGBE(url) {
    return new Promise(resolve => {
        new RGBELoader().load(url, resolve);
    });
}

function createVoxelTexture(hex, size=256) {
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const ctx = c.getContext('2d');
    ctx.lineWidth = 8;
    ctx.strokeStyle = hex;
    ctx.strokeRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.format = THREE.RGBAFormat;
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    tex.generateMipmaps = false;
    tex.premultiplyAlpha = false;
    tex.flipY = false;
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


// -------------------------------------------------------
// Exports


export {
    pt
}

export function isActive() {
    return pt.renderer && pt.isLoaded && pt.isProgressing;
}
