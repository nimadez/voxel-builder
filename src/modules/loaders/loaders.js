/* 
    Jul 2025
    @nimadez

    Loaders
*/

import { GLTFLoader } from '../../libs/addons/GLTFLoader.js';
import { OBJLoader } from '../../libs/addons/OBJLoader.js';
import { STLLoader } from '../../libs/addons/STLLoader.js';
import { PLYLoader } from '../../libs/addons/PLYLoader.js';
import { VOXLoader } from '../../libs/addons/VOXLoader.js';
import { HDRLoader } from '../../libs/addons/HDRLoader.js';
import { translator } from '../translator.js';


class Loaders {
    constructor() {}

    loadGLB(url, scene) {
        return new Promise((resolve, reject) => {
            const geometries = [];

            new GLTFLoader().load(url, (gltf) => {
                gltf.scene.traverse(child => {
                    if (child.isMesh) {
                        child.geometry.applyMatrix4(child.matrixWorld);
                        geometries.push(child.geometry);
                    }
                });

                if (geometries.length > 0) {

                    const mesh = translator.getMeshFromThree(geometries, scene);
                    (mesh) ? resolve(mesh) : reject('Error: Bad Geometry Attributes');

                    for (const geom of geometries)
                        geom.dispose();

                } else {
                    reject('Error: No Geometries');
                }

                translator.dispose();

            }, null, (err) => {
                reject(err);
            });
        });
    }

    loadOBJ(url, scene) {
        return new Promise((resolve, reject) => {
            const geometries = [];

            new OBJLoader().load(url, (obj) => {
                obj.traverse((child) => {
                    if (child.isMesh) {
                        child.geometry.applyMatrix4(child.matrixWorld);
                        geometries.push(child.geometry);
                    }
                });

                if (geometries.length > 0) {
                    
                    const mesh = translator.getMeshFromThree(geometries, scene);
                    (mesh) ? resolve(mesh) : reject('Error: Bad Geometry Attributes');

                    for (const geom of geometries)
                        geom.dispose();
                    
                } else {
                    reject('Error: No Geometries');
                }

                translator.dispose();

            }, null, (err) => {
                reject(err);
            });
        });
    }

            
    loadSTL(url, scene) {
        return new Promise((resolve, reject) => {
            new STLLoader().load(url, (geometry) => {

                const mesh = translator.getMeshFromThree([ geometry ], scene);
                (mesh) ? resolve(mesh) : reject('Error: Bad Geometry Attributes');

                translator.dispose();

            }, null, (err) => {
                reject(err);
            });
        });
    }

    loadPLY(url, scene) {
        return new Promise((resolve, reject) => {
            new PLYLoader().load(url, (geometry) => {
                
                const mesh = translator.getMeshFromThree([ geometry ], scene);
                (mesh) ? resolve(mesh) : reject('Error: Bad Geometry Attributes');

                translator.dispose();

            }, null, (err) => {
                reject(err);
            });
        });
    }

    loadVOX(url) {
        return new Promise((resolve, reject) => {
            new VOXLoader().load(url, (proxy) => {
                resolve({
                    chunks: proxy.chunks,
                    scene: proxy.scene
                });
            }, null, (err) => {
                reject(err);
            });
        });
    }

    loadRGBE(url) {
        return new Promise(resolve => {
            new HDRLoader().load(url, resolve);
        });
    }
}

export const loaders = new Loaders();
