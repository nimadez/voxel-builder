/* 
    Jul 2025
    @nimadez

    Three.js Exporters
*/


import { GLTFExporter } from '../../libs/addons/GLTFExporter.js';
import { OBJExporter } from '../../libs/addons/OBJExporter.js';
import { STLExporter } from '../../libs/addons/STLExporter.js';
import { PLYExporter } from '../../libs/addons/PLYExporter.js';
import { translator } from '../translator.js';


class Exporters {
    constructor() {}

    exportGLTF(isBinary, isSelected) {
        return new Promise((resolve, reject) => {
            (isSelected) ?
                translator.getMeshBakeSelected() :
                translator.getMeshesBake();

            new GLTFExporter().parse(translator.scene, (result) => {
                resolve(result);
                translator.dispose();
            }, (err) => {
                reject(err);
                translator.dispose();
            }, {
                binary: isBinary,
                trs: false,
                maxTextureSize: 4096,
                onlyVisible: false
            });
        });
    }

    exportVoxelsOBJ() {
        return new Promise(resolve => {
            translator.getMeshesVoxels();
            resolve(new OBJExporter().parse(translator.scene));
            translator.dispose();
        });
    }

    exportMeshesOBJ(isSelected) {
        return new Promise(resolve => {
            (isSelected) ?
                translator.getMeshBakeSelected() :
                translator.getMeshesBake();
            resolve(new OBJExporter().parse(translator.scene));
            translator.dispose();
        });
    }

    exportVoxelsSTL() {
        return new Promise(resolve => {
            translator.getMeshesVoxels();
            resolve(new STLExporter().parse(translator.scene));
            translator.dispose();
        });
    }

    exportMeshesSTL(isSelected) {
        return new Promise(resolve => {
            (isSelected) ?
                translator.getMeshBakeSelected() :
                translator.getMeshesBake();
            resolve(new STLExporter().parse(translator.scene));
            translator.dispose();
        });
    }

    exportVoxelsPLY() {
        return new Promise(resolve => {
            translator.getMeshesVoxels();
            resolve(new PLYExporter().parse(translator.scene));
            translator.dispose();
        });
    }

    exportMeshesPLY(isSelected) {
        return new Promise(resolve => {
            (isSelected) ?
                translator.getMeshBakeSelected() :
                translator.getMeshesBake();
            resolve(new PLYExporter().parse(translator.scene));
            translator.dispose();
        });
    }
}


export const exporters = new Exporters();
