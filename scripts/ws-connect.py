#!/usr/bin/env python3
# Aug 2024 https://nimadez.github.io/
#
# Websockets Server
# This script can be used to connect with machine learning models
# $ python3 ws-connect.py


import os, sys, json, random, time
import asyncio

sys.path.insert(1, os.path.dirname(os.path.dirname(os.path.realpath(__file__))) + '/libs')
from websockets.asyncio.server import serve


PORT = 8014
TOTAL = 100
CLEAR = False # clear scene or add voxel


async def handler(ws):
    while True:
        data = []
        for i in range(TOTAL):
            hex = "#%06x" % random.randint(0, 0xFFFFFF)
            data.append({
                "position": { "x": random.randint(-20,20), "y": random.randint(0,20), "z": random.randint(-20,20) },
                "color": hex.upper(),
                "visible": True
            })

        payload = { "voxels": data, "is_clear": CLEAR }

        await ws.send(json.dumps(payload))
        print('sent')
        message = await ws.recv()
        print('receive', message[:40], '...')
        time.sleep(0.1)


async def main():
    async with serve(handler, "", PORT):
        print(f"Websockets server is ready on port {PORT}")
        await asyncio.get_running_loop().create_future()
    

if __name__ == "__main__":
    asyncio.run(main())
