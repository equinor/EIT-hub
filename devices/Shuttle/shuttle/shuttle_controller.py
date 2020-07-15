import asyncio
import logging
import json
from time import time
from shuttle import config
from shuttle.websocket_connector import WebsocketConnector
from shuttle.shuttle_connector import ShuttleConnector, FakeShuttleConnector


logging.basicConfig(format='%(levelname)s: %(message)s', level=logging.INFO)


class DesiredThrust(dict):
    '''
    Specialized dict that handles async updates with tailored default values and has timestamps on updates
    '''

    def __init__(self):
        super().__init__({
            'x': 0,
            'y': 0,
            'z': 0,
            'r': 0,
        })
        self.timestamp: float = 0

    async def update_desired_thrust(self, x: int = 0, y: int = 0, z: int = 0, r: int = 0) -> None:
        self['x'] = x
        self['y'] = y
        self['z'] = z
        self['r'] = r
        self.timestamp = time()
        logging.info('Desired thrust updated to: %d %d %d %d at %d' % (x, y, z, r, self.timestamp))

    async def update_desired_thrust_from_json(self, message: str) -> None:
        try:
            content: dict = json.loads(message)
        except ValueError:
            logging.exception('Incomming message has invalid json format')

        cmd_list = content.values()
        logging.debug('Recieved thrust message: ' + str(cmd_list))

        await self.update_desired_thrust(*cmd_list)

    def thrust_should_be_reset(self):
        return abs(self.timestamp - time()) > config.THRUST_TIME_LIMIT

    def to_json(self) -> str:
        return json.dumps({
            'desired_thrust': {
                'x': self['x'],
                'y': self['y'],
                'z': self['z'],
                'r': self['r']
            }
        })


def periodic_task(delay: float):
    ''' Decorator that makes a function run every <delay> seconds '''
    def periodic_task_decorator(func):
        async def wrapper(*args, **kwargs):
            while True:
                await func(*args, **kwargs)
                await asyncio.sleep(delay)
        return wrapper
    return periodic_task_decorator


@periodic_task(config.PILOT_CMD_DELAY)
async def thrust_sender(shuttle: ShuttleConnector, desired_thrust: dict):
    '''
    Sends desired thrust to ardusub at given interval. 
    '''
    await shuttle.send_thrust_command(
        desired_thrust['x'], 
        desired_thrust['y'], 
        desired_thrust['z'], 
        desired_thrust['r'], 
    )
    logging.debug('Desired thrust sent as: %f %f %f %f' % (
        desired_thrust['x'], 
        desired_thrust['y'], 
        desired_thrust['z'], 
        desired_thrust['r']
    ))


@periodic_task(config.HEARTBEAT_DELAY)
async def heartbeat(shuttle: ShuttleConnector):
    ''' 
    Send a heartbeat to shuttle every <delay> seconds 
    '''
    await shuttle.send_heartbeat()
    logging.debug('Heartbeat sent')


@periodic_task(config.THRUST_RESET_DELAY)
async def thrust_resetter(desired_thrust: DesiredThrust):
    ''' 
    Sets desired thrust to neutral if no new commands are recieved within timelimit.
    '''
    if desired_thrust.thrust_should_be_reset:
        await desired_thrust.update_desired_thrust()  # default params are neutral
        logging.debug('Desired thrust has been reset')


async def io_handler(websocket_connector: WebsocketConnector, desired_thrust: DesiredThrust):
    '''
    Deals with handlers for messages that are reviced and those that are sent. 
    In this case: telemetry and thrust commands
    '''

    # add consumer and producer functions to websocket_connector
    async def get_telemetry() -> str:
        await asyncio.sleep(config.TELEMETRY_INVERVAL)
        return desired_thrust.to_json()

    update_thrust = desired_thrust.update_desired_thrust_from_json
    websocket_connector.add_handlers(consumer=update_thrust, producer=get_telemetry)

    # let websocket listen for messages and send telemetry over the same socket
    await websocket_connector.run()


def quick_test():
    ''' simple test that sends a constant thrust command to the shuttle '''

    shuttle_connector = ShuttleConnector(config.MAVLINK_CONNECTION_STRING)
    desired_thrust: dict = {
        'x': 0,
        'y': 0,
        'z': 0,
        'r': 0.1,
    }

    async def main():
        await asyncio.gather(
            thrust_sender(shuttle_connector, desired_thrust),
            heartbeat(shuttle_connector)
        )

    asyncio.run(main())


def control_over_websocket(use_fake_shuttel=False):
    ''' Main function for running the actual use case '''

    # setup connections to backend and shuttle and create a desired_thrust object
    if use_fake_shuttel:
        shuttle_connector = FakeShuttleConnector()
    else:
        shuttle_connector = ShuttleConnector(config.MAVLINK_CONNECTION_STRING)
    websocket_connector = WebsocketConnector(config.WEBSOCKET_URI)
    desired_thrust = DesiredThrust()

    async def main():
        # add functions that should be run concurrently
        await asyncio.gather(
            io_handler(websocket_connector, desired_thrust),    # for sending telemetry and rcv messages
            thrust_resetter(desired_thrust),                    # reset thrust commands after a delay
            thrust_sender(shuttle_connector, desired_thrust),   # send desired thrust to shuttle preiodically
            heartbeat(shuttle_connector)                        # send heartbeat to shuttle periodicaly 
        )

    asyncio.run(main())


def fake_test():
    control_over_websocket(use_fake_shuttel=True)


if __name__ == "__main__":
    fake_test()
