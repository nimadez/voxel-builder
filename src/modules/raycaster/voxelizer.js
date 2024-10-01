/* 
    Sep 2024
    @nimadez

    Voxelizer
*/

import { rcv } from './raycaster.js';
import { Vector3, MergeMeshes, LoadAssetContainerAsync } from '../babylon.js';
import { ui, builder, pool, project } from '../core.js';
import { scene } from '../../main.js';


const COL_ICE = '#8398AF';


class Voxelizer {
    constructor() {}

    voxelizeMesh(mesh) {
        const scale = parseInt(ui.domVoxelizerScale.value);

        pool.normalizeMesh(mesh, scale);
        const data = rcv.mesh_voxel(mesh, COL_ICE);
        
        builder.createVoxelsFromArray(data);
        project.clearScene();
    }

    voxelizeBake(meshes) {
        const mesh = MergeMeshes(meshes, false, true);
        pool.resetPivot(mesh);

        const data = rcv.bake_voxel(mesh);
        mesh.dispose();

        builder.createVoxelsFromArray(data);
        project.clearScene();
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

            builder.createVoxelsFromArray(data);
            builder.normalizeVoxelPositions(false);
            project.clearScene();
            ui.showProgress(0);
        }
    }

    importBakedVoxels(url) {
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

    importMeshOBJ(url) {
        ui.showProgress(1);
        LoadAssetContainerAsync(url, ".obj", scene, (container) => {
            const mesh = MergeMeshes(container.meshes, true, true);
            container.removeAllFromScene();
            this.voxelizeMesh(mesh);
            mesh.dispose();
            ui.showProgress(0);
        }, (err) => {
            ui.notification("unable to import/merge meshes");
            ui.showProgress(0);
            console.error(err);
        });
    }

    importMeshGLB(url) {
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
                this.voxelizeMesh(mesh);
                mesh.dispose();
            } else {
                ui.notification('unable to find meshes');
            }
            ui.showProgress(0);
        }, (err) => {
            ui.notification("unable to import/merge meshes");
            ui.showProgress(0);
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


function rgbIntToHex(r, g, b) {
    return '#' + (0x1000000 + b | (g << 8) | (r << 16)).toString(16).slice(1).toUpperCase();
}

function aspectRatioFit(srcW, srcH, maxW, maxH) {
    const ratio = Math.min(maxW / srcW, maxH / srcH);
    return { width: srcW * ratio, height: srcH * ratio };
}
