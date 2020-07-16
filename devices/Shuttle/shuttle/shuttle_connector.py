from pymavlink import mavutil
import logging
import sys


def is_legal(value: float):
    return value >= -1 and value <= 1


class ShuttleConnector:

    def __init__(self, connenction_string: str):
        '''
        Establishes and vertifies a connection to a ArduPilot device through the given 
        connection string. 
        '''

        # Create the connection
        # Documentation on connection strings
        # http://mavlink.io/en/mavgen_python/
        logging.info('Creating connection..')
        self.mavcon = mavutil.mavlink_connection(connenction_string)

        # Wait a heartbeat before sending commands
        logging.info('waiting for first heartbeat..')
        self.mavcon.wait_heartbeat()
        logging.info('Heartbeat recieved')

        # Choose a mode
        mode = 'MANUAL'

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
        self.mavcon.mav.command_long_send(
            self.mavcon.target_system,
            self.mavcon.target_component,
            mavutil.mavlink.MAV_CMD_COMPONENT_ARM_DISARM,
            0,
            1, 0, 0, 0, 0, 0, 0)

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

    async def send_rc(self, x=0, y=0, z=500, r=0) -> None:

        if not is_legal(x) and is_legal(y) and is_legal(z) and is_legal(r):
            raise ValueError('Arguments are outside of boundary [-1,1]')

        # There are 8 RC channels
        data = [1500] * 8

        # We use 4 of them
        data[5] += int(x * 200)
        data[4] += int(y * 200)
        data[2] += int(z * 200)
        data[3] += int(r * 200)

        self.mavcon.mav.rc_channels_override_send(self.mavcon.target_system, self.mavcon.target_component, *data)
        logging.debug('RC sent')
        

    async def send_thrust_command(self, x=0, y=0, z=500, r=0) -> None:
        '''
        Function that sends thrust commands to target device. 
        Values should be in the range [-1, 1], where
        1 is full thottle ahead and negative is reverse.
        Documentation on manual control 
        https://mavlink.io/en/messages/common.html#MANUAL_CONTROL
        '''
        if not is_legal(x) and is_legal(y) and is_legal(z) and is_legal(r):
            raise ValueError('Arguments are outside of boundary [-1,1]')

        # mapps z to [0, 1], to comply with a weird legacy quirk in the API
        z = (z + 1) / 2

        # map from [-1,1] to [-1000, 1000]
        x = int(x * 1000)
        y = int(y * 1000)
        z = int(z * 1000)
        r = int(r * 1000)

        # Send command
        self.mavcon.mav.manual_control_send(
            self.mavcon.target_system,
            x,
            y,
            z,
            r,
            1   # controller button pressed or not
        )
        logging.debug('Thrust cmd sent')


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

    async def recv_telemetry(self):
        """Listens for selected types of telemetry from shuttle"""

        # GLOBAL_POSITION_INT contains data on shuttle speed and shuttle altitude
        telemetry = self.mavcon.recv_match(type='GLOBAL_POSITION_INT', blocking=True)
        logging.info(f'Position telemetry received: {telemetry}')


    def telemetry(self):
        return {
            'fake_telemetry': 0.5
        }


class FakeShuttleConnector:

    def __init__(self, connenction_string: str = ''):
        logging.info('Fake shuttle created')

    async def send_thrust_command(self, x=0, y=0, z=500, r=0) -> None:
        pass

    async def send_heartbeat(self):
        pass
    
    def telemetry(self) -> dict:
        return {
            'fake_telemetry': 0.5
        }
