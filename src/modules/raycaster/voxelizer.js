/* 
    Sep 2024
    @nimadez

    Voxelizer
*/


import { rcv } from './raycaster.js';

import {
    Vector3,
    MatrixTranslation, MatrixScaling,
    MergeMeshes, LoadAssetContainerAsync
} from '../babylon.js';

import {
    scene, ui, builder, pool,
    clearScene,
    rgbIntToHex,
    COL_ICE
} from '../../main.js';


class Voxelizer {
    constructor() {}

    voxelizeMesh(mesh) {
        ui.showProgress(1);
        const scale = parseInt(ui.domVoxelizerScale.value);

        normalizeMesh(mesh, scale);

        const data = rcv.mesh_voxel(mesh, scale, COL_ICE);
        builder.setDataFromArray(data);
        clearScene();
        ui.showProgress(0);
    }

    async voxelizeBake() {
        if (pool.selected) {
            if (!await ui.showConfirm('clear and replace all voxels?')) return;
            ui.showProgress(1);
            ui.setMode(0);
            
            const data = rcv.mesh_bake(pool.selected);
            builder.setDataFromArray(data);
            builder.normalizeVoxelPositions();
            clearScene();
            ui.showProgress(0);
        } else {
            ui.notification('select a bake');
        }
    }

    voxelize2D(imgData) {
        ui.showProgress(1);
        const ratio = parseFloat(ui.domVoxelizerRatio.value);
        const yUp = ui.domVoxelizerYup.checked;

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
            let x,y,r,g,b;
            for (let i = 0; i < imageData.length; i += 4) {
                if (imageData[i + 3] > 0) {
                    r = imageData[i];
                    g = imageData[i + 1];
                    b = imageData[i + 2];
                    x = (i / 4) % c.width;
                    y = ~~(i / 4 / c.width);
                    if (yUp) {
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

            builder.setDataFromArray(data);
            builder.normalizeVoxelPositions();
            clearScene();
            ui.showProgress(0);
        }
    }

    importMeshOBJ(url) {
        LoadAssetContainerAsync(url, ".obj", scene, (container) => {
            const mesh = MergeMeshes(container.meshes, true, true);
            container.removeAllFromScene();
            this.voxelizeMesh(mesh);
            mesh.dispose();
        }, (err) => {
            ui.notification("unable to import/merge meshes");
            console.error(err);
        });
    }

    importMeshGLB(url) {
        LoadAssetContainerAsync(url, ".glb", scene, (container) => {
            const meshes = [];
            for (let i = 0; i < container.meshes.length; i++) {
                if (container.meshes[i].name !== '__root__')
                    meshes.push(container.meshes[i]);
            }
            if (meshes.length > 0) {
                const mesh = MergeMeshes(meshes, true, true);
                this.voxelizeMesh(mesh);
                mesh.dispose();
            } else {
                ui.notification('unable to find meshes');
            }
            container.removeAllFromScene();
        }, (err) => {
            ui.notification("unable to import/merge meshes");
            console.error(err);
        });
    }

    loadFromUrl(url) {
        if (url == "") return;
        fetch(url).then(res => {
            if (res.status == 200) {
                if (url.toLowerCase().includes('.obj') || url.endsWith('.obj')) {
                    this.importMeshOBJ(url);
                } else if (url.toLowerCase().includes('.glb') || url.endsWith('.glb')) {
                    this.importMeshGLB(url);
                } else {
                    ui.notification("unsupported file format");
                }
            } else {
                ui.notification("unable to read url");
            }
        }).catch(err => {
            ui.notification("unable to read url");
        });
    }

    loadFromUrlImage(url) {
        if (url == "") return;
        fetch(url).then(async res => {
            if (res.status == 200) {
                const data = await res.blob();
                if (data.type &&
                    (data.type == 'image/png'  ||
                     data.type == 'image/jpeg' ||
                     data.type == 'image/svg+xml')) {
                        this.voxelize2D(url);
                } else {
                    ui.notification("unsupported file format");
                }
            } else {
                ui.notification("unable to read url");
            }
        }).catch(err => {
            ui.notification("unable to read url");
        });
    }

    pasteBase64Image() {
        navigator.clipboard.readText()
            .then(url => {
                if (url.startsWith('data:image/')) {
                    this.voxelize2D(url);
                } else {
                    ui.notification('invalid base64 image');
                }
            })
            .catch(err => {
                ui.notification('failed to read clipboard data');
            });
    }
}

export const voxelizer = new Voxelizer();


function normalizeMesh(mesh, scale) {
    const bounds = mesh.getBoundingInfo();
    const size = Vector3(
        Math.abs(bounds.minimum.x - bounds.maximum.x),
        Math.abs(bounds.minimum.y - bounds.maximum.y),
        Math.abs(bounds.minimum.z - bounds.maximum.z)
    );

    const scaleFactor = Math.min(scale / size.x, scale / size.y, scale / size.z);
    const scaleMatrix = MatrixScaling(scaleFactor, scaleFactor, scaleFactor);

    const nX = (-bounds.maximum.x + (size.x / 2)) + (size.x / 2);
    const nY = ((size.y / 2) - bounds.boundingBox.center.y);
    const nZ = (-bounds.maximum.z + (size.z / 2)) + (size.z / 2);
    const transMatrix = MatrixTranslation(nX, nY, nZ);

    mesh.bakeTransformIntoVertices(transMatrix.multiply(scaleMatrix));
}

function aspectRatioFit(srcW, srcH, maxW, maxH) {
    const ratio = Math.min(maxW / srcW, maxH / srcH);
    return { width: srcW * ratio, height: srcH * ratio };
}
