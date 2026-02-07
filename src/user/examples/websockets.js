/* 
    Websockets data visualization
*/


import { Vector3 } from '../../modules/babylon.js';
import { builder, preferences } from '../../modules/core.js';


class WebSocketsExample {
    constructor() {
        this.col_shade = undefined
    }

    create() {
        const ws = new WebSocket('wss://example.websocket.api');

        ws.onopen = () => {
            console.log('Connected to websockets');

            this.col_shade = preferences.getRenderShadeColor();

            builder.voxels = []; // clear voxels
        };

        ws.onmessage = (ev) => {
            const data = JSON.parse(ev.data);
            
            const x = parseInt(data.example.x);
            const y = parseInt(data.example.y);
            const z = parseInt(data.example.z);

            builder.add(Vector3(x, y, z), this.col_shade, true);
            builder.create();
        };

        ws.onclose = () => {
            console.log('Websockets connection closed');
            this.voxels = [];
        };

        ws.onerror = (err) => {
            console.error('Websockets error:', err);
            this.voxels = [];
        };
    }
}
