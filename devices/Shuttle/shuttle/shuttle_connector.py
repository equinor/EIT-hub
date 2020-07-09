from pymavlink import mavutil
import logging


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

        # Arm thrusters 
        if not self.mavcon.motors_armed():
            logging.info('arming thrusters..')
            self.mavcon.arducopter_arm()
            self.mavcon.motors_armed_wait()
        logging.info('thrusters armed')

        logging.info('setup done')

    async def send_thrust_command(self, x=0, y=0, z=500, r=0) -> None:
        '''
        Function that sends thrust commands to target device. 
        Values should be in the range [-1000, 1000], where
        1000 is full thottle ahead and negative is reverse.
        Z is mapped to [0, 1000].
        Documentation on manual control 
        https://mavlink.io/en/messages/common.html#MANUAL_CONTROL
        '''
        
        # Limit command values 
        x = 1000 if x > 1000 else x
        x = -1000 if x < -1000 else x

        y = 1000 if x > 1000 else y
        y = -1000 if x < -1000 else y

        z = 1000 if x > 1000 else z
        z = 0 if x < 0 else z

        r = 1000 if x > 1000 else r
        r = -1000 if x < -1000 else r

        # Send command
        self.mavcon.mav.manual_control_send(
            self.mavcon.target_system,
            x,
            y,
            z,
            r,
            0   # controller button pressed or not
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


    def log_data(self):
        pass


class FakeShuttleConnector:

    def __init__(self, connenction_string: str):
        logging.info('Fake shuttle created')

    async def send_thrust_command(self, x=0, y=0, z=500, r=0) -> None:
        pass

    async def send_heartbeat(self):
        pass
    
    def log_data(self):
        pass