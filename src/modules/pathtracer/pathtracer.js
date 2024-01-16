/* 
    Nov 2023
    @nimadez
    
    Real-time GPU Path Tracer
    Powered by "three-mesh-bvh" library by @gkjohnson
*/
import {
    THREE,
    OrbitControls,
    FullScreenQuad,
    mergeGeometries,
    RGBELoader,
    MeshBVHUniformStruct,
    FloatVertexAttributeTexture,
	shaderStructs, shaderIntersectFunction
} from '../three.js';

const DPR = 1;
const DPR_MOVE = 0.6;
const DPR_FASTMODE = 0.6;
const CAM_FAR = 1000;
const MAXSAMPLES = 4096;
const MAXWHITE = 0.86;
const GRAY = MAXWHITE / 2;
const LIGHT_POWER = 16.0 * 16.0;
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
        this.domPause = document.getElementById('btn-pt-pause');
        this.domFastMode = document.getElementById('btn-pt-fast');
        this.domShade = document.getElementById('input-pt-shade');

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
        this.voxelTexture = createTexture(TEX_PATTERNS[3]);
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

        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, CAM_FAR);
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
        this.camera.position.set(camera.camera0.position.x, camera.camera0.position.y, camera.camera0.position.z);
        this.camera.fov = camera.camera0.fov * RAD2DEG_STATIC;
        this.camera.updateProjectionMatrix();
        this.controls.target = new THREE.Vector3(camera.camera0.target.x, camera.camera0.target.y, camera.camera0.target.z);
        this.controls.update();

        this.setShaderMaterials();
        this.createGeometry();
        this.animate();
        this.resize();

        // restore previous states
        if (hdri.hdrMap.url !== this.lastHDR)
            pt.updateHDR(hdri.hdrMap.url);
        this.updateUniformBounces(document.getElementById('input-pt-bounces').value);
        this.updateUniformRenderPassId(document.getElementById('input-pt-passes').value);
        this.updateUniformCameraAperture(ui.domCameraAperture.value);
        this.updateUniformCameraFocalLength(ui.domCameraFocalLength.value);
        this.updateUniformEnvPower(document.getElementById('input-pt-envpower').value);
        this.updateUniformDirectLight(document.getElementById('input-pt-directlight').checked);
        this.updateUniformLightDir(-light.getDirection().x, -light.getDirection().y, -light.getDirection().z);
        this.updateUniformLightCol(ui.domColorPickerLightColor.value);
        this.updateUniformBackground(document.getElementById('input-pt-background').checked);
        this.updateUniformMaterialId(document.getElementById('input-pt-material').value);
        this.updateUniformMaterialEmissive(document.getElementById('input-pt-emissive').value);
        this.updateUniformMaterialRoughness(document.getElementById('input-pt-roughness').value);
        this.updateUniformGrid(document.getElementById('input-pt-grid').checked);
    }

    setShaderMaterials() {
        this.uniImage = {
            uBuffer: { value: this.RTTA.texture },
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
            uDirectLight: { value: false },
            uLightDir: { value: new THREE.Vector3() },
            uLightCol: { value: new THREE.Color() },
            uBackground: { value: true },
            uNoise: { value: noiseTexture },
            uCubeMap: { value: this.envTexture },
            uMaterialId: { value: 0 },
            uEmissive: { value: new THREE.Color() },
            uRoughness: { value: 0.0 },
            uGrid: { value: 0.0 },

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
        if (this.geom) {
            this.geom.boundsTree.geometry.dispose();
            this.geom.dispose()
        };

        builder.fillArrayBuffers();
        this.geom = new THREE.BufferGeometry();
        this.geom.setAttribute('position', new THREE.BufferAttribute(builder.positions, 3));
        //this.geom.setAttribute('normal', new THREE.BufferAttribute(builder.normals, 3));
        this.geom.setAttribute('uv', new THREE.BufferAttribute(builder.uvs, 2));
        this.geom.setAttribute('color', new THREE.BufferAttribute(builder.colors, 4));
        this.geom.setIndex(new THREE.BufferAttribute(builder.indices, 1));
        this.geom.computeVertexNormals();

        if (document.getElementById('input-pt-ground').checked)
            this.geom = this.createPlaneGeometry(this.geom);

        this.geom.computeBoundsTree({
            //strategy: CENTER,   // CENTER|AVERAGE|SAH
            maxDepth: 40,       // def: 40
            maxLeafTris: 1,     // def: 10
            indirect: true
        });
        
        this.uniRender['bvh'].value.updateFrom(this.geom.boundsTree);
        this.uniRender['normalAttribute'].value.updateFrom(this.geom.attributes.normal);
        this.uniRender['uvAttribute'].value.updateFrom(this.geom.attributes.uv);
        this.updateAttributeColors();

        this.isLoaded = true;
        this.resetSamples();
    }

    createPlaneGeometry(geom) {
        const plane = new THREE.PlaneGeometry(CAM_FAR*2, CAM_FAR*2, 1, 1);
        plane.rotateX(Math.PI / 2);
        plane.translate(0, -0.5, 0);
        const color = new THREE.Color(document.getElementById('input-pt-groundcolor').value);
        const colors = new Float32Array(plane.attributes.position.count * 4);
        for (let i = 0; i < colors.length / 4; i++) {
            colors[4 * i + 0] = color.r;
            colors[4 * i + 1] = color.g;
            colors[4 * i + 2] = color.b;
            colors[4 * i + 3] = 1;
        }
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

    updateAttributeColors() {
        if (pt.domShade.checked) {
            const colors = new Float32Array(this.geom.attributes.position.count * 4);
            colors.fill(GRAY / 1.5);
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

    updateUniformGrid(isEnabled) {
        (isEnabled) ?
            this.uniRender['uGrid'].value = 0.25 :
            this.uniRender['uGrid'].value = 0;
        this.resetSamples();
    }

    updateUniformMaterialId(id) {
        this.uniRender['uMaterialId'].value = parseInt(id);
        this.resetSamples();
    }

    updateUniformMaterialEmissive(hex) {
        const col = new THREE.Color(hex);
        col.r = (col.r * col.r) * LIGHT_POWER;
        col.g = (col.g * col.g) * LIGHT_POWER;
        col.b = (col.b * col.b) * LIGHT_POWER;
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

    updateUniformDirectLight(isEnabled) {
        this.uniRender['uDirectLight'].value = isEnabled;
        this.resetSamples();
    }

    updateUniformLightDir(x, y, z) {
        this.uniRender['uLightDir'].value = new THREE.Vector3(x, y, z).normalize();
        this.resetSamples();
    }

    updateUniformLightCol(hex) {
        if (!this.uniRender) return;
        const col = new THREE.Color(hex);
        col.r = (col.r * col.r) * (ui.domLightIntensity.value * 3);
        col.g = (col.g * col.g) * (ui.domLightIntensity.value * 3);
        col.b = (col.b * col.b) * (ui.domLightIntensity.value * 3);
        this.uniRender['uLightCol'].value = col;
        this.resetSamples();
    }

    updateUniformBackground(isEnabled) {
        this.uniRender['uBackground'].value = isEnabled;
        this.resetSamples();
    }

    async updateHDR(url) {
        if (!this.uniRender) return; // workaround for error: loading hdr before pt.init
        await loadRGBE(url).then(tex => {
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

    resetSamples() {
        this.samples = 0;
    }

    pause() {
        this.isProgressing = !this.isProgressing;
        if (this.isProgressing) {
            this.domPause.innerHTML = 'Pause';
            this.domPause.classList.remove('btn_select_pt');
            this.canvas.style.pointerEvents = 'unset';
        } else {
            this.domPause.innerHTML = 'Continue';
            this.domPause.classList.add('btn_select_pt');
            this.canvas.style.pointerEvents = 'none';
        }
    }

    fastMode() {
        this.isFastMode = !this.isFastMode;
        (this.isFastMode) ?
            this.domFastMode.classList.add('btn_select_pt') :
            this.domFastMode.classList.remove('btn_select_pt');
        if (this.isLoaded)
            this.resize();
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

                pt.camera.updateMatrixWorld(true);

                pt.uniImage['uBuffer'].value = pt.pingPong ? pt.RTTA.texture : pt.RTTB.texture;
                pt.uniRender['uSamples'].value = pt.samples;
                pt.uniRender['uBuffer'].value = pt.pingPong ? pt.RTTB.texture : pt.RTTA.texture;
                pt.uniRender['cameraWorldMatrix'].value.copy(pt.camera.matrixWorld);
                pt.uniRender['invProjectionMatrix'].value.copy(pt.camera.projectionMatrixInverse);
                pt.uniRender['seed'].value = (pt.uniRender['seed'].value + 0.00001) % 2;

                pt.renderer.setRenderTarget(pt.pingPong ? pt.RTTA : pt.RTTB);
                pt.rtQuadB.render(pt.renderer);

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
        
        this.resetSamples();
    }

    frameCamera() {
        const f = camera.getFramed(builder.mesh);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        this.geom.boundingBox.getSize(size);
        this.geom.boundingBox.getCenter(center);
        const direction = this.controls.target.clone().sub(this.camera.position).normalize().multiplyScalar(f.radius);

        this.camera.position.copy(center).sub(direction);
        this.controls.target.copy(new THREE.Vector3(f.target.x, f.target.y, f.target.z));

        this.camera.updateProjectionMatrix();
        this.controls.update();
    }

    shot() {
        const uri = this.renderer.domElement.toDataURL('image/png');
        saveDialogImage(uri, `shot_${ new Date().toJSON().slice(0,10) }_${ randomRangeInt(1000, 9999) }.png`);
    }

    toggle() {
        (!this.isLoaded) ? this.activate() : this.deactivate();
    }

    isActive() {
        return this.renderer && this.isLoaded && this.isProgressing;
    }

    activate() {
        if (this.isLoaded) return; // avoid overdraw

        isRendering = false;

        this.isProgressing = true;
        this.create();

        this.canvas.style.pointerEvents = 'unset';
        this.container.style.display = 'unset';
    }

    deactivate() {
        if (!this.isLoaded) return;

        camera.camera0.position = new BABYLON.Vector3(this.camera.position.x, this.camera.position.y, this.camera.position.z);
        camera.camera0.target = new BABYLON.Vector3(this.controls.target.x, this.controls.target.y, this.controls.target.z);
       
        this.isLoaded = false;
        this.isProgressing = false;
        cancelAnimationFrame(pt.animate);
        
        isRendering = true;
        ui.domProgressBar.style.width = 0;

        this.domPause.innerHTML = 'Pause';
        this.domPause.classList.remove('btn_select_pt');
        this.canvas.style.pointerEvents = 'none';
        this.container.style.display = 'none';
    }

    dispose() {
        // PT is never disposed
    }
}

export const pt = new Pathtracer();


// -------------------------------------------------------
// Load assets


await loadFile('src/modules/pathtracer/shaders/image.fs').then(data => {
    imageFragment = `
        precision mediump samplerCube;
        ` + data;
});

await loadFile('src/modules/pathtracer/shaders/render.fs').then(data => {
    renderFragment = `
        precision highp isampler2D;
        precision highp usampler2D;
        precision mediump samplerCube;
        ${ shaderStructs }
        ${ shaderIntersectFunction }
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


// -------------------------------------------------------
// Register events


ui.domCameraFov.oninput = (ev) => {
    if (pt.isLoaded) {
        pt.camera.fov = ev.target.value * RAD2DEG_STATIC;
        pt.camera.updateProjectionMatrix();
        pt.resetSamples();
    }
};

ui.domCameraAperture.oninput = (ev) => {
    if (pt.isLoaded)
        pt.updateUniformCameraAperture(ev.target.value);
};

ui.domCameraFocalLength.oninput = (ev) => {
    if (pt.isLoaded)
        pt.updateUniformCameraFocalLength(ev.target.value);
};

ui.domColorPickerLightColor.oninput = (ev) => {
    if (pt.isLoaded)
        pt.updateUniformLightCol(ev.target.value);
};

ui.domLightIntensity.onchange = () => {
    if (pt.isLoaded)
        pt.updateUniformLightCol(ui.domColorPickerLightColor.value);
};

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
        if (ev.target.value < 1) ev.target.value = 1;
        pt.updateUniformEnvPower(ev.target.value);
    }
};

document.getElementById('input-pt-envpower').onwheel = (ev) => {
    if (pt.isLoaded)
        pt.updateUniformEnvPower(ev.target.value);
};

document.getElementById('input-pt-directlight').oninput = (ev) => {
    if (pt.isLoaded)
        pt.updateUniformDirectLight(ev.target.checked);
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

document.getElementById('input-pt-roughness').oninput = (ev) => {
    if (pt.isLoaded)
        pt.updateUniformMaterialRoughness(ev.target.value);
};

document.getElementById('input-pt-grid').oninput = (ev) => {
    if (pt.isLoaded)
        pt.updateUniformGrid(ev.target.checked);
};

document.getElementById('input-pt-shade').oninput = () => {
    if (pt.isLoaded)
        pt.updateAttributeColors();
};

document.getElementById('input-pt-ground').oninput = () => {
    if (pt.isLoaded)
        pt.createGeometry();
};

document.getElementById('btn-pt-pause').onclick = () => {
    if (pt.isLoaded)
        pt.pause();
};

document.getElementById('btn-pt-shot').onclick = () => {
    if (pt.isLoaded)
        pt.shot();
};

document.getElementById('btn-pt-fast').onclick = () => {
    pt.fastMode();
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

function createTexture(url) {
    const tex = new THREE.TextureLoader().load(url);
    tex.colorSpace = THREE.SRGBColorSpace;
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
