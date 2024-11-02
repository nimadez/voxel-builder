/* 
    Sep 2024
    @nimadez

    Babylon.js
*/


class Engine {
    constructor() {
        this.canvas = document.getElementById('canvas');

        this.engine = undefined;
        this.isRendering = false;
    }

    init() {
        return new Promise(resolve => {
            this.engine = new BABYLON.Engine(this.canvas, true, {});
            this.engine.disablePerformanceMonitorInBackground = true;
            this.engine.preserveDrawingBuffer = false;
            this.engine.premultipliedAlpha = false;
            this.engine.enableOfflineSupport = false;
            this.engine.doNotHandleContextLost = true;

            resolve(this.engine);
        });
    }

    getFps() {
        return ~~this.engine.getFps();
    }
}

export const engine = new Engine();


export const PositionKind = BABYLON.VertexBuffer.PositionKind;
export const NormalKind = BABYLON.VertexBuffer.NormalKind;
export const UVKind = BABYLON.VertexBuffer.UVKind;
export const ColorKind = BABYLON.VertexBuffer.ColorKind;

export const DOUBLESIDE = BABYLON.Mesh.DOUBLESIDE;
export const BACKSIDE = BABYLON.Mesh.BACKSIDE;
export const FRONTSIDE = BABYLON.Mesh.FRONTSIDE;

export const AXIS_X = new BABYLON.Vector3(1, 0, 0);
export const AXIS_Y = new BABYLON.Vector3(0, 1, 0);
export const AXIS_Z = new BABYLON.Vector3(0, 0, 1);


export function Color3(r, g, b) {
    return new BABYLON.Color3(r, g, b);
}

export function Color4(r, g, b, a) {
    return new BABYLON.Color4(r, g, b, a);
}


export function Vector3(x = 0, y = 0, z = 0) {
    return new BABYLON.Vector3(x, y, z);
}

export function Vector3Distance(min, max) {
    return BABYLON.Vector3.Distance(min, max);
}

export function Vector3Minimize(left, right) {
    return BABYLON.Vector3.Minimize(left, right);
}

export function Vector3Maximize(left, right) {
    return BABYLON.Vector3.Maximize(left, right);
}

export function Vector3TransformCoordinates(p, m) {
    return BABYLON.Vector3.TransformCoordinates(p, m);
}

export function Vector3Project(target, scene, camera) {
    return BABYLON.Vector3.Project(
        target,
        BABYLON.Matrix.IdentityReadOnly,
        scene.getTransformMatrix(),
        camera.viewport.toGlobal(
            window.innerWidth,
            window.innerHeight));
}


export function MatrixIdentity() {
    return BABYLON.Matrix.Identity();
}

export function MatrixTranslation(x, y, z) {
    return BABYLON.Matrix.Translation(x, y, z);
}

export function MatrixScaling(x, y, z) {
    return BABYLON.Matrix.Scaling(x, y, z);
}


export function CreateBox(name, size, side, scene) {
    return BABYLON.MeshBuilder.CreateBox(name, { size: size, sideOrientation: side }, scene);
}

export function CreatePlane(name, size, side, scene) {
    return BABYLON.MeshBuilder.CreatePlane(name, { size: size, sideOrientation: side, updatable: false }, scene);
}

export function CreateDisc(name, radius, tessellation, side, scene) {
    return BABYLON.MeshBuilder.CreateDisc(name, { radius: radius, tessellation: tessellation, sideOrientation: side }, scene);
}

export function CreateSphere(name, diameter, segments, side, scene) {
    return BABYLON.MeshBuilder.CreateSphere(name, { diameter: diameter, segments: segments, sideOrientation: side }, scene);
}

export function CreateLine(name, lines, colors, scene) {
    return BABYLON.MeshBuilder.CreateLineSystem(name, { lines: lines, colors: colors, useVertexAlpha: true, updatable: false }, scene);
}


export function MergeMeshes(arr, disposeSource, allow32BitsIndices) {
    return BABYLON.Mesh.MergeMeshes(arr, disposeSource, allow32BitsIndices);
}

export function LoadAssetContainerAsync(url, dotExt, scene, onLoaded, onError) {
    BABYLON.SceneLoader.LoadAssetContainerAsync(url, '', scene, undefined, dotExt)
        .then(container => {
            onLoaded(container);
        }).catch((err) => {
            onError(err.message);
        });
}

export function ExportGLB(scene, filename, exportOptions, isDownload, onLoaded) {
    BABYLON.GLTF2Export.GLBAsync(scene, filename, exportOptions).then(data => {
        if (isDownload)
            data.downloadFiles();
        onLoaded(data);
    });
}

export function ExportGLTF(scene, filename, exportOptions, onLoaded) {
    BABYLON.GLTF2Export.GLTFAsync(scene, filename, exportOptions).then(data => {
        data.downloadFiles();
        onLoaded(data);
    });
}

export function ExportOBJ(meshes) {
    return BABYLON.OBJExport.OBJ(meshes, false, 'material', true);
}

export function ExportSTL(meshes, filename) {
    return BABYLON.STLExport.CreateSTL(meshes, true, filename, null, null, false, true, false);
}

const easingFunction = new BABYLON.CubicEase();
easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
export function Animator(target, property, from, to, callback = undefined, fps = 2, frames = 1) {
    BABYLON.Animation.CreateAndStartAnimation('animator',
        target, property, fps, frames, from, to, 
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
        easingFunction, callback);
}
