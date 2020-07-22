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


async def io_handler(websocket_connector: WebsocketConnector, shuttle_connector: ShuttleConnector, consumer, producer):
    '''
    Deals with handlers for messages that are reviced and those that are sent. 
    In this case: telemetry and thrust commands
    '''
    websocket_connector.add_handlers(consumer, producer)
    websocket_connector.get_shuttle_connector(shuttle_connector)
    await websocket_connector.run()


async def websocket_consumer(message):
    '''
    Reads message and executes according action
    '''
    jsonMsg = json.loads(message)
    # Log the messages to the console for now
    # TODO: Send the messages to ShuttleConnector
    print(jsonMsg)


async def websocket_producer(shuttle_connector: ShuttleConnector):
    '''
    Sends messages periodically over websocket
    '''
    await asyncio.sleep(config.TELEMETRY_INVERVAL)
    return json.dumps(shuttle_connector.telemetry())


def control_over_websocket(use_fake_shuttle=False):
    ''' Main function for running the actual use case '''

    # setup connections to backend and shuttle and create a desired_thrust object
    if use_fake_shuttle:
        shuttle_connector = FakeShuttleConnector()
    else:
        shuttle_connector = ShuttleConnector(config.MAVLINK_CONNECTION_STRING)
    websocket_connector = WebsocketConnector(config.WEBSOCKET_URI)

    async def main():
        # add functions that should be run concurrently
        await asyncio.gather(
            io_handler(websocket_connector,  # for sending telemetry and rcv messages
                        shuttle_connector, 
                        websocket_consumer, 
                        websocket_producer),
            heartbeat(shuttle_connector),  # send heartbeat to shuttle periodicaly 
        )

    asyncio.run(main())


def fake_test():
    control_over_websocket(use_fake_shuttle=True)


if __name__ == "__main__":
    fake_test()
