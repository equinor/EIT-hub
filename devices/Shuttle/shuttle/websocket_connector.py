import asyncio
import websockets
import logging


# enable logging to see what websockets does
logger = logging.getLogger('websockets')
logger.setLevel(logging.INFO)
logger.addHandler(logging.StreamHandler())
