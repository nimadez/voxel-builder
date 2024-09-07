/* 
    Sep 2024
    @nimadez
    
    Sandbox
*/


import {
    THREE,
    renderer,
    OrbitControls,
    TransformControls,
    Tween, Easing
} from '../three.js';

import { Vector3 } from '../babylon.js';

import {
    engine,
    camera, hdri, light,
    builder,
    FPS
} from '../../main.js';


const DEF_BGCOLOR = new THREE.Color(0x434b5c);


class Sandbox {
    constructor() {
        this.isLoaded = false;
        this.isRendering = false;

        this.scene = undefined;
        this.camera = undefined;
        this.controls = undefined;
        this.transform = undefined;
        this.framed = undefined;
        this.then = performance.now();
        this.mouse = new THREE.Vector2();
        this.tween = undefined;

        this.meshes = [];
        this.raycaster = new THREE.Raycaster();
        this.pick = undefined;
        this.pickBox = undefined;

        this.init();
    }

    init() {
        this.scene = new THREE.Scene();
        this.scene.background = DEF_BGCOLOR;

        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.updateProjectionMatrix();

        console.log('load sandbox');
    }

    create() {
        this.scene.clear();
        this.meshes = [];
        if (this.controls)
            this.controls.dispose();
        if (this.transform)
            this.transform.dispose();

        this.controls = new OrbitControls(this.camera, renderer.domElement);
        this.controls.minDistance = 0.01;
        this.controls.maxDistance = 1000;
        this.controls.zoomSpeed = 1.0;
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.update();

        this.updateCamera();
        this.createScene();
        this.createGeometry();
        this.animate();
        this.resize();

        this.transform = new TransformControls(this.camera, renderer.domElement);
        this.transform.addEventListener('dragging-changed', (ev) => {
            this.controls.enabled = !ev.value;
            if (this.pickBox)
                this.scene.remove(this.pickBox);
        });
        this.transform.setMode('translate');
        this.transform.size = 0.9;
        this.transform.translationSnap = 10;
        this.scene.add(this.transform);

        this.isLoaded = true;
    }

    updateCamera() {
        this.camera.position.set(camera.camera0.position.x, camera.camera0.position.y, camera.camera0.position.z);
        this.camera.fov = camera.camera0.fov * 180 / Math.PI;
        this.camera.updateProjectionMatrix();
        this.controls.target = new THREE.Vector3(camera.camera0.target.x, camera.camera0.target.y, camera.camera0.target.z);
        this.controls.update();
    }

    createScene() {
        this.framed = camera.getFramed(builder.mesh);

        this.scene.environmentIntensity = 0.5; // equalize to babylon PBR mat
        this.scene.environment = (hdri.hdrMapRender) ? hdri.hdrMapRender : DEF_BGCOLOR;
        this.scene.environment.mapping = THREE.EquirectangularReflectionMapping;

        const ambient = new THREE.AmbientLight(0xCCCCCC, 1);
        const hemisphere = new THREE.HemisphereLight(0x888888, 0x222222, 1);
        this.scene.add(ambient, hemisphere);

        const RGB = new THREE.Color(
            light.directional.diffuse.r * light.directional.intensity,
            light.directional.diffuse.g * light.directional.intensity,
            light.directional.diffuse.b * light.directional.intensity
        );

        const direct = new THREE.DirectionalLight(RGB, 1);
        direct.position.set(50, 200, 50);
        direct.target.position.set(0, 0, 0);
        direct.castShadow = true;
        direct.shadow.mapSize.width = 1024;
        direct.shadow.mapSize.height = 1024;
        direct.shadow.camera.near = 0.01;
        direct.shadow.camera.far = 1000;
        direct.shadow.camera.top = 100;
        direct.shadow.camera.bottom = -100;
        direct.shadow.camera.left = -100;
        direct.shadow.camera.right = 100;
        direct.shadow.bias = -0.0005;
        this.scene.add(direct);

        const axis = new THREE.AxesHelper(10);
        axis.position.setScalar(-0.5);
        this.scene.add(axis, new THREE.DirectionalLightHelper(direct, 10, 0x888888));

        const col_grid = new THREE.Color(0x777777);
        const grid = new THREE.GridHelper(1000, 50, col_grid, col_grid);
        grid.position.setScalar(-0.5);
        grid.material.transparent = true;
        grid.material.opacity = 0.2;
        this.scene.add(grid);
        
        const mat_shadow = new THREE.ShadowMaterial({ opacity: 0.15 });
        const shadowGround = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000, 1, 1), mat_shadow);
        shadowGround.position.setScalar(-0.5);
        shadowGround.rotation.x = -Math.PI / 2;
        shadowGround.receiveShadow = true;
        shadowGround.matrixAutoUpdate = false;
        shadowGround.updateMatrix();
        this.scene.add(shadowGround);
    }

    createGeometry() {
        builder.fillArrayBuffers();
        const geom = new THREE.BufferGeometry();
        geom.setAttribute('position', new THREE.BufferAttribute(builder.positions, 3));
        geom.setAttribute('uv', new THREE.BufferAttribute(builder.uvs, 2));
        geom.setAttribute('color', new THREE.BufferAttribute(builder.colors, 4));
        geom.setIndex(new THREE.BufferAttribute(builder.indices, 1));
        geom.computeVertexNormals();

        //for (let i = 0; i < geom.attributes.color.array.length; i++)
        //    geom.attributes.color.array[i] **= 0.69; // mimic
        //geom.attributes.color.needsUpdate = true;

        const map = createVoxelTexture();
        const mat_pbr = new THREE.MeshPhysicalMaterial({ map: map, vertexColors: true, side: THREE.BackSide });
        mat_pbr.specularIntensity = 0.8;
        mat_pbr.roughness = 0.95;
        mat_pbr.metalness = 0.05;
        mat_pbr.transmission = 0;
        mat_pbr.clearcoat = 0; // high gpu usage
        mat_pbr.clearcoatRoughness = 1;
        mat_pbr.color.convertSRGBToLinear();
        mat_pbr.needsUpdate = true;

        const mesh = new THREE.Mesh(geom, mat_pbr);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.meshes.push(mesh);
        this.scene.add(mesh);
    }

    animate() {
        requestAnimationFrame(sandbox.animate);
        if (sandbox.isLoaded && sandbox.isRendering) {
            const now = performance.now();
            const elapsed = now - sandbox.then;
            if (elapsed > FPS) {
                sandbox.then = now - (elapsed % FPS);

                renderer.render(sandbox.scene, sandbox.camera);
            }

            if (sandbox.tween)
                sandbox.tween.update(now);
            sandbox.controls.update();
        }
    }

    pickMesh() {
        if (this.pick) {
            this.transform.detach(this.pick);
            this.pick = null;
        }
        if (this.pickBox) {
            this.scene.remove(this.pickBox);
            this.pickBox = null;
        }
        
        if (this.meshes.length > 0) {
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObjects(this.meshes);
            if (intersects.length > 0) {
                this.pickBox = new THREE.BoxHelper(intersects[0].object, 0x00ffff);
                this.scene.add(this.pickBox);

                this.pick = intersects[0].object;
                this.transform.attach(this.pick);
            }
        }
    }

    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio * 1);
    }

    frameCamera(offset = 2.2) {
        const center = new THREE.Vector3(this.framed.target.x, this.framed.target.y, this.framed.target.z);
        const direction = this.controls.target.clone().sub(this.camera.position).normalize().multiplyScalar(this.framed.radius);

        const size = new THREE.Vector3();
        const bbox = new THREE.Box3();
        bbox.setFromObject(this.meshes[0]);
        bbox.getSize(size);
        bbox.getCenter(center);
        const maxSize = Math.max(size.x, size.y, size.z);

        const distance = offset * (maxSize / 2 / Math.atan(Math.PI * this.camera.fov / 360));
        const position = this.camera.position.clone().copy(center).sub(direction);
        this.camera.near = distance / 100;
        this.camera.far = distance * 100;
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

    toggleHdri() {
        if (this.scene.background === DEF_BGCOLOR) {
            this.scene.background = this.scene.environment;
            this.scene.background.mapping = THREE.EquirectangularReflectionMapping;
            this.scene.backgroundIntensity = 1.1;
        } else{
            this.scene.background = DEF_BGCOLOR;
        }
    }

    toggle() {
        (!this.isActive()) ? this.activate() : this.deactivate();
    }

    isActive() {
        return this.isLoaded && this.isRendering;
    }

    activate() {
        if (this.isLoaded) return;

        engine.isRendering = false;

        renderer.setClearColor(0x000000, 1);
        renderer.autoClearColor = true;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap;

        this.isRendering = true;
        this.create();

        renderer.domElement.style.display = 'unset';
        document.getElementById('three_watermark').style.display = 'unset';
    }

    deactivate() {
        if (!this.isLoaded) return;

        this.isLoaded = false;
        this.isRendering = false;
        cancelAnimationFrame(this.animate);

        engine.isRendering = true;
        camera.camera0.position = Vector3(this.camera.position.x, this.camera.position.y, this.camera.position.z);
        camera.camera0.target = Vector3(this.controls.target.x, this.controls.target.y, this.controls.target.z);
        this.controls.dispose();
        
        renderer.domElement.style.display = 'none';
        document.getElementById('three_watermark').style.display = 'none';
    }
}

export const sandbox = new Sandbox();


renderer.domElement.onpointerdown = (ev) => {
    sandbox.mouse.x = (ev.clientX / window.innerWidth) * 2 - 1;
    sandbox.mouse.y = -(ev.clientY / window.innerHeight) * 2 + 1;
    sandbox.pickMesh();
};

renderer.domElement.onpointermove = (ev) => {
    sandbox.mouse.x = (ev.clientX / window.innerWidth) * 2 - 1;
    sandbox.mouse.y = -(ev.clientY / window.innerHeight) * 2 + 1;
};

function createVoxelTexture(size = 256) {
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const ctx = c.getContext('2d');
    ctx.strokeStyle = '#666666';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);
    ctx.beginPath();
    ctx.moveTo(0, size);
    ctx.lineTo(size, size);
    ctx.moveTo(size, 0);
    ctx.lineTo(size, size);
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.strokeRect(0, 0, size, size);
    return new THREE.CanvasTexture(c);
}
