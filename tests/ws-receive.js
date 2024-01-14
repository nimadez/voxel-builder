//
// Websockets server test
// requirement: npm install ws
//
const WebSocket = require('ws');
 
const wss = new WebSocket.Server({ port: 8011 });

wss.on("connection", (ws) => {
    console.log("connected");
    
    ws.on("message", (msg) => {
        msg = JSON.parse(msg);
        console.log(msg.voxels);
    });
    
    ws.on("close", () => {
        console.log("connection closed");
    });

    ws.on('error', console.error);
});
