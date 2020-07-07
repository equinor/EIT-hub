import asyncio
import websockets
import logging

logging.basicConfig(format='%(levelname)s: %(message)s', level=logging.INFO)


async def consumer_handler(uri, consumer_func) -> None:
    async with websockets.connect(uri) as websocket:
        async for message in websocket:
            logging.info('message receieved')
            await consumer_func(message)


if __name__ == "__main__":
    uri = 'ws://localhost:3000/'
    
    async def printer(message):
        logging.info(message)

    asyncio.run(consumer_handler(uri, printer))
