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

export function PositionGizmo(utilLayer, thickness) {
    return new BABYLON.PositionGizmo(utilLayer, thickness);
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

// Mesh related functions

export function VertexData() {
    return new BABYLON.VertexData();
}

export function MergeMeshes(arr, disposeSource, allow32BitsIndices) {
    return BABYLON.Mesh.MergeMeshes(arr, disposeSource, allow32BitsIndices);
}

// Utilities

const easingFunction = new BABYLON.CubicEase();
easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);

export function AnimatorCamera(scene, camera, newRadius, newTarget, speedRatio = 1) {
    const totalFrames = 20;
    const storedAlpha = camera.alpha;
    const storedBeta = camera.beta;
    return new Promise(async resolve => {
        const anim_radius = new BABYLON.Animation(
            "anim_camera_radius", "radius", 60,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

        const anim_target = new BABYLON.Animation(
            "anim_camera_target", "target", 60,
            BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

        const anim_alpha = new BABYLON.Animation(
            "anim_camera_alpha", "alpha", 60,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

        const anim_beta = new BABYLON.Animation(
            "anim_camera_beta", "beta", 60,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

        const anim_keys_radius = [
            { frame: 0, value: camera.radius },
            { frame: totalFrames, value: newRadius }];

        const anim_keys_target = [
            { frame: 0, value: camera.target.clone() },
            { frame: totalFrames, value: newTarget }];

        const anim_keys_alpha = [
            { frame: 0, value: camera.alpha },
            { frame: totalFrames, value: storedAlpha }];

        const anim_keys_beta = [
            { frame: 0, value: camera.beta },
            { frame: totalFrames, value: storedBeta }];

        anim_radius.setKeys(anim_keys_radius);
        anim_target.setKeys(anim_keys_target);
        anim_alpha.setKeys(anim_keys_alpha);
        anim_beta.setKeys(anim_keys_beta);
        anim_radius.setEasingFunction(easingFunction);
        anim_target.setEasingFunction(easingFunction);
        anim_alpha.setEasingFunction(easingFunction);
        anim_beta.setEasingFunction(easingFunction);

        const anim = scene.beginDirectAnimation(camera,
            [ anim_radius, anim_target, anim_alpha, anim_beta ],
            0, totalFrames, false, speedRatio);

        await anim.waitAsync();
        resolve();
    });
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
