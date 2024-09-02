#!/usr/bin/env python3
#
# Websockets Server
# This script can be used to connect with machine learning models
# $ python3 ws-connect.py


import os, sys, json, random, time, asyncio

sys.path.insert(1, os.path.dirname(os.path.dirname(os.path.realpath(__file__))) + '/src/libs')
from websockets.server import serve

if __import__('platform').system == 'Windows': # fix [WinError 10054]
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())


PORT = 8014
CLEAR = True # clear scene or add a voxel
POST = True  # test in send mode?


def generator():
    data = []
    for x in range(20):
        for y in range(20):
            for z in range(20):
                if random.randint(0,9) < 5:
                    hex = "#%06X" % random.randint(0, 0xFFFFFF)
                    data.append({
                        "position": { "x": x, "y": y, "z": z },
                        "color": hex, #.upper()
                        "visible": True
                    })
    return data


class Server():
    def __init__(self):
        pass


    async def handler(self, ws):
        async for msg in ws:
            msg = json.loads(msg)
            if not POST:
                match msg['key']:
                    case 'init':
                        print("Connection established.")
                    case 'get':
                        print(f"Received: {str(msg['voxels'])[:40]}...")
            else:
                voxel_data = generator()
                payload = { "voxels": voxel_data, "is_clear": CLEAR }
                await ws.send(json.dumps(payload))
                print("Sent")
                time.sleep(0.2)

            time.sleep(0.1)


    async def main(self):
        try:
            async with serve(self.handler, "localhost", PORT, max_queue=1, max_size=2 ** 25):
                print(f"Running websockets server at ws://localhost:{PORT}")
                await asyncio.get_running_loop().create_future()
        except Exception as err:
            print(err)


    def start(self):
        try:
            asyncio.run(self.main())
        except KeyboardInterrupt:
            print('Shutdown.')
        finally:
            pass


if __name__ == "__main__":
    Server().start()
