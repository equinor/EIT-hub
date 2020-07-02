import asyncio
import websockets
import logging


# enable logging to see what websockets does
logger = logging.getLogger('websockets')
logger.setLevel(logging.INFO)
logger.addHandler(logging.StreamHandler())


async def create_websocket_client(uri: str) -> websockets.WebSocketClientProtocol:
    websocket = await websockets.connect(uri)
    return websocket


async def consumer_handler(websocket, consumer_func) -> None:
    async for message in websocket:
        await consumer_func(message)


if __name__ == "__main__":
    uri = 'tmp'
    websocket = create_websocket_client(uri)

    async def printer(message):
        logger.info(message)

    try:
        consumer_handler(websocket, printer)
    finally:
        websocket.close()
