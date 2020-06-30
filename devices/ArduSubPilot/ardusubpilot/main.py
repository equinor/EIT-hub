from time import sleep
from ardusubpilot import DeviceController


def quick_test():
    dc = DeviceController()
    print("Controller mode: " + dc.get_flightmode())
    for _i in range(5):
        dc.send_thrust_command(r=200)
        sleep(1)

def keyboard_control():

    dc = DeviceController()

    while True:

        key = input('waiting for command..\n')

        if key == 'w':
            dc.send_thrust_command(x=250)

        elif key == 'a':
            dc.send_thrust_command(y=-250)

        elif key == 's':
            dc.send_thrust_command(x=-250)

        elif key == 'd':
            dc.send_thrust_command(y=250)

        elif key == 'q':
            dc.send_thrust_command(r=-250)

        elif key == 'e':
            dc.send_thrust_command(r=250)

        elif key == 'z':
            dc.send_thrust_command(z=-250)

        elif key == 'x':
            dc.send_thrust_command(z=250)
        
        else:
            print('Invalid key pressed.\n Control with wasd, qe and zx')
