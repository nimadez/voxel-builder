/* 
    Nov 2023
    @nimadez

    Voxelizer
*/


import { Vector3 } from "../babylon.js";
import { builder, pool, project, ui, preferences } from "../core.js";
import { loaders } from "../loaders/loaders.js";
import { rcv } from './raycaster.js';


class Voxelizer {
    constructor() {}

    voxelizeMesh(mesh) {
        const scale = parseInt(ui.domVoxelizerScale.value);

        pool.normalizeMesh(mesh, scale);
        builder.createXform(rcv.voxelizeMesh(mesh, preferences.getRenderShadeColor()));
    }

    voxelizeBake(mesh) {
        pool.resetPivot(mesh);

        const data = rcv.voxelizeBake(mesh);
        mesh.dispose();

        let isValidGLB = 0;
        for (const v in data)
            if (data[v].color == '#000NAN')
                isValidGLB++;

        if (data.length > 0 && isValidGLB !== data.length) {
            builder.createVoxelsFromArray(builder.normalizePositionsBounds(data));
            project.resetSceneSetup();
        } else {
            ui.errorMessage('invalid glb (not baked)');
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

            builder.createXform(builder.normalizePositionsBounds(data));
            ui.showProgress(0);
        }
    }

    voxelize2DText() {
        const font = ui.domVoxelizerTextFont.value;
        const text = ui.domVoxelizerText.value;
        const extrude = parseInt(ui.domVoxelizerTextExtrude.value);
        const vertical = ui.domVoxelizerTextVertical.checked;
        const emoji = ui.domVoxelizerTextEmoji.checked;
        const color = preferences.getRenderShadeColor();

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

        builder.createXform(builder.normalizePositionsBounds(data.concat(arr)));
        ui.showProgress(0);
    }

    importBakedVoxels(url, scene) {
        ui.showProgress(1);
        loaders.loadGLB(url, scene).then(mesh => {
            this.voxelizeBake(mesh);
            mesh.dispose();
            ui.showProgress(0);
        }).catch(err => {
            ui.errorMessage('unable to load mesh');
            ui.showProgress(0);
            console.error(err);
        });
    }

    importMeshGLB(url, scene) {
        ui.showProgress(1);
        loaders.loadGLB(url, scene).then(mesh => {
            this.voxelizeMesh(mesh);
            mesh.dispose();
            ui.showProgress(0);
        }).catch(err => {
            ui.errorMessage('unable to load mesh');
            ui.showProgress(0);
            console.error(err);
        });
    }

    importMeshOBJ(url, scene) {
        ui.showProgress(1);
        loaders.loadOBJ(url, scene).then(mesh => {
            this.voxelizeMesh(mesh);
            mesh.dispose();
            ui.showProgress(0);
        }).catch(err => {
            ui.errorMessage('unable to load mesh');
            ui.showProgress(0);
            console.error(err);
        });
    }

    importMeshSTL(url, scene) {
        ui.showProgress(1);
        loaders.loadSTL(url, scene).then(mesh => {
            this.voxelizeMesh(mesh);
            mesh.dispose();
            ui.showProgress(0);
        }).catch(err => {
            ui.errorMessage('unable to load geometry');
            ui.showProgress(0);
            console.error(err);
        });
    }

    importMeshPLY(url, scene) {
        ui.showProgress(1);
        let m = undefined;
        loaders.loadPLY(url, scene).then(mesh => {
            m = mesh;
            this.voxelizeMesh(mesh);
            mesh.dispose();
            m.dispose();
            m = null;
            ui.showProgress(0);
        }).catch(err => {
            if (m && err instanceof RangeError)
                m.dispose();
            m = null;
            ui.errorMessage('unable to load geometry');
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
