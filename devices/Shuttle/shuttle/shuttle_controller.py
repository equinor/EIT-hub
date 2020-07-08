import asyncio
import logging
from datetime import datetime
from shuttle import config
from shuttle.websocket_connector import input_handler, get_websocket_uri
from shuttle.shuttle_connector import (
    create_mavlink_connection, 
    send_thrust_command, 
    send_heartbeat,
    log_data
)


logging.basicConfig(format='%(levelname)s: %(message)s', level=logging.INFO)


class DesiredThrust(dict):
    '''
    Specialized dict that handles async updates with tailored default values and has timestamps on updates
    '''

    def __init__(self):
        super().__init__()
        self.__dict__ = {
            'x': 0,
            'y': 0,
            'z': 500,
            'r': 0,
        }
        self.timestamp: float = 0

    async def update_desired_thrust(self, x: int = 0, y: int = 0, z: int = 500, r: int = 0) -> None:
        self.__dict__['x'] = x
        self.__dict__['y'] = y
        self.__dict__['z'] = z
        self.__dict__['r'] = r
        self.timestamp = datetime.timestamp()

    def thrust_should_be_reset(self):
        return abs(self.timestamp - datetime.timestamp()) > config.THRUST_TIME_LIMIT


def periodic_task(delay: float):
    ''' 
    Decorator that makes a function run every <delay> seconds 
    '''
    def periodic_task_decorator(func):
        async def wrapper(*args, **kwargs):
            while True:
                await func(*args, **kwargs)
                await asyncio.sleep(delay)
        return wrapper
    return periodic_task_decorator


@periodic_task(config.PILOT_CMD_DELAY)
async def thrust_sender(mavcon, desired_thrust: dict):
    '''
    Sends desired thrust to ardusub at given interval. 
    '''
    await send_thrust_command(
        mavcon,
        desired_thrust['x'], 
        desired_thrust['y'], 
        desired_thrust['z'], 
        desired_thrust['r'], 
    )


@periodic_task(config.HEARTBEAT_DELAY)
async def heartbeat(mavcon):
    ''' 
    Send a heartbeat to ardusub every <delay> seconds 
    '''
    await send_heartbeat(mavcon)


@periodic_task(config.THRUST_RESET_DELAY)
async def thrust_resetter(desired_thrust: DesiredThrust):
    ''' 
    Sets desired thrust to neutral if no new commands are recieved within timelimit.
    '''
    if desired_thrust.thrust_should_be_reset:
        await desired_thrust.update_desired_thrust()  # default params are neutral


def quick_test():

    mavcon = create_mavlink_connection(config.MAVLINK_CONNECTION_STRING)
    desired_thrust: dict = {
        'x': 0,
        'y': 0,
        'z': 500,
        'r': 100,
    }

    async def main():
        await asyncio.gather(
            thrust_sender(mavcon, desired_thrust),
            heartbeat(mavcon)
        )

    asyncio.run(main())


def control_over_websocket():

    mavcon = create_mavlink_connection(config.MAVLINK_CONNECTION_STRING)
    uri = get_websocket_uri()
    desired_thrust = DesiredThrust()
    
    async def main():
        await asyncio.gather(
            input_handler(uri, desired_thrust.update_desired_thrust),
            thrust_resetter(desired_thrust),
            thrust_sender(mavcon, desired_thrust),
            heartbeat(mavcon)
        )

    asyncio.run(main())
