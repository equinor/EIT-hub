from shuttle import create_mavlink_connection, send_thrust_command
from shuttle.config import CONNECTION_STRING


def keyboard_control():

    mavcon = create_mavlink_connection(CONNECTION_STRING)
    def thrust(x=0, y=0, z=0, r=0):
        send_thrust_command(mavcon, x=0, y=0, z=0, r=0)

    while True:

        key = input('waiting for command..\n')

        if key == 'w':
            thrust(x=250)

        elif key == 'a':
            thrust(y=-250)

        elif key == 's':
            thrust(x=-250)

        elif key == 'd':
            thrust(y=250)

        elif key == 'q':
            thrust(r=-250)

        elif key == 'e':
            thrust(r=250)

        elif key == 'z':
            thrust(z=-250)

        elif key == 'x':
            thrust(z=250)
        
        else:
            print('Invalid key pressed.\n Control with wasd, qe and zx')
