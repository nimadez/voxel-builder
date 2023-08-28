//
// Websockets server test
// requirement: npm install ws
//
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8011 });

function beat(ws) {
    const data = [];
    for (let i = 0; i < 100; i++) {
        const x = Math.random() * (10 - -10) + -10;
        const y = Math.random() * (10 - -10) + -10;
        const z = Math.random() * (10 - -10) + -10;
        const hex = "#000000".replace(/0/g, () => { return (~~(Math.random()*16)).toString(16); });
        data.push({
            position: { x: x, y: y, z: z },
            color: hex,
            visible: true
        });
    }
    ws.send(JSON.stringify({
        voxels: data
    }));
}

wss.on("connection", (ws) => {
    console.log("connected");

    beat(ws);
    
    ws.on("message", () => {
        setTimeout(() => {
            beat(ws);
        }, 1000/10);
    });
    
    ws.on("close", () => {
        console.log("connection closed");
    });

    ws.on('error', console.error);
});
