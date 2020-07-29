from pymavlink import mavutil
import logging
import sys
import asyncio


def is_legal(value: float):
    return value >= -1 and value <= 1


class ShuttleConnector:

    def __init__(self, connection_string: str, use_rc=True):
        '''
        Establishes and verifies a connection to a ArduPilot device through the given 
        connection string. 
        '''

        self.use_rc = use_rc

        self.x = 0
        self.y = 0
        self.z = 0
        self.r = 0
        self.rateLimit = 0.2

        self.telemetry_list = {}

        # Create the connection
        # Documentation on connection strings
        # http://mavlink.io/en/mavgen_python/
        logging.info('Creating connection..')
        self.mavcon = mavutil.mavlink_connection(connection_string)

        # Wait a heartbeat before sending commands
        logging.info('Waiting for first heartbeat..')
        self.mavcon.wait_heartbeat()
        logging.info('Heartbeat recieved')

        # Choose a mode
        mode = 'MANUAL'

        print(self.mavcon.mode_mapping())

        # Check if mode is available
        if mode not in self.mavcon.mode_mapping():
            print('Unknown mode : {}'.format(mode))
            print('Try:', list(self.mavcon.mode_mapping().keys()))
            sys.exit(1)

        # Get mode ID
        mode_id = self.mavcon.mode_mapping()[mode]

        # Set mode
        self.mavcon.mav.set_mode_send(
            self.mavcon.target_system,
            mavutil.mavlink.MAV_MODE_FLAG_CUSTOM_MODE_ENABLED,
            mode_id)

        # Arm thrusters
        """self.mavcon.mav.command_long_send(
            self.mavcon.target_system,
            self.mavcon.target_component,
            mavutil.mavlink.MAV_CMD_COMPONENT_ARM_DISARM,
            0,
            1, 0, 0, 0, 0, 0, 0)"""

        while True:
            logging.info('ack')
            # Wait for ACK command
            ack_msg = self.mavcon.recv_match(type='COMMAND_ACK', blocking=True)
            ack_msg = ack_msg.to_dict()

            # Check if command in the same in `set_mode`
            if ack_msg['command'] != mavutil.mavlink.MAVLINK_MSG_ID_SET_MODE:
                continue

            # Print the ACK result !
            print(mavutil.mavlink.enums['MAV_RESULT'][ack_msg['result']].description)
            break

        logging.info('setup done')
    
    def rate_limiter(self,old,val):
        if (abs(val-old) > self.rateLimit):
            sign = (val-old)/abs(val-old) 
            new = min(max(old + (self.rateLimit*sign),-1),1)
            return new
        else:
            return val

    async def handle_ws_message(self, message):
        '''Handles all websocket messages by running the appropriate method'''

        if message['type'] == 'input':
            await self.send_thrust_command(message['x'], message['y'], message['z'], message['r'])
        elif message['type'] == 'changeFlightMode':
            await self.change_flight_mode(message['flightMode'])
        elif message['type'] == 'armShuttle':
            await self.arm_shuttle(message['armShuttle'])

    async def send_thrust_command(self, x=0, y=0, z=0, r=0) -> None:
        '''
        Function that sends thrust commands to target device. 
        Values should be in the range [-1, 1], where
        1 is full thottle ahead and negative is reverse.
        Documentation on manual control 
        https://mavlink.io/en/messages/common.html#MANUAL_CONTROL
        '''
        if not is_legal(x) and is_legal(y) and is_legal(z) and is_legal(r):
            raise ValueError('Arguments are outside of boundary [-1,1]')

        self.x = self.rate_limiter(self.x,x)
        self.y = self.rate_limiter(self.y,y)
        self.z = self.rate_limiter(self.z,z)
        self.r = self.rate_limiter(self.r,r)

        if self.use_rc: 
            # There are 8 RC channels
            data = [1500] * 8

            # We use 4 of them
            data[5] += int(self.x * 200)
            data[4] += int(self.y * 200)
            data[2] += int(self.z * 200)
            data[3] += int(self.r * 200)

            self.mavcon.mav.rc_channels_override_send(
                self.mavcon.target_system, 
                self.mavcon.target_component, 
                *data
            )
            logging.debug('RC sent')

        else:
            # maps z to [0, 1], to comply with a weird legacy quirk in the API
            z = (self.z + 1) / 2

            # map from [-1,1] to [-1000, 1000]
            x = int(self.x * 1000)
            y = int(self.y * 1000)
            z = int(self.z * 1000)
            r = int(self.r * 1000)

            self.mavcon.mav.manual_control_send(
                self.mavcon.target_system,
                x,
                y,
                z,
                r,
                1  # controller button pressed or not
            )
            logging.debug('Thrust cmd sent')

    async def change_flight_mode(self, flight_mode):
        '''Change the shuttle's flight mode'''
        print('flight')

        # Check if mode is available
        if flight_mode not in self.mavcon.mode_mapping():
            print('Unknown mode : {}'.format(mode))
            print('Try:', list(self.mavcon.mode_mapping().keys()))
        else:
            # Get mode ID
            mode_id = self.mavcon.mode_mapping()[flight_mode]

            # Set mode
            self.mavcon.mav.set_mode_send(
                self.mavcon.target_system,
                mavutil.mavlink.MAV_MODE_FLAG_CUSTOM_MODE_ENABLED,
                mode_id)

            logging.info(f'Set mode to {flight_mode}')

    async def arm_shuttle(self, arm_shuttle: bool):
        '''Arm or disarm the shuttle'''
        if arm_shuttle:
            # Arm thrusters
            self.mavcon.mav.command_long_send(
                self.mavcon.target_system,
                self.mavcon.target_component,
                mavutil.mavlink.MAV_CMD_COMPONENT_ARM_DISARM, 0,
                1,  # 1 = arm, 0 = disarm
                0, 0, 0, 0, 0, 0)
            logging.debug('Armed shuttle')
        else:
            # Disarm thrusters
            self.mavcon.mav.command_long_send(
                self.mavcon.target_system,
                self.mavcon.target_component,
                mavutil.mavlink.MAV_CMD_COMPONENT_ARM_DISARM, 0,
                0,  # 1 = arm, 0 = disarm
                0, 0, 0, 0, 0, 0)
            logging.debug('Disarmed shuttle')

    async def send_heartbeat(self):
        ''' sends heartbeat from GCS to ardusub '''

        self.mavcon.mav.heartbeat_send(
            mavutil.mavlink.MAV_TYPE_GCS,
            mavutil.mavlink.MAV_AUTOPILOT_INVALID, 
            0, 
            0, 
            0
        )
        logging.debug('Heartbeat sent')

    async def get_telemetry(self):
        """Listens for selected types of telemetry from shuttle"""
        while True:
            await asyncio.sleep(0.001)
            message = self.mavcon.recv_match(blocking=True)
            message_dict = message.to_dict()
            if message.get_type() == 'GLOBAL_POSITION_INT':
                self.telemetry_list['alt'] = message_dict['alt']
                self.telemetry_list['vx'] = message_dict['vx']
                self.telemetry_list['vy'] = message_dict['vy']
                self.telemetry_list['vz'] = message_dict['vz']
            if message.get_type() == 'RC_CHANNELS':
                self.telemetry_list['chan3_raw'] = (message_dict['chan3_raw'] -1500) / 200
                self.telemetry_list['chan4_raw'] = (message_dict['chan4_raw'] -1500) / 200
                self.telemetry_list['chan5_raw'] = (message_dict['chan5_raw'] -1500) / 200
                self.telemetry_list['chan6_raw'] = (message_dict['chan6_raw'] -1500) / 200
            if message.get_type() == 'VFR_HUD':
                self.telemetry_list['heading'] = message_dict['heading']


    def send_telemetry(self):
        flightmode = self.mavcon.flightmode
        armed = self.mavcon.motors_armed()
        self.telemetry_list['flightmode'] = flightmode
        self.telemetry_list['armed'] = armed

        return {'telemetry_list': self.telemetry_list}

class FakeShuttleConnector:

    def __init__(self, connection_string: str = ''):
        logging.info('Fake shuttle created')
        self.x = 0
        self.y = 0
        self.z = 0
        self.r = 0
        self.rateLimit = 0.2

    async def handle_ws_message(self, message):
        '''Handles all websocket messages by running the appropriate method'''

        if message['type'] == 'input':
            await self.send_thrust_command(message['x'], message['y'], message['z'], message['r'])
        elif message['type'] == 'changeFlightMode':
            await self.change_flight_mode(message['flightMode'])
        elif message['type'] == 'armShuttle':
            await self.arm_shuttle(message['armShuttle'])

    def rate_limiter(self,old,val):
        if (abs(val-old) > self.rateLimit):
            sign = (val-old)/abs(val-old) 
            new = min(max(old + (self.rateLimit*sign),-1),1)
            return new
        else:
            return val

    async def send_thrust_command(self, x=0, y=0, z=500, r=0) -> None:
        self.x = self.rate_limiter(self.x,x)
        self.y = self.rate_limiter(self.y,y)
        self.z = self.rate_limiter(self.z,z)
        self.r = self.rate_limiter(self.r,r)

    async def change_flight_mode(self, flight_mode):
        '''Change the shuttle's flight mode'''

        logging.info(f'Successfully received new flight mode: {flight_mode}.')
    
    async def arm_shuttle(self, arm_shuttle):
        '''Arm or disarm the shuttle'''

        if arm_shuttle:
            logging.info('Successfully received arming command.')
        else:
            logging.info('Successfully received disarming command.')

    async def send_heartbeat(self):
        pass
    
    def telemetry(self) -> dict:
        return {
            'fake_telemetry': 0.5
        }
