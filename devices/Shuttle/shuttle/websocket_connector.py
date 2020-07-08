import asyncio
import websockets
import logging
import json


async def input_handler(uri, thrust_update_func) -> None:
    async with websockets.connect(uri) as websocket:
        async for message in websocket:
            logging.info('message receieved')
            try: 
                thrust_dict = json.loads(message)
                await thrust_update_func(
                    x=thrust_dict['x'],
                    y=thrust_dict['y'],
                    z=thrust_dict['z'],
                    r=thrust_dict['r']
                )
            except ValueError:
                logging.exception('Incomming json message has invalid format')

def get_websocket_uri() -> str:
    # TODO: get uri form iot hub
    return 'ws://localhost:3000/'
