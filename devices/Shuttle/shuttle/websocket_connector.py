import asyncio
import websockets
import logging


# enable logging to see what websockets does
logger = logging.getLogger('websockets')
logger.setLevel(logging.INFO)
logger.addHandler(logging.StreamHandler())


async def consumer_handler(uri, consumer_func) -> None:
    async with websockets.connect(uri) as websocket:
        async for message in websocket:
            logger.info('message receieved')
            await consumer_func(message)


if __name__ == "__main__":
    uri = 'ws://localhost:3000/'
    
    async def printer(message):
        logger.info(message)

    asyncio.run(consumer_handler(uri, printer))
