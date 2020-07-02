from pymavlink import mavutil


def create_mavlink_connection(connenction_string: str):
    '''
    Establishes a connection to a ArduPilot device through the given 
    connection string. 
    Returns an object that handles the connection and message sending. 
    '''

    # Create the connection
    # Documentation on connection strings
    # http://mavlink.io/en/mavgen_python/
    mavcon = mavutil.mavlink_connection(connenction_string)

    # Wait a heartbeat before sending commands
    mavcon.wait_heartbeat()

    # Arm thrusters 
    if not mavcon.motors_armed():
        mavcon.arducopter_arm()
        mavcon.motors_armed_wait()

    return mavcon


def send_thrust_command(mavcon, x=0, y=0, z=0, r=0) -> None:
    '''
    Function that sends thrust commands to target device. 
    Values should be in the range [-1000, 1000], where
    1000 is full thottle ahead and negative is reverse.
    Documentation on manual control 
    https://mavlink.io/en/messages/common.html#MANUAL_CONTROL
    '''
    
    # Limit command values 
    x = 1000 if x > 1000 else x
    x = -1000 if x < -1000 else x

    y = 1000 if x > 1000 else y
    y = -1000 if x < -1000 else y

    z = 1000 if x > 1000 else z
    z = -1000 if x < -1000 else z

    r = 1000 if x > 1000 else r
    r = -1000 if x < -1000 else r

    # Send command
    mavcon.mav.manual_control_send(
        mavcon.target_system,
        x,
        y,
        z,
        r,
        0   # controller button pressed or not
    )
