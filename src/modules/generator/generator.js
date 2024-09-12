/* 
    Sep 2024
    @nimadez

    Generate voxels
*/

import { SimplexNoise } from '../../libs/addons/SimplexNoise.js';

import { Vector3 } from '../babylon.js';

import {
    ui, builder, xformer,
    clearScene, hexToRgbFloat, rgbFloatToHex,
    COL_ICE
} from '../../main.js';


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

    newBoxPosition(ev, elem, currentColor) {
        if (ev.key == 'Enter') {
            const str = elem.value.split(',');
            if (str.length == 3 && parseInt(str[0]) !== NaN && parseInt(str[1]) !== NaN && parseInt(str[2]) !== NaN) {
                builder.add(Vector3(parseInt(str[0]), parseInt(str[1]), parseInt(str[2])), currentColor, true);
                builder.create();
                builder.update();
            } else {
                ui.notification("invalid coord (e.g. 20,20,20)");
            }
        }
    }

    async createBox(isPlane = false) {
        const isNewScene = document.getElementById('input-grid-new').checked;
        if (isNewScene && !await ui.showConfirm('clear and replace all voxels?')) return;
        
        const isFill = document.getElementById('input-grid-fill').checked;
        const X = parseInt(document.getElementById('input-grid-x').value);
        const Y = (isPlane) ? 1 : parseInt(document.getElementById('input-grid-y').value);
        const Z = parseInt(document.getElementById('input-grid-z').value);
        
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
            builder.setDataFromArray(data);
            clearScene();
        } else {
            xformer.beginNewObject(data);
        }
    }

    async createIsometric() {
        const isNewScene = document.getElementById('input-grid-new').checked;
        if (isNewScene && !await ui.showConfirm('clear and replace all voxels?')) return;
        const X = parseInt(document.getElementById('input-grid-x').value);
        const Y = parseInt(document.getElementById('input-grid-y').value);
        const Z = parseInt(document.getElementById('input-grid-z').value);

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
            builder.setDataFromArray(data);
            clearScene();
        } else {
            xformer.beginNewObject(data);
        }
    }

    async createSphere() {
        const isNewScene = document.getElementById('input-sphere-new').checked;
        if (isNewScene && !await ui.showConfirm('clear and replace all voxels?')) return;

        const size = parseInt(document.getElementById('input-sphere-size').value);
        let inner = parseInt(document.getElementById('input-sphere-inner').value);
        if (inner >= size) {
            inner = size - 1;
            document.getElementById('input-sphere-inner').value = inner;
        }
        inner -= 1;

        const rrmax = size * size;
        const rrmin = inner * inner;
        const center = size - 1;
        const data = [];

        function isSurface(x, y, z) {
            const dx = 2*x - center;
            const dy = 2*y - center;
            const dz = 2*z - center;
            const rr = dx*dx + dy*dy + dz*dz;
            return (rrmin <= rr) && (rr <= rrmax);
        }

        for (let z = 0; z < size; z++) {
            for (let y = 0; y < size; y++) {
                for (let x = 0; x < size; x++) {
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
            builder.setDataFromArray(data);
            clearScene();
        } else {
            xformer.beginNewObject(data);
        }
    }

    async createTerrain() {
        const isNewScene = document.getElementById('input-terrain-new').checked;
        if (isNewScene && !await ui.showConfirm('clear and replace all voxels?')) return;
        const isHeightGrad = document.getElementById('input-terrain-grad').checked;
        const X = parseInt(document.getElementById('input-terrain-x').value);
        const Y = parseInt(document.getElementById('input-terrain-y').value);
        const Z = parseInt(document.getElementById('input-terrain-z').value);

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
            builder.setDataFromArray(data);
            clearScene();
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
