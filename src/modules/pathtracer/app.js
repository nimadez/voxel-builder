/* 
    Nov 2023
    @nimadez
    
    Real-time GPU Pathtracing Prototype
    Powered by "three-mesh-bvh" library by @gkjohnson
    Based on my previous experiment "nRAY: Raymarched Pathtracer"

    Notice: Mobile GPU is not supported
    There is an issue with three-mesh-bvh that may be fixed in the future.
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
const FPS = 1000 / 60;
const RAD2DEG_STATIC = 180 / Math.PI;
let imageFragment = null;
let renderFragment = null;
let noiseTexture = null;
let then = performance.now();
let pingPong = 0;
let isLoaded = false;
let isFastMode = false;


class Pathtracer {
    constructor() {
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
        this.voxelTexture = createVoxelTexture('#222222');
        this.nullTexture = new THREE.Texture();
        this.geom = undefined;
        this.materials = [ 0, 1, 2 ]; // emissive, lambert, metallic
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
            if (isLoaded)
                this.resize(DPR_MOVE);
        });
        this.controls.addEventListener('change', () => {
            if (isLoaded)
                this.resetSamples();
        });
        this.controls.addEventListener('end', () => {
            if (isLoaded)
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

        this.loadHDR(document.getElementById('input-pt-hdri').value);
        this.setShaderMaterials();
        this.createGeometry();
        this.animate();
        this.resize();

        // restore states
        this.updateUniformCameraAperture(document.getElementById('input-pt-aperture').value);
        this.updateUniformCameraFocalLength(document.getElementById('input-pt-focallength').value);
    }

    setShaderMaterials() {
        this.uniImage = {
            uBuffer: { value: this.rtTexture },
            uRenderPassId: { value: document.getElementById('input-pt-passes').value },
        };
        this.uniRender = {
            uBuffer: { value: this.RTTB.texture },
            uRenderPassId: { value: document.getElementById('input-pt-passes').value },
            uBounces: { value: document.getElementById('input-pt-bounces').value },
            uSamples: { value: 0 },
            uResolution: { value: new THREE.Vector2(1, 1) },
            uAperture: { value: 0.0 },
            uFocalLength: { value: document.getElementById('input-pt-focallength').value },
            uEnvPower: { value: document.getElementById('input-pt-envpower').value },
            uNoise: { value: noiseTexture },
            uCubeMap: { value: this.envTexture },
            uTexture: { value: this.nullTexture },
            uEmissive: { value: new THREE.Color(document.getElementById('input-pt-emissive').value) },
            uMetallic: { value: document.getElementById('input-pt-metallic').value },
            uFastMode: { value: isFastMode },

            cameraWorldMatrix: { value: new THREE.Matrix4() },
            invProjectionMatrix: { value: new THREE.Matrix4() },
            seed: { value: 0 },

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
            const colors = mesh.getVerticesData(BABYLON.VertexBuffer.ColorKind);

            const uvs = []; // forced per-face uvs
            for (let i = 0; i < positions.length / 12; i++)
                uvs.push(0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0);

            for (let i = 0; i < colors.length; i++)
                colors[i] = Math.pow(colors[i], 1.0 / 2.2);

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
        this.uniRender['colorAttribute'].value.updateFrom(this.geom.attributes.color);
        this.uniRender['uvAttribute'].value.updateFrom(this.geom.attributes.uv);

        // restore states
        //(document.getElementById('input-pt-metallic').value == 0) ?
        //    this.updateAttributeMaterialIndex(1) :
        //    this.updateAttributeMaterialIndex(2);
        this.updateAttributeColors(document.getElementById('input-pt-overmat').checked);
        this.updateUniformTexture(document.getElementById('input-pt-usetexture').checked);

        isLoaded = true;
        this.resetSamples();
    }

    createPlaneGeometry(geom) {
        const plane = new THREE.PlaneGeometry(CAM_FAR*2, CAM_FAR*2, 1, 1);
        plane.rotateX(Math.PI / 2);
        plane.translate(0, -0.5, 0);
        const colors = new Float32Array(plane.attributes.position.count * 4);
        colors.fill(GRAY);
        plane.setAttribute('color', new THREE.BufferAttribute(colors, 4));
        return mergeGeometries([ plane, geom ], false);
    }

    /* updateAttributeMaterialIndex(idx) {
        // TODO: we need to find a way to tag each voxel for a specific material index,
        // it's easier to do in bakery mode because we can select meshes and apply properties,
        // but voxels only have position, color and visibility, we need to use colors to
        // tag material indexes, then manually set voxel colors for each material,
        // another option is to access SPS particles to register new materialIndex value.
        //
        // The new issue is slowing down the bvh generation,
        // if we want to check the mesh again here, the startup
        // is slow when stopping and starting the render.
        
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
            colors.fill(GRAY);
            this.uniRender['colorAttribute'].value.updateFrom(new THREE.BufferAttribute(colors, 4));
        } else {
            this.uniRender['colorAttribute'].value.updateFrom(this.geom.attributes.color);
        }
        this.resetSamples();
    }

    updateUniformBounces(val) {
        this.uniRender['uBounces'].value = val;
        this.resetSamples();
    }

    updateUniformTexture(isEnabled) {
        (isEnabled) ?
            this.uniRender['uTexture'].value = this.voxelTexture :
            this.uniRender['uTexture'].value = this.nullTexture;
        this.resetSamples();
    }

    updateUniformMaterialEmissive(hex) {
        this.uniRender['uEmissive'].value = new THREE.Color(hex);
        this.resetSamples();
    }

    updateUniformMaterialMetallic(val) {
        this.uniRender['uMetallic'].value = val;
        this.resetSamples();
    }

    updateUniformCameraAperture(val) {
        this.uniRender['uAperture'].value = val / 1000;
        this.resetSamples();
    }

    updateUniformCameraFocalLength(val) {
        this.uniRender['uFocalLength'].value = val;
        this.resetSamples();
    }

    updateUniformEnvPower(val) {
        this.uniRender['uEnvPower'].value = val;
        this.resetSamples();
    }

    updateUniformFastMode(val) {
        this.uniRender['uFastMode'].value = val;
    }

    updateUniformRenderPassId(val) {
        this.uniImage['uRenderPassId'].value = val;
        this.uniRender['uRenderPassId'].value = val;
        this.resetSamples();
    }

    resetSamples() {
        this.samples = 0;
    }

    animate() {
        requestAnimationFrame(pt.animate);
        if (isLoaded) {
            const now = performance.now();
            const elapsed = now - then;
            if (elapsed > FPS && pt.samples < MAXSAMPLES) {
                then = now - (elapsed % FPS);

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
                pt.uniRender['uBuffer'].value = pingPong ? pt.RTTB.texture : pt.RTTA.texture;
                pt.uniRender['cameraWorldMatrix'].value.copy(pt.camera.matrixWorld);
                pt.uniRender['invProjectionMatrix'].value.copy(pt.camera.projectionMatrixInverse);
                pt.uniRender['seed'].value = (pt.uniRender['seed'].value + 0.00001) % 2;

                pt.renderer.setRenderTarget(pingPong ? pt.RTTA : pt.RTTB);
                pt.rtQuadB.render(pt.renderer);

                pt.rtTexture = pingPong ? pt.RTTA.texture : pt.RTTB.texture;
                pt.rtQuadA.material.map = pt.rtTexture;

                pt.renderer.setRenderTarget(null);
                pt.rtQuadA.render(pt.renderer);

                pingPong ^= 1;
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
        if (isFastMode) ratio = DPR_FASTMODE;

        const w = window.innerWidth;
        const h = window.innerHeight;
        const dpr = window.devicePixelRatio * ratio;

        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(w, h);
        this.renderer.setPixelRatio(dpr);
        this.RTTA.setSize(w * dpr, h * dpr);
        this.RTTB.setSize(w * dpr, h * dpr);

        this.uniRender['uResolution'].value.set(this.renderer.domElement.width, this.renderer.domElement.height);

        // force update, prevent delay
        this.rtTexture = pingPong ? this.RTTA.texture : this.RTTB.texture;
        this.resetSamples();
    }

    async loadHDR(envMap) {
        await loadRGBE(envMap).then(data => {
            if (this.envTexture) this.envTexture.dispose();
            //data.colorspace = THREE.LinearSRGBColorSpace;
            data.minFilter = THREE.LinearFilter;
            data.magFilter = THREE.LinearFilter;
            data.generateMipmaps = false;
            data.flipY = false;
            this.envTexture = this.CRTT.fromEquirectangularTexture(this.renderer, data).texture;
            this.uniRender['uCubeMap'].value = this.envTexture;
            this.resetSamples();
        });
    }

    activate() {
        if (isLoaded) return; // avoid overdraw

        isRendering = false;
        ui.domPathtracerBtn.classList.add('btn_select_pt');
        if (MODE == 0)
            ui.domHover.style.display = 'none';

        this.create();
        this.container.style.display = 'unset';
    }

    deactivate() {
        if (!isLoaded) return;

        scene.activeCamera.position = new BABYLON.Vector3(this.camera.position.x, this.camera.position.y, this.camera.position.z);
        scene.activeCamera.target = new BABYLON.Vector3(this.controls.target.x, this.controls.target.y, this.controls.target.z);
        
        isLoaded = false;
        cancelAnimationFrame(pt.animate);
        this.container.style.display = 'none';
        
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

function activate() {
    pt.activate();
}

function deactivate() {
    pt.deactivate();
}

function toggle() {
    if (isMobileDevice()) {
        ui.notification("Mobile is not supported, try again later!");
        return;
    }
    if (MODE == 1 && bakery.meshes.length == 0) {
        ui.notification("no baked meshes");
        return;
    }
    (!isLoaded) ? pt.activate() : pt.deactivate();
}

function isActive() {
    return pt.renderer && isLoaded;
}

function reset() {
    if (isLoaded)
        pt.resetSamples();
}

function updateCamera(fov) {
    if (isLoaded) {
        pt.camera.fov = fov * RAD2DEG_STATIC;
        pt.camera.updateProjectionMatrix();
        pt.resetSamples();
    }
}

function getShot() { // TODO: use framebuffer
    return pt.renderer.domElement.toDataURL('image/png');
}

function dispose() {
    pt.dispose();
}


// Load assets

await loadFile('src/modules/pathtracer/shaders/image.fs').then(data => {
    imageFragment = data;
});

await loadFile('src/modules/pathtracer/shaders/render.fs').then(data => {
    renderFragment =  `
        precision highp isampler2D;
        precision highp usampler2D;
        precision mediump samplerCube;
        ${ shaderStructs }
        ${ shaderIntersectFunction }
        #include <common>
        ` + data;
});

await loadTexture('assets/bluenoise256.png').then(tex => {
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.format = THREE.RGBAFormat;
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    tex.generateMipmaps = false;
    noiseTexture = tex;
});


// Register events

pt.canvas.addEventListener('wheel', () => {
    if (isLoaded) {
        pt.resize(DPR_MOVE);
        setTimeout(() => {
            pt.resize();
        }, 100);
    }
}, false);

ui.domPathtracerBtn.onclick = () => {
    toggle();
};

document.getElementById('btn-pt-fast').onclick = (ev) => {
    isFastMode = !isFastMode;
    (isFastMode) ?
        ev.target.classList.add('btn_select_pt') :
        ev.target.classList.remove('btn_select_pt');
    if (isLoaded) {
        pt.updateUniformFastMode(isFastMode);
        pt.resize();
    }
};

document.getElementById('input-pt-bounces').onchange = (ev) => {
    if (isLoaded)
        pt.updateUniformBounces(parseInt(ev.target.value));
};

document.getElementById('input-pt-passes').onchange = (ev) => {
    if (isLoaded)
        pt.updateUniformRenderPassId(parseInt(ev.target.value));
};

document.getElementById('input-pt-envpower').oninput = (ev) => {
    let power = parseFloat(ev.target.value);
    if (ev.target.value == 0) power = 0.1;
    if (isLoaded)
        pt.updateUniformEnvPower(power);
};

document.getElementById('input-pt-aperture').oninput = (ev) => {
    if (isLoaded)
        pt.updateUniformCameraAperture(parseFloat(ev.target.value));
};

document.getElementById('input-pt-focallength').oninput = (ev) => {
    if (isLoaded)
        pt.updateUniformCameraFocalLength(parseFloat(ev.target.value));
};

document.getElementById('input-pt-emissive').oninput = (ev) => {
    if (isLoaded)
        pt.updateUniformMaterialEmissive(ev.target.value);
};

document.getElementById('input-pt-metallic').oninput = (ev) => {
    if (isLoaded) {
        //(ev.target.value == 0) ?
        //    pt.updateAttributeMaterialIndex(1) :
        //    pt.updateAttributeMaterialIndex(2);
        pt.updateUniformMaterialMetallic(parseFloat(ev.target.value));
    }
};

document.getElementById('input-pt-usetexture').oninput = (ev) => {
    if (isLoaded)
        pt.updateUniformTexture(ev.target.checked);
};

document.getElementById('input-pt-overmat').oninput = (ev) => {
    if (isLoaded)
        pt.updateAttributeColors(ev.target.checked);
};

document.getElementById('input-pt-hdri').onchange = (ev) => {
    if (isLoaded)
        pt.loadHDR(ev.target.value);
};

document.getElementById('input-pt-ground').onchange = () => {
    if (isLoaded)
        pt.createGeometry();
};

window.addEventListener('resize', () => {
    if (isLoaded)
        pt.resize();
}, false);

document.getElementById('openfile_pt_hdr').addEventListener("change", (ev) => {
    if (ev.target.files.length > 0) {
        const url = URL.createObjectURL(ev.target.files[0]);
        pt.loadHDR(url);
        URL.revokeObjectURL(url);
    }
}, false);

document.getElementById('input-pt-presets').onchange = (ev) => {
    switch (ev.target.value) {
        case "0": // default lambert
            document.getElementById('input-pt-envpower').value = 20;
            document.getElementById('input-pt-metallic').value = 0;
            if (isLoaded) {
                pt.updateUniformEnvPower(20);
                pt.updateUniformMaterialMetallic(0);
            }
            break;
        case "1": // default metallic
            document.getElementById('input-pt-envpower').value = 4;
            document.getElementById('input-pt-metallic').value = 0.2;
            if (isLoaded) {
                pt.updateUniformEnvPower(4);
                pt.updateUniformMaterialMetallic(0.2);
            }
            break;
    }
    pt.resetSamples();
};


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

// source: https://github.com/gkjohnson/three-gpu-pathtracer
/* function getGroupMaterialIndicesAttribute(geometry, materials, allMaterials) {
    const indexAttr = geometry.index;
    const posAttr = geometry.attributes.position;
    const vertCount = posAttr.count;
    const totalCount = indexAttr ? indexAttr.count : vertCount;
    let groups = geometry.groups;
    if (groups.length === 0) {
        groups = [ { count: totalCount, start: 0, materialIndex: 0 } ];
    }

    // use an array with the minimum precision required to store all material id references.
    let materialArray;
    if (allMaterials.length <= 255) {
        materialArray = new Uint8Array(vertCount);
    } else {
        materialArray = new Uint16Array(vertCount);
    }

    for (let i = 0; i < groups.length; i++) {
        const group = groups[i];
        const start = group.start;
        const count = group.count;
        const endCount = Math.min(count, totalCount - start);

        const mat = Array.isArray(materials) ? materials[ group.materialIndex ] : materials;
        const materialIndex = allMaterials.indexOf(mat);

        for (let j = 0; j < endCount; j++) {
            let index = start + j;
            if (indexAttr) {
                index = indexAttr.getX(index);
            }
            materialArray[ index ] = materialIndex;
        }
    }

    return new THREE.BufferAttribute(materialArray, 1, false);
} */

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


// Exports

export {
    activate,
    deactivate,
    toggle,
    isActive,
    reset,
    updateCamera,
    getShot,
    dispose
}
