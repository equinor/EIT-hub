'''
Script that handles input and output from/to websocket.
The architecture is based on the consumer and producer pattern 
from  https://websockets.readthedocs.io/en/stable/intro.html
'''

import asyncio
import websockets
import logging
import json


class WebsocketConnector:
    '''
    Class responsible for websocket connection to backend. 
    Usage: 
    1) init with websocket uri 
    2) add handlers for recieved messages and for sending messages. 
        Consumer handler runns every time a message is recieved, and 
        Producer handler produces messages that are sent over the websocket
    3) run()
    '''

    def __init__(self, uri):
        self.uri: str = uri
        
    
    def add_handlers(self, consumer, producer):
        self.consumer = consumer
        self.producer = producer


    async def run(self):
        try: 
            async with websockets.connect(self.uri) as websocket:
                await self.handler(websocket, websocket.path)
        except websockets.ConnectionClosed:
            logging.error('lost connection to websocket')


    async def handler(self, websocket, path):
        consumer_task = asyncio.create_task(self.consumer_handler(websocket, path))
        producer_task = asyncio.create_task(self.producer_handler(websocket, path))
        done, pending = await asyncio.gather(consumer_task, producer_task)
        for task in pending:
            task.cancel()


    async def consumer_handler(self, websocket, path):
        async for message in websocket:
            await self.consumer(message)


    async def producer_handler(self, websocket, path):
        while True:
            message = await self.producer()
            await websocket.send(message)


if __name__ == "__main__":

    from shuttle.shuttle_controller import DesiredThrust

    uri = 'ws://localhost:3000/'

    async def printer(message):
        logging.info('message: ' + str(message))

    async def talker() -> str:
        await asyncio.sleep(1)
        telemetry = DesiredThrust()
        return json.dumps(telemetry)

    async def main():
        websocket_connector = WebsocketConnector(uri)
        websocket_connector.add_handlers(printer, talker)
        await websocket_connector.run()

    asyncio.run(main())
