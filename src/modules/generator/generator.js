/* 
    Sep 2024
    @nimadez

    Generate voxels
*/

import { SimplexNoise } from '../../libs/addons/SimplexNoise.js';
import { Vector3 } from '../babylon.js';
import { ui, builder, xformer, project } from '../core.js';


const COL_ICE = '#8398AF';


class Generator {
    constructor() {}

    newBox(size, color) {
        builder.voxels = [];
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                for (let z = 0; z < size; z++) {
                    builder.add(Vector3(x, y, z), color, true);
                }
            }
        }
    }

    async createBox(isPlane = false) {
        const isNewScene = document.getElementById('create_grid_new').checked;
        if (isNewScene && !await ui.showConfirm('clear and replace all voxels?')) return;
        
        const isFill = document.getElementById('create_grid_fill').checked;
        const X = parseInt(document.getElementById('create_grid_x').value);
        const Y = (isPlane) ? 1 : parseInt(document.getElementById('create_grid_y').value);
        const Z = parseInt(document.getElementById('create_grid_z').value);
        
        const data = [];
        if (isFill) {
            for (let x = 0; x < X; x++) {
                for (let y = 0; y < Y; y++) {
                    for (let z = 0; z < Z; z++) {
                        data.push({
                            position: Vector3(x, y, z),
                            color: COL_ICE,
                            visible: true
                        });
                    }
                }
            }
        } else {
            for (let x = 0; x < X; x++) {
                for (let y = 0; y < Y; y++) {
                    for (let z = 0; z < Z; z++) {
                        if (x == 0 || y == 0 || z == 0 ||
                            x == X-1 || y == Y-1 || z == Z-1) {
                            data.push({
                                position: Vector3(x, y, z),
                                color: COL_ICE,
                                visible: true
                            });
                        }
                    }
                }
            }
        }

        if (isNewScene) {
            builder.createVoxelsFromArray(data);
            project.clearSceneAndReset();
        } else {
            xformer.beginNewObject(data);
        }
    }

    async createIsometric() {
        const isNewScene = document.getElementById('create_grid_new').checked;
        if (isNewScene && !await ui.showConfirm('clear and replace all voxels?')) return;
        const X = parseInt(document.getElementById('create_grid_x').value);
        const Y = parseInt(document.getElementById('create_grid_y').value);
        const Z = parseInt(document.getElementById('create_grid_z').value);

        const data = [];
        for (let x = 0; x < X; x++) {
            for (let y = 0; y < Y; y++) {
                for (let z = 0; z < Z; z++) {
                    if (x == 0 || y == 0 || z == 0)
                        data.push({
                            position: Vector3(x, y, z),
                            color: COL_ICE,
                            visible: true
                        });
                }
            }
        }

        if (isNewScene) {
            builder.createVoxelsFromArray(data);
            project.clearSceneAndReset();
        } else {
            xformer.beginNewObject(data);
        }
    }

    async createSphere() {
        const isNewScene = document.getElementById('create_sphere_new').checked;
        if (isNewScene && !await ui.showConfirm('clear and replace all voxels?')) return;

        const outer = parseInt(document.getElementById('create_sphere_outer').value);
        let inner = parseInt(document.getElementById('create_sphere_inner').value);
        if (inner >= outer) {
            inner = outer - 1;
            document.getElementById('create_sphere_inner').value = inner;
        }
        inner -= 1;

        const rrmax = outer * outer;
        const rrmin = inner * inner;
        const center = outer - 1;
        const data = [];

        function isSurface(x, y, z) {
            const dx = 2*x - center;
            const dy = 2*y - center;
            const dz = 2*z - center;
            const rr = dx*dx + dy*dy + dz*dz;
            return (rrmin <= rr) && (rr <= rrmax);
        }

        for (let z = 0; z < outer; z++) {
            for (let y = 0; y < outer; y++) {
                for (let x = 0; x < outer; x++) {
                    if (isSurface(x, y, z)) {
                        data.push({
                            position: Vector3(x, y, z),
                            color: COL_ICE,
                            visible: true
                        });
                    }
                }
            }
        }
        
        if (isNewScene) {
            builder.createVoxelsFromArray(data);
            project.clearSceneAndReset();
        } else {
            xformer.beginNewObject(data);
        }
    }

    async createTerrain() {
        const isNewScene = document.getElementById('create_terrain_new').checked;
        if (isNewScene && !await ui.showConfirm('clear and replace all voxels?')) return;
        const isHeightGrad = document.getElementById('create_terrain_grad').checked;
        const X = parseInt(document.getElementById('create_terrain_x').value);
        const Y = parseInt(document.getElementById('create_terrain_y').value);
        const Z = parseInt(document.getElementById('create_terrain_z').value);

        const simplex = new SimplexNoise();
        const colArrayHigh = gradientHexArray('#87BC24', '#31A531', Y);
        const colArrayLow  = gradientHexArray('#217EC4', '#31A531', Y);

        const data = [];
        const scaleFactor = 0.17;
        let xoff = 0;
        let zoff = 0;
        let h = 0;
        for (let x = 0; x < X; x++) {
            for (let z = 0; z < Z; z++) {
                xoff = scaleFactor * x / Y;
                zoff = scaleFactor * z / Y;
                h = ~~(simplex.noise3d(xoff, 0, zoff) * Y);
                if (h >= 0) {
                    data.push({
                        position: Vector3(x, h, z),
                        color: (isHeightGrad) ? colArrayHigh[h] : COL_ICE,
                        visible: true
                    });
                } else {
                    data.push({
                        position: Vector3(x, h, z),
                        color: (isHeightGrad) ? colArrayLow[ Math.abs(h) ] : COL_ICE,
                        visible: true
                    });
                }
            }
        }

        if (isNewScene) {
            builder.createVoxelsFromArray(data);
            project.clearSceneAndReset();
        } else {
            xformer.beginNewObject(data, (isHeightGrad) ? true : false);
        }
    }
}

export const generator = new Generator();


function gradientHexArray(hexStart, hexEnd, count) {
    const start = hexToRgbFloat(hexStart, 2.2);
    const end = hexToRgbFloat(hexEnd, 2.2);
    const arr = [];
    let a = 0;
    for (let i = 0; i < count; i++) {
        a += (1 / count);
        arr.push(rgbFloatToHex(
            start.r * a + (1 - a) * end.r,
            start.g * a + (1 - a) * end.g,
            start.b * a + (1 - a) * end.b
        ));
    }
    return arr;
}

function hexToRgbFloat(hex, gamma = 2.2) {
    return {
        r: (parseInt(hex.substring(1, 3), 16) / 255) ** gamma,
        g: (parseInt(hex.substring(3, 5), 16) / 255) ** gamma,
        b: (parseInt(hex.substring(5, 7), 16) / 255) ** gamma
    }
}

function rgbFloatToHex(r, g, b) {
    [r, g, b] = [r, g, b].map(x => Math.round(x * 255));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
}
