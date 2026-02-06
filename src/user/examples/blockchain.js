/* 
    Websockets blockchain visualizer
    Receive real-time unconfirmed Bitcoin transaction hashes.
*/


import { Vector3 } from '../../modules/babylon.js';
import { builder, preferences } from '../../modules/core.js';


class Blockchain {
    constructor() {
        this.col_shade = undefined
    }

    create() {
        const ws = new WebSocket('wss://ws.blockchain.info/inv');

        ws.onopen = () => {
            console.log('Connected to Blockchain.com');
            ws.send(JSON.stringify({ "op": "unconfirmed_sub" }));

            this.col_shade = preferences.getRenderShadeColor();

            builder.voxels = []; // clear voxels
        };

        ws.onmessage = (ev) => {
            const data = JSON.parse(ev.data);
            if (data.op === 'utx') {
                const tx = data.x;
                const hash = tx.hash;

                // compute x, y, z from slices of the hash (64 hex chars)
                const x = parseInt(hash.slice(0, 8), 16) % 20;
                const y = parseInt(hash.slice(8, 16), 16) % 20;
                const z = parseInt(hash.slice(16, 24), 16) % 20;

                builder.add(Vector3(x, y, z), this.col_shade, true);
                builder.create();
            }
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
            this.voxels = [];
        };

        ws.onerror = (err) => {
            console.error('WebSocket error:', err);
            this.voxels = [];
        };
    }
}


new Blockchain().create();
