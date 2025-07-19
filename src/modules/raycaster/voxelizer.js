/* 
    Nov 2023
    @nimadez

    Voxelizer
*/

import { Vector3, MergeMeshes, LoadAssetContainerAsync } from "../babylon.js";
import { builder, pool, xformer, project, ui, preferences } from "../core.js";
import { rcv } from './raycaster.js';


class Voxelizer {
    constructor() {}

    voxelizeMesh(mesh, scale) {
        scale = parseInt(scale);

        pool.normalizeMesh(mesh, scale);
        const data = rcv.mesh_voxel(mesh, preferences.getRenderShadeColor());
        
        builder.createVoxelsFromArray(data);
        project.resetSceneSetup();
    }

    voxelizeBake(meshes) {
        const mesh = MergeMeshes(meshes, true, true);
        pool.resetPivot(mesh);

        const data = rcv.bake_voxel(mesh);
        mesh.dispose();

        let isValidGLB = 0;
        for (const v in data)
            if (data[v].color == '#000NAN')
                isValidGLB++;

        if (data.length == 0 || isValidGLB == data.length) {
            ui.errorMessage('Invalid GLB (not baked)');
        } else {
            builder.createVoxelsFromArray(data);
            builder.normalizeVoxelPositions();
            project.resetSceneSetup();
        }
    }

    voxelize2D(imgData) {
        ui.showProgress(1);
        const ratio = parseFloat(ui.domVoxelizerRatio.value);
        const vertical = ui.domVoxelizerVertical.checked;

        const img = new Image();
        img.src = imgData;
        img.crossOrigin = "Anonymous";
        img.onload = () => {
            const c = document.createElement('canvas');
            const cx = c.getContext('2d');
            const dim = aspectRatioFit(img.width, img.height, 10*ratio, 10*ratio);
            c.width = dim.width;
            c.height = dim.height;
            cx.msImageSmoothingEnabled = false;
            cx.mozImageSmoothingEnabled = false;
            cx.webkitImageSmoothingEnabled = false;
            cx.imageSmoothingEnabled = false;
            
            cx.drawImage(img, 0, 0, c.width, c.height);

            const data = [];
            const imageData = cx.getImageData(0, 0, c.width, c.height).data;
            let x, y, r, g, b;
            for (let i = 0; i < imageData.length; i += 4) {
                if (imageData[i + 3] > 0) {
                    r = imageData[i];
                    g = imageData[i + 1];
                    b = imageData[i + 2];
                    x = (i / 4) % c.width;
                    y = ~~(i / 4 / c.width);
                    if (vertical) {
                        data.push({
                            position: Vector3(x, dim.height-y-1, 0).floor(),
                            color: rgbIntToHex(r, g, b),
                            visible: true
                        });
                    } else {
                        data.push({
                            position: Vector3(x, 0, y).floor(),
                            color: rgbIntToHex(r, g, b),
                            visible: true
                        });
                    }
                }
            }

            builder.createVoxelsFromArray(data);
            builder.normalizeVoxelPositions();
            project.resetSceneSetup();
            ui.showProgress(0);
        }
    }

    async voxelize2DText() {
        const color = preferences.getRenderShadeColor();
        const font = ui.domVoxelizerTextFont.value;
        const text = ui.domVoxelizerText.value;
        const extrude = parseInt(ui.domVoxelizerTextExtrude.value);
        const vertical = ui.domVoxelizerTextVertical.checked;
        const emoji = ui.domVoxelizerTextEmoji.checked;
        if (text == '') {
            ui.notification("undefined text", 1000);
            return;
        }
        if (font == '' || font.endsWith(' ') || font.split(' ').length !== 2 || !font.split(' ')[0].endsWith('px')) {
            ui.notification("incorrect font", 1000);
            return;
        }
        ui.showProgress(1);

        const c = document.createElement("canvas");
        const cx = c.getContext("2d");
        c.width = 4096;
        c.height = 2028;
        cx.msImageSmoothingEnabled = false;
        cx.mozImageSmoothingEnabled = false;
        cx.webkitImageSmoothingEnabled = false;
        cx.imageSmoothingEnabled = false;

        cx.font = font;
        cx.textAlign = "center";
        cx.textBaseline = "middle";
        cx.fillStyle = "white";
        cx.fillText(text, c.width / 2, c.height / 2);

        const data = [];
        const imageData = cx.getImageData(0, 0, c.width, c.height).data;
        let x, y, r, g, b;
        for (let i = 0; i < imageData.length; i += 4) {
            if (imageData[i + 3] > 0) {
                r = imageData[i];
                g = imageData[i + 1];
                b = imageData[i + 2];
                x = (i / 4) % c.width;
                y = ~~(i / 4 / c.width);
                if (vertical) {
                    data.push({
                        position: Vector3(x, c.height-y-1, 0).floor(),
                        color: emoji ? rgbIntToHex(r, g, b) : color,
                        visible: true
                    });
                } else {
                    data.push({
                        position: Vector3(x, 0, y).floor(),
                        color: emoji ? rgbIntToHex(r, g, b) : color,
                        visible: true
                    });
                }
            }
        }

        const arr = [];
        for (let i = 0; i < data.length; i++) {
            for (let x = 1; x < extrude; x++) {
                arr.push({
                    position: Vector3(
                        data[i].position.x,
                        vertical ? data[i].position.y : data[i].position.y + x,
                        vertical ? data[i].position.z + x : data[i].position.z
                    ),
                    color: data[i].color,
                    visible: true
                });
            }
        }

        ui.showProgress(0);

        const voxels = builder.normalizeVoxelPositionsArray(data.concat(arr));

        if (ui.domVoxelizerTextNewScene.checked) {
            if (await ui.showConfirm('clear and replace all voxels?')) {
                builder.createVoxelsFromArray(voxels);
                project.resetSceneSetup();
            }
        } else {
            xformer.beginNew(voxels);
        }
    }

    importBakedVoxels(url, scene) {
        ui.showProgress(1);
        LoadAssetContainerAsync(url, '.glb', scene, (container) => {
            const meshes = [];
            for (let i = 0; i < container.meshes.length; i++) {
                if (container.meshes[i].name !== '__root__')
                    meshes.push(container.meshes[i].clone(container.meshes[i].name));
            }
            container.removeAllFromScene();
            if (meshes.length > 0) {
                this.voxelizeBake(meshes);
            } else {
                ui.errorMessage('unable to load baked meshes');
            }
            ui.showProgress(0);
        }, () => {
            ui.errorMessage('unable to load baked meshes');
            ui.showProgress(0);
        });
    }

    importMeshOBJ(url, scene) {
        ui.showProgress(1);
        LoadAssetContainerAsync(url, ".obj", scene, (container) => {
            const mesh = MergeMeshes(container.meshes, true, true);
            container.removeAllFromScene();
            this.voxelizeMesh(mesh, ui.domVoxelizerScale.value);
            mesh.dispose();
            ui.showProgress(0);
        }, (err) => {
            ui.errorMessage("unable to import/merge meshes");
            ui.showProgress(0);
            console.error(err);
        });
    }

    importMeshGLB(url, scene) {
        ui.showProgress(1);
        LoadAssetContainerAsync(url, ".glb", scene, (container) => {
            const meshes = [];
            for (let i = 0; i < container.meshes.length; i++) {
                if (container.meshes[i].name !== '__root__')
                    meshes.push(container.meshes[i]);
            }
            container.removeAllFromScene();
            if (meshes.length > 0) {
                const mesh = MergeMeshes(meshes, true, true);
                this.voxelizeMesh(mesh, ui.domVoxelizerScale.value);
                mesh.dispose();
            } else {
                ui.errorMessage('unable to find meshes');
            }
            ui.showProgress(0);
        }, (err) => {
            ui.errorMessage("unable to import/merge meshes");
            ui.showProgress(0);
            console.error(err);
        });
    }
}

export const voxelizer = new Voxelizer();


function rgbIntToHex(r, g, b) {
    return '#' + (0x1000000 + b | (g << 8) | (r << 16)).toString(16).slice(1).toUpperCase();
}

function aspectRatioFit(srcW, srcH, maxW, maxH) {
    const ratio = Math.min(maxW / srcW, maxH / srcH);
    return { width: srcW * ratio, height: srcH * ratio };
}
