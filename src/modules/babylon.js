/* 
    Sep 2024
    @nimadez

    BABYLON

    After MATH was removed from the OpenGL,
    we all had to write our own matrices.
*/

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

export const VEC6_ONE = [
    new BABYLON.Vector3(1, 0, 0),
    new BABYLON.Vector3(-1, 0, 0),
    new BABYLON.Vector3(0, 1, 0),
    new BABYLON.Vector3(0, -1, 0),
    new BABYLON.Vector3(0, 0, 1),
    new BABYLON.Vector3(0, 0, -1)
];

export const VEC6_HALF = [
    new BABYLON.Vector3(0.5, 0, 0),
    new BABYLON.Vector3(-0.5, 0, 0),
    new BABYLON.Vector3(0, 0.5, 0),
    new BABYLON.Vector3(0, -0.5, 0),
    new BABYLON.Vector3(0, 0, 0.5),
    new BABYLON.Vector3(0, 0, -0.5)
];

export function Color3(r, g, b) {
    return new BABYLON.Color3(r, g, b);
}

export function Color4(r, g, b, a) {
    return new BABYLON.Color4(r, g, b, a);
}

export function Vector3(x, y, z) {
    return new BABYLON.Vector3(x, y, z);
}

export function Vector3Distance(min, max) {
    return BABYLON.Vector3.Distance(min, max);
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
            scene.getEngine().getRenderWidth(),
            scene.getEngine().getRenderHeight()));
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

export function MergeMeshes(arr, disposeSource, allow32BitsIndices) {
    return BABYLON.Mesh.MergeMeshes(arr, disposeSource, allow32BitsIndices);
}

export function LoadAssetContainerAsync(url, dotExt, scene, onLoad, onError) {
    BABYLON.SceneLoader.LoadAssetContainerAsync(url, "", scene, null, dotExt)
        .then((container) => {
            onLoad(container);
        }).catch((err) => {
            onError(err.message);
        });
}
