from time import sleep
from ardusubpilot import DeviceController


def quick_test():
    dc = DeviceController()
    print("Controller mode: " + dc.get_flightmode())
    for _i in range(5):
        dc.send_thrust_command(r=200)
        sleep(1)
