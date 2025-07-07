/* 
    Sep 2024
    @nimadez

    Babylon.js module
*/


class Engine {
    constructor() {
        this.canvas = document.getElementById('canvas');

        this.engine = undefined;
        this.isRendering = false;
    }

    init(useWebGPU) {
        if (useWebGPU)
            return this.initWebGPU();

        return new Promise(resolve => {
            this.engine = new BABYLON.Engine(this.canvas, true, {});
            this.engine.disablePerformanceMonitorInBackground = true;
            this.engine.preserveDrawingBuffer = false;
            this.engine.premultipliedAlpha = false;
            this.engine.enableOfflineSupport = false;
            this.engine.doNotHandleContextLost = true;
            this.engine.maxFPS = 60;

            resolve(this.engine);
        });
    }

    initWebGPU() {
        return new Promise(async resolve => {
            this.engine = new BABYLON.WebGPUEngine(this.canvas);
            this.engine.disablePerformanceMonitorInBackground = true;
            this.engine.preserveDrawingBuffer = false;
            this.engine.premultipliedAlpha = true;
            this.engine.enableOfflineSupport = false;
            this.engine.doNotHandleContextLost = true;
            this.engine.maxFPS = 60;

            await this.engine.initAsync();

            resolve(this.engine);
        });
    }

    getFps() {
        return ~~this.engine.getFps();
    }
}

// Constants

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

export const ORTHOGRAPHIC_CAMERA = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
export const PERSPECTIVE_CAMERA = BABYLON.Camera.PERSPECTIVE_CAMERA;

export const REFRESHRATE_RENDER_ONCE = BABYLON.RenderTargetTexture.REFRESHRATE_RENDER_ONCE;
export const ShadowGenerator_QUALITY_LOW = BABYLON.ShadowGenerator.QUALITY_LOW;
export const ShadowGenerator_QUALITY_MEDIUM = BABYLON.ShadowGenerator.QUALITY_MEDIUM;
export const Texture_CUBIC_MODE = BABYLON.Texture.CUBIC_MODE;
export const Texture_SKYBOX_MODE = BABYLON.Texture.SKYBOX_MODE;
export const Texture_LINEAR_LINEAR_MIPLINEAR = BABYLON.Texture.LINEAR_LINEAR_MIPLINEAR;
export const Texture_NEAREST_SAMPLINGMODE = BABYLON.Texture.NEAREST_SAMPLINGMODE;
export const PBRMATERIAL_ALPHABLEND = BABYLON.PBRMaterial.PBRMATERIAL_ALPHABLEND;
export const EffectShadersStore = BABYLON.Effect.ShadersStore;
export const CounterClockWiseSideOrientation = BABYLON.Material.CounterClockWiseSideOrientation;

// Vector3

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

export function Vector3Dot(v1, v2) {
    return BABYLON.Vector3.Dot(v1, v2);
}

export function Vector3Cross(v1, v2) {
    return BABYLON.Vector3.Cross(v1, v2);
}

export function Vector3TransformCoordinates(p, m) {
    return BABYLON.Vector3.TransformCoordinates(p, m);
}

export function Vector3Project(target, scene, camera, width, height) {
    return BABYLON.Vector3.Project(
        target,
        BABYLON.Matrix.IdentityReadOnly,
        scene.getTransformMatrix(),
        camera.viewport.toGlobal(width, height));
}

// Colors

export function Color3(r, g, b) {
    return new BABYLON.Color3(r, g, b);
}

export function Color4(r, g, b, a) {
    return new BABYLON.Color4(r, g, b, a);
}

// Matrices and Quaternion

export function MatrixIdentity() {
    return BABYLON.Matrix.Identity();
}

export function MatrixTranslation(x, y, z) {
    return BABYLON.Matrix.Translation(x, y, z);
}

export function MatrixScaling(x, y, z) {
    return BABYLON.Matrix.Scaling(x, y, z);
}

export function QuaternionRotationAxis(axis, angle) {
    return BABYLON.Quaternion.RotationAxis(axis, angle);
}

// Scenes

export function CreateScene(engine) {
    return new BABYLON.Scene(engine);
}

export function UtilityLayerRenderer(scene) {
    return new BABYLON.UtilityLayerRenderer(scene);
}

// Cameras

export function ArcRotateCamera(name, distance, direction, scene) {
    return new BABYLON.ArcRotateCamera(name, 0, 0, distance, direction, scene);
}

export function Viewport(x, y, width, height) {
    return new BABYLON.Viewport(x, y, width, height);
}

// Lights

export function DirectionalLight(name, direction, scene) {
    return new BABYLON.DirectionalLight(name, direction, scene);
}

export function HemisphericLight(name, direction, scene) {
    return new BABYLON.HemisphericLight(name, direction, scene);
}

export function ShadowGenerator(texSize, source) {
    return new BABYLON.ShadowGenerator(texSize, source);
}

// Materials

export function StandardMaterial(name, scene) {
    return new BABYLON.StandardMaterial(name, scene);
}

export function PBRMaterial(name, scene) {
    return new BABYLON.PBRMaterial(name, scene);
}

export function ShaderMaterial(name, scene, shaders, options) {
    return new BABYLON.ShaderMaterial(name, scene, shaders, options);
}

export function ShadowOnlyMaterial(name, scene) {
    return new BABYLON.ShadowOnlyMaterial(name, scene);
}

export function NormalMaterial(name, scene) {
    return new BABYLON.NormalMaterial(name, scene);
}

export function GridMaterial(name, scene) {
    return new BABYLON.GridMaterial(name, scene);
}

// Textures

export function CreateTexture(url, scene, sampling) {
    return new BABYLON.Texture(url, scene, undefined, undefined, sampling);
}

export function HDRCubeTexture(url, scene, texSize, callback) {
    return new BABYLON.HDRCubeTexture(url, scene, texSize, false, false, false, undefined, callback);
}

export function RenderTargetTexture(name, width, height, scene) {
    return new BABYLON.RenderTargetTexture(name, {
            width: width,
            height: height,
            samplingMode: BABYLON.Constants.TEXTURE_NEAREST_NEAREST,
            type: BABYLON.Constants.TEXTURETYPE_UNSIGNED_INT,
            generateMipMaps: false,
            generateDepthBuffer: false,
            generateStencilBuffer: false,
            useSRGBBuffer: false
        }, scene);
}

// Nodes and Gizmos

export function TransformNode(name) {
    return new BABYLON.TransformNode(name);
}

export function PositionGizmo(utilLayer) {
    return new BABYLON.PositionGizmo(utilLayer);
}

export function AxisScaleGizmo(axis, color, utilLayer, scale) {
    return new BABYLON.AxisScaleGizmo(axis, color, utilLayer, undefined, scale);
}

export function PlaneRotationGizmo(axis, color, utilLayer) {
    return new BABYLON.PlaneRotationGizmo(axis, color, utilLayer);
}

export function AxesViewer(scene, scale, thickness) {
    return new BABYLON.AxesViewer(scene, scale, 0, null,null,null, thickness);
}

// Create meshes

export function CreateMesh(name, scene) {
    return new BABYLON.Mesh(name, scene);
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

// Create particles

export function PointsCloudSystem(name, size, scene, isUpdatable) {
    return new BABYLON.PointsCloudSystem(name, size, scene, { updatable: isUpdatable });
}

export function SolidParticleSystem(name, scene, isUpdatable, isExpandable, isBoundingSphereOnly) {
    return new BABYLON.SolidParticleSystem(name, scene, { updatable: isUpdatable, expandable: isExpandable, boundingSphereOnly: isBoundingSphereOnly });
}

// Mesh related functions

export function VertexData() {
    return new BABYLON.VertexData();
}

export function MergeMeshes(arr, disposeSource, allow32BitsIndices) {
    return BABYLON.Mesh.MergeMeshes(arr, disposeSource, allow32BitsIndices);
}

// Mesh IO

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

// Utilities

const easingFunction = new BABYLON.CubicEase();
easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
export function Animator(target, property, from, to, callback = undefined, fps = 60, totalFrame = 25) {
    BABYLON.Animation.CreateAndStartAnimation('animator',
        target, property, fps, totalFrame, from, to, 
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
        easingFunction, callback);
}

export function CreateScreenshot(engine, camera, width, height, callback) {
    BABYLON.ScreenshotTools.CreateScreenshot(engine, camera, { width: width, height: height }, (data) => {
        callback(data);
    });
}

export function CreateScreenshotWithResizeAsync(engine, camera, width, height, callback) {
    BABYLON.ScreenshotTools.CreateScreenshotWithResizeAsync(engine, camera, width, height).then(() => {
        callback();
    });
}
