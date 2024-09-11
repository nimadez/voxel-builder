/* 
    Dec 2023
    @nimadez

    Web worker processor
*/

import { parseMagicaVoxel } from '../loaders/magicavoxel.js';


let arr = [];


onmessage = (ev) => {
    switch (ev.data.id) {

        case 'init':
            console.log('worker initialized.');
            break;

        case 'findInnerVoxels':
            arr = [];
            const idx = [];
            for (let i = 0; i < ev.data.data[0].length; i++) {
                const pos = ev.data.data[0][i].position;
                idx[0] = ev.data.data[1][`${pos._x + 1}_${pos._y}_${pos._z}`];
                idx[1] = ev.data.data[1][`${pos._x - 1}_${pos._y}_${pos._z}`];
                idx[2] = ev.data.data[1][`${pos._x}_${pos._y + 1}_${pos._z}`];
                idx[3] = ev.data.data[1][`${pos._x}_${pos._y - 1}_${pos._z}`];
                idx[4] = ev.data.data[1][`${pos._x}_${pos._y}_${pos._z + 1}`];
                idx[5] = ev.data.data[1][`${pos._x}_${pos._y}_${pos._z - 1}`];
                if (idx[0] > -1 && idx[1] > -1 && idx[2] > -1 && idx[3] > -1 && idx[4] > -1 && idx[5] > -1)
                    continue;
                else
                    arr.push(ev.data.data[0][i]);
            }
            postMessage(arr);
            arr = [];
            break;

        case 'parseMagicaVoxel':
            const chunks = parseMagicaVoxel(ev.data.data);
            if (!chunks) {
                throw new TypeError("Parse MagicaVoxel, chunk not found.");
            }
            arr = [];
            for (let i = 0; i < chunks[0].data.length; i+=4) {
                const x = chunks[0].data[ i + 0 ];
                const y = chunks[0].data[ i + 1 ];
                const z = chunks[0].data[ i + 2 ];
                const c = chunks[0].data[ i + 3 ];
                const hex = chunks[0].palette[ c ];
                const color = '#' + ("000000" + (((hex & 0xFF) << 16) + (hex & 0xFF00) + ((hex >> 16) & 0xFF)).toString(16)).slice(-6);
                arr.push({ x: x, y: z, z: -y, color: color.toUpperCase() });
            }
            postMessage(arr);
            arr = [];
            break;

        case 'fillArrayBuffers':
            const voxelsLen = ev.data.data[0];
            const vPositions = ev.data.data[1];
            const vUvs = ev.data.data[2];
            const vIndices = ev.data.data[3];
            const bufferWorld = ev.data.data[4];
            const bufferColors = ev.data.data[5];

            const positions = new Float32Array(vPositions.length * voxelsLen);
            const uvs = new Float32Array(vUvs.length * voxelsLen);
            const colors = new Float32Array(vUvs.length * 2 * voxelsLen);
            const indices = new Uint32Array(vIndices.length * voxelsLen);

            const p = { x: 0, y: 0, z: 0 };
            const lenC = vUvs.length * 2;

            for (let i = 0; i < voxelsLen; i++) {
                for (let v = 0; v < vPositions.length; v += 3) {
                    p.x = vPositions[v];
                    p.y = vPositions[v + 1];
                    p.z = vPositions[v + 2];
                    const m = bufferWorld[i]._m; // Vector3TransformCoordinates
                    const rx = p.x * m[0] + p.y * m[4] + p.z * m[8] + m[12];  // multiply matrix to
                    const ry = p.x * m[1] + p.y * m[5] + p.z * m[9] + m[13];  // get the scaling
                    const rz = p.x * m[2] + p.y * m[6] + p.z * m[10] + m[14]; // to support visibility
                    const rw = 1 / (p.x * m[3] + p.y * m[7] + p.z * m[11] + m[15]);
                    positions[i * vPositions.length + v] = rx * rw;
                    positions[i * vPositions.length + v + 1] = ry * rw;
                    positions[i * vPositions.length + v + 2] = rz * rw;
                }

                for (let v = 0; v < vUvs.length; v += 2) {
                    uvs[i * vUvs.length + v] = vUvs[v];
                    uvs[i * vUvs.length + v + 1] = vUvs[v + 1];
                    colors[i * lenC + v * 2] = bufferColors[i * 4];
                    colors[i * lenC + v * 2 + 1] = bufferColors[i * 4 + 1];
                    colors[i * lenC + v * 2 + 2] = bufferColors[i * 4 + 2];
                    colors[i * lenC + v * 2 + 3] = 1;
                }

                const lenI = vPositions.length / 3;
                const len = i * vIndices.length;
                for (let v = 0; v < vIndices.length; v++) {
                    indices[len + v] = vIndices[v] + i * lenI;
                }
            }
            postMessage([ positions, uvs, colors, indices ]);
            break;
    }
}
