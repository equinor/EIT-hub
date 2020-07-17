import asyncio
import logging
import json
from time import time
from shuttle import config
from shuttle.websocket_connector import WebsocketConnector
from shuttle.shuttle_connector import ShuttleConnector, FakeShuttleConnector


logging.basicConfig(format='%(levelname)s: %(message)s', level=logging.INFO)


def periodic_task(delay: float):
    ''' Decorator that makes a function run every <delay> seconds '''
    def periodic_task_decorator(func):
        async def wrapper(*args, **kwargs):
            while True:
                await func(*args, **kwargs)
                await asyncio.sleep(delay)
        return wrapper
    return periodic_task_decorator


@periodic_task(config.HEARTBEAT_DELAY)
async def heartbeat(shuttle: ShuttleConnector):
    ''' 
    Send a heartbeat to shuttle every <delay> seconds 
    '''
    await shuttle.send_heartbeat()
    logging.debug('Heartbeat sent')


async def io_handler(websocket_connector: WebsocketConnector, consumer, producer):
    '''
    Deals with handlers for messages that are reviced and those that are sent. 
    In this case: telemetry and thrust commands
    '''
    websocket_connector.add_handlers(consumer, producer)
    await websocket_connector.run()


async def consumer(message):
    pass


async def producer(shuttle_connector: ShuttleConnector):
    await asyncio.sleep(config.TELEMETRY_INVERVAL)
    return shuttle_connector.get_telemetry()


def control_over_websocket(use_fake_shuttel=False):
    ''' Main function for running the actual use case '''

    # setup connections to backend and shuttle and create a desired_thrust object
    if use_fake_shuttel:
        shuttle_connector = FakeShuttleConnector()
    else:
        shuttle_connector = ShuttleConnector(config.MAVLINK_CONNECTION_STRING)
    websocket_connector = WebsocketConnector(config.WEBSOCKET_URI)

    async def main():
        # add functions that should be run concurrently
        await asyncio.gather(
            io_handler(consumer, producer),     # for sending telemetry and rcv messages
            heartbeat(shuttle_connector),       # send heartbeat to shuttle periodicaly 
        )

    asyncio.run(main())


def fake_test():
    control_over_websocket(use_fake_shuttel=True)


if __name__ == "__main__":
    fake_test()
