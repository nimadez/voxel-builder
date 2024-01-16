/* 
    Dec 2023
    @nimadez

    Web worker processor
*/
import { parseMagicaVoxel } from '../loaders/magicavoxel.js';

let arr = [];

onmessage = (ev) => {
    switch (ev.data.id) {

        case 'findDuplicates':
            arr = ev.data.data[0].filter((val, idx) =>
                idx === ev.data.data[1][`${val.position._x}_${val.position._y}_${val.position._z}`]);
            postMessage(arr);
            arr = [];
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
    }
}
