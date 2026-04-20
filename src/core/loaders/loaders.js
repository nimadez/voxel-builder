/* 
    Jul 2025
    @nimadez

    Loaders
*/


import { translator } from '../translator.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { VOXLoader } from 'three/examples/jsm/loaders/VOXLoader.js';


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

    loadRGBE(url) {
        return new Promise(resolve => {
            new HDRLoader().load(url, resolve);
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
}


export const loaders = new Loaders();
