/* 
    Aug 2024
    @nimadez

    Websockets Client

    Test Server:
    $ python3 scripts/ws-connect.py
*/

import { Vector3 } from '../babylon.js';
import { MODE, preferences, ui, builder } from '../../main.js';


class WebsocketClient {
    constructor() {
        this.ws = undefined;
        this.retryDelay = 2000;
        this.maxRetry = 10;
        this.retry = 0;
        this.interval = null;
        this.parsed = [];
        this.data = [];
    }

    connect() {
        if (!preferences.getWebsocket()) {
            this.disconnect();
            return;
        }

        this.ws = new WebSocket("ws://" + preferences.getWebsocketUrl());

        this.ws.onopen = () => {
            clearInterval(this.interval);
            ui.domWebSocketStatus.innerHTML = 'Connected';
            ui.domWebSocketStatus.style.color = 'limegreen';
            this.retry = 0;
            this.sendMessage('Initialized.', 'init');
        };

        this.ws.onmessage = (ev) => {
            if (MODE == 0) {
                this.parsed = JSON.parse(ev.data);

                this.data = [];
                for (let i = 0; i < this.parsed.voxels.length; i++) {
                    this.data.push({
                        position: Vector3(
                            this.parsed.voxels[i].position.x,
                            this.parsed.voxels[i].position.y,
                            this.parsed.voxels[i].position.z),
                        color: this.parsed.voxels[i].color,
                        visible: this.parsed.voxels[i].visible
                    })
                }

                if (this.parsed.is_clear) {
                    builder.setDataFromArray(this.data);
                } else {
                    builder.add(
                        this.data[0].position,
                        this.data[0].color,
                        this.data[0].visible);
                    builder.create();
                }
            }
        };

        this.ws.onclose = () => {
            this.retryConnection();
        };

        this.ws.onerror = () => {
            //this.retryConnection();
        };
    }

    retryConnection() {
        clearInterval(this.interval);
        if (preferences.getWebsocket()) {
            this.interval = setInterval(() => {
                if (this.retry < this.maxRetry) {
                    this.retry++;
                    ui.domWebSocketStatus.innerHTML = `Retry ${this.retry}/${this.maxRetry} ...`;
                    ui.domWebSocketStatus.style.color = 'slategray';
                    this.connect();
                } else {
                    this.disconnect();
                }
            }, this.retryDelay);
        }
    }

    sendMessage(voxels, key) {
        if (MODE == 0 && preferences.getWebsocket())
            if (this.ws && this.ws.readyState === WebSocket.OPEN)
                this.ws.send(JSON.stringify({ key: key, voxels: voxels }));
    }
    
    disconnect() {
        clearInterval(this.interval);
        if (this.ws && this.ws.readyState === WebSocket.OPEN)
            this.ws.close();
        this.ws = undefined;
        ui.domWebSocketStatus.innerHTML = 'Disconnected';
        ui.domWebSocketStatus.style.color = 'indianred';
    }
}

export const ws_client = new WebsocketClient();
