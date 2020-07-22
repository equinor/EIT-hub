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

    def get_shuttle_connector(self, shuttle_connector):
        self.shuttle_connector = shuttle_connector
        
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
            logging.debug('message recieved: ' + str(message))
            await self.consumer(message)

    async def producer_handler(self, websocket, path):
        while True:
            # producer needs to have access to the ShuttleConnector to retrieve telemetry
            message = await self.producer(self.shuttle_connector)
            logging.debug('message sent: ' + str(message))
            await websocket.send(message)
