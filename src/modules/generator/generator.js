/* 
    Sep 2024
    @nimadez

    Generate voxels
*/


import { SimplexNoise } from '../../libs/addons/SimplexNoise.js';
import { Vector3 } from '../babylon.js';
import { builder, tool, preferences } from '../core.js';


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

    createBox(isPlane = false) {
        const X = parseInt(document.getElementById('create_grid_x').value);
        const Y = (isPlane) ? 1 : parseInt(document.getElementById('create_grid_y').value);
        const Z = parseInt(document.getElementById('create_grid_z').value);
        const isFill = document.getElementById('create_grid_fill').checked;
        const color = preferences.getRenderShadeColor();
        
        const data = [];
        if (isFill) {
            for (let x = 0; x < X; x++) {
                for (let y = 0; y < Y; y++) {
                    for (let z = 0; z < Z; z++) {
                        data.push({
                            position: Vector3(x, y, z),
                            color: color,
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
                                color: color,
                                visible: true
                            });
                        }
                    }
                }
            }
        }

        builder.createXform(data);
    }

    createIsometric() {
        const X = parseInt(document.getElementById('create_grid_x').value);
        const Y = parseInt(document.getElementById('create_grid_y').value);
        const Z = parseInt(document.getElementById('create_grid_z').value);
        const color = preferences.getRenderShadeColor();

        const data = [];
        for (let x = 0; x < X; x++) {
            for (let y = 0; y < Y; y++) {
                for (let z = 0; z < Z; z++) {
                    if (x == 0 || y == 0 || z == 0)
                        data.push({
                            position: Vector3(x, y, z),
                            color: color,
                            visible: true
                        });
                }
            }
        }

        builder.createXform(data);
    }

    createSphere() {
        const useInnerColor = document.getElementById('create_sphere_inner_color').checked;
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

        const color = preferences.getRenderShadeColor();

        function isSurface(x, y, z) {
            const dx = 2*x - center;
            const dy = 2*y - center;
            const dz = 2*z - center;
            const rr = dx*dx + dy*dy + dz*dz;
            return (rrmin <= rr) && (rr <= rrmax);
        }

        function isCore(x, y, z) {
            const dx = 2*x - center;
            const dy = 2*y - center;
            const dz = 2*z - center;
            const rr = dx*dx + dy*dy + dz*dz;
            return (rrmin >= rr) && (rr <= rrmax);
        }

        for (let z = 0; z < outer; z++) {
            for (let y = 0; y < outer; y++) {
                for (let x = 0; x < outer; x++) {
                    if (isSurface(x, y, z)) {
                        data.push({
                            position: Vector3(x, y, z),
                            color: color,
                            visible: true
                        });
                    }
                    if (useInnerColor && isCore(x, y, z)) {
                        data.push({
                            position: Vector3(x, y, z),
                            color: tool.currentColor,
                            visible: true
                        });
                    }
                }
            }
        }
        
        builder.createXform(data);
    }

    createTerrain() {
        const X = parseInt(document.getElementById('create_terrain_x').value);
        const Y = parseInt(document.getElementById('create_terrain_y').value);
        const Z = parseInt(document.getElementById('create_terrain_z').value);
        const isHeightGrad = document.getElementById('create_terrain_grad').checked;
        const color = preferences.getRenderShadeColor();
        
        const simplex = new SimplexNoise();
        const colArrayHigh = gradientHexArray(
            { r: 0.529, g: 0.737, b: 0.141 },
            { r: 0.192, g: 0.647, b: 0.192 }, Y);
        const colArrayLow  = gradientHexArray(
            { r: 0.129, g: 0.494, b: 0.769 },
            { r: 0.192, g: 0.647, b: 0.192 }, Y);

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
                        color: (isHeightGrad) ? colArrayHigh[h] : color,
                        visible: true
                    });
                } else {
                    data.push({
                        position: Vector3(x, h, z),
                        color: (isHeightGrad) ? colArrayLow[ Math.abs(h) ] : color,
                        visible: true
                    });
                }
            }
        }

        builder.createXform(data);
    }
}


export const generator = new Generator();


function gradientHexArray(start, end, count) {
    const arr = [];
    let a = 0;
    for (let i = 0; i < count; i++) {
        a += (1 / count);
        arr.push(rgbFloatToHex(
            start.r * a + (1 - a) * end.r,
            start.g * a + (1 - a) * end.g,
            start.b * a + (1 - a) * end.b,
            2.2
        ));
    }
    return arr;
}

function rgbFloatToHex(r, g, b, gamma) {
    [r, g, b] = [r, g, b].map(x => Math.round(x ** gamma * 255));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
}
