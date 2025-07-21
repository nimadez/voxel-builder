/* 
    Jul 2025
    @nimadez

    Loaders
*/

import { GLTFLoader } from '../../libs/addons/GLTFLoader.js';
import { OBJLoader } from '../../libs/addons/OBJLoader.js';
import { STLLoader } from '../../libs/addons/STLLoader.js';
import { PLYLoader } from '../../libs/addons/PLYLoader.js';
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

                const mesh = translator.getMeshFromThree(geometries, scene);
                (mesh) ? resolve(mesh) : reject('Error: Bad Mesh Attributes');

                translator.dispose();
                for (const geom of geometries)
                    geom.dispose();

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

                const mesh = translator.getMeshFromThree(geometries, scene);
                (mesh) ? resolve(mesh) : reject('Error: Bad Mesh Attributes');

                translator.dispose();
                for (const geom of geometries)
                    geom.dispose();

            }, null, (err) => {
                reject(err);
            });
        });
    }

            
    loadSTL(url, scene) {
        return new Promise((resolve, reject) => {
            const geometries = [];

            new STLLoader().load(url, (geometry) => {
                geometries.push(geometry);

                const mesh = translator.getMeshFromThree(geometries, scene);
                (mesh) ? resolve(mesh) : reject('Error: Bad Mesh Attributes');

                translator.dispose();
                for (const geom of geometries)
                    geom.dispose();

            }, null, (err) => {
                reject(err);
            });
        });
    }

    loadPLY(url, scene) {
        return new Promise((resolve, reject) => {
            const geometries = [];

            new PLYLoader().load(url, (geometry) => {
                geometries.push(geometry);

                const mesh = translator.getMeshFromThree(geometries, scene);
                (mesh) ? resolve(mesh) : reject('Error: Bad Mesh Attributes');

                translator.dispose();
                for (const geom of geometries)
                    geom.dispose();

            }, null, (err) => {
                reject(err);
            });
        });
    }
}

export const loaders = new Loaders();
