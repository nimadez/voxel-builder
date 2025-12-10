/* 
    Dec 2023
    @nimadez

    Web worker processor
*/


let arr = [];


onmessage = (ev) => {
    switch (ev.data.id) {

        case 'init':
            console.log('worker created');
            break;

        
        case 'fillMeshBuffers':
            const bufferMatrix = ev.data.data[0];
            const bufferColors = ev.data.data[1];
            const vPositions = ev.data.data[2];
            const vNormals = ev.data.data[3];
            const vUvs = ev.data.data[4];
            const vIndices = ev.data.data[5];

            const len = bufferMatrix.length / 16;
            const positions = new Float32Array(vPositions.length * len);
            const normals = new Float32Array(vPositions.length * len);
            const uvs = new Float32Array(vUvs.length * len);
            const colors = new Float32Array(vUvs.length * 2 * len);
            const indices = new Uint32Array(vIndices.length * len);
            const m = new Array(16);
            const p = { x: 0, y: 0, z: 0 };

            for (let i = 0; i < len; i++) {
                
                for (let j = 0; j < 16; j++)
                    m[j] = bufferMatrix[i * 16 + j];

                for (let v = 0; v < vPositions.length; v += 3) {
                    p.x = vPositions[v];
                    p.y = vPositions[v + 1];
                    p.z = vPositions[v + 2];
                    p.x = p.x * m[0] + p.y * m[4] + p.z * m[8] + m[12];
                    p.y = p.x * m[1] + p.y * m[5] + p.z * m[9] + m[13];
                    p.z = p.x * m[2] + p.y * m[6] + p.z * m[10] + m[14];
                    const rw = 1 / (p.x * m[3] + p.y * m[7] + p.z * m[11] + m[15]);
                    positions[i * vPositions.length + v] = p.x * rw;
                    positions[i * vPositions.length + v + 1] = p.y * rw;
                    positions[i * vPositions.length + v + 2] = p.z * rw;
    
                    p.x = vNormals[v];
                    p.y = vNormals[v + 1];
                    p.z = vNormals[v + 2];
                    p.x = p.x * m[0] + p.y * m[4] + p.z * m[8];
                    p.y = p.x * m[1] + p.y * m[5] + p.z * m[9];
                    p.z = p.x * m[2] + p.y * m[6] + p.z * m[10];
                    normals[i * vNormals.length + v] = p.x;
                    normals[i * vNormals.length + v + 1] = p.y;
                    normals[i * vNormals.length + v + 2] = p.z;
                }
    
                for (let v = 0; v < vUvs.length; v += 2) {
                    uvs[i * vUvs.length + v] = vUvs[v];
                    uvs[i * vUvs.length + v + 1] = vUvs[v + 1];
                    colors[i * vUvs.length * 2 + v * 2] = bufferColors[i * 4];
                    colors[i * vUvs.length * 2 + v * 2 + 1] = bufferColors[i * 4 + 1];
                    colors[i * vUvs.length * 2 + v * 2 + 2] = bufferColors[i * 4 + 2];
                    colors[i * vUvs.length * 2 + v * 2 + 3] = 1;
                }
    
                for (let v = 0; v < vIndices.length; v++) {
                    indices[i * vIndices.length + v] = vIndices[v] + i * vPositions.length / 3;
                }
            }
            // return bufferMatrix to resolve DataCloneError after 1 million voxels
            postMessage([ bufferMatrix, positions, normals, uvs, colors, indices ]);
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
            arr = [];
            for (let i = 0; i < ev.data.chunks.length; i++) {
                for (let j = 0; j < ev.data.chunks[i].data.length; j+=4) {
                    const x = ev.data.chunks[i].data[j];
                    const y = ev.data.chunks[i].data[j + 1];
                    const z = ev.data.chunks[i].data[j + 2];
                    const c = ev.data.chunks[i].data[j + 3];
                    const hex = ev.data.chunks[i].palette[ c ];
                    const color = '#' + ("000000" + (((hex & 0xFF) << 16) + (hex & 0xFF00) + ((hex >> 16) & 0xFF)).toString(16)).slice(-6);
                    arr.push({ id: i, x: x, y: z, z: -y, color: color.toUpperCase() });
                }
            }
            postMessage(arr);
            arr = [];
            break;
    }
}
