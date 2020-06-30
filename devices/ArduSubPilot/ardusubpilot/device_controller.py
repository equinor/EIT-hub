from time import sleep
from pymavlink import mavutil
import os

# load user-made environment variables
from dotenv import load_dotenv
load_dotenv()


class DeviceController:

    def __init__(self, connenction_string='udpin:0.0.0.0:14550'):

        # Create the connection
        # Documentation on connection strings
        # http://mavlink.io/en/mavgen_pythonhttp://mavlink.io/en/mavgen_python//
        self.master = mavutil.mavlink_connection(connenction_string)

        # Wait a heartbeat before sending commands
        self.master.wait_heartbeat()

        # Arm thrusters 
        if not self.master.motors_armed():
            self.master.arducopter_arm()
            self.master.motors_armed_wait()


    def get_flightmode(self) -> str:
        """
        returns the active flight mode / controller mode of the device
        """
        return self.master.flightmode


    def send_thrust_command(self, x=0, y=0, z=0, r=0):
        """
        Function that sends thrust commands to target device. 
        Values should be in the range [-1000, 1000], where
        1000 is full thottle ahead and negative is reverse.

        Documentation on manual control 
        https://mavlink.io/en/messages/common.html#MANUAL_CONTROL

        """

        self.master.mav.manual_control_send(
            self.master.target_system,
            x,
            y,
            z,
            r,
            0   # controller button pressed or not
        )


if __name__ == "__main__":
    """
    This code block is only for testing purposes.
    """
    dc = DeviceController()
    print("Controller mode: " + dc.get_flightmode())
    for i in range(5):
        dc.send_thrust_command(r=200)
        sleep(1)
