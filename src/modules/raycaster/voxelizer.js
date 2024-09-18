/* 
    Sep 2024
    @nimadez

    Voxelizer
*/

import { rcv } from './raycaster.js';

import {
    Vector3,
    MergeMeshes,
    LoadAssetContainerAsync
} from '../babylon.js';

import {
    scene, ui, builder, pool,
    clearScene, resetPivot, rgbIntToHex,
    COL_ICE
} from '../../main.js';


class Voxelizer {
    constructor() {}

    voxelizeMesh(mesh) {
        ui.showProgress(1);
        const scale = parseInt(ui.domVoxelizerScale.value);

        pool.normalizeMesh(mesh, scale);

        const data = rcv.mesh_voxel(mesh, COL_ICE);
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
            clearScene();
            ui.showProgress(0);
        } else {
            ui.notification('select a mesh');
        }
    }

    async voxelizeBakeAll() {
        if (pool.meshes.length > 0) {
            if (!await ui.showConfirm('clear and replace all voxels?')) return;
            ui.showProgress(1);
            ui.setMode(0);

            const mesh = MergeMeshes(pool.meshes, false, true);
            resetPivot(mesh);
            const data = rcv.mesh_bake(mesh);
            mesh.dispose();

            builder.setDataFromArray(data);
            clearScene();
            ui.showProgress(0);
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
            builder.normalizeVoxelPositions(false);
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
        if (url === '') return;
        fetch(url).then(res => {
            if (res.status === 200) {
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
        if (url === '') return;
        fetch(url).then(res => {
            if (res.status === 200) {
                res.blob().then(data => {
                    if (data.type &&
                        (data.type == 'image/png'  ||
                         data.type == 'image/jpeg' ||
                         data.type == 'image/svg+xml')) {
                            this.voxelize2D(url);
                    } else {
                        ui.notification("unsupported file format");
                    }
                });
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


function aspectRatioFit(srcW, srcH, maxW, maxH) {
    const ratio = Math.min(maxW / srcW, maxH / srcH);
    return { width: srcW * ratio, height: srcH * ratio };
}
