#Playing with the enviro module (copy paste + some custom code) 


import time
import colorsys
import ST7735
import sys
import logging

from bme280 import BME280
from PIL import Image
from PIL import ImageDraw
from PIL import ImageFont
from fonts.ttf import RobotoMedium as UserFont

logging.basicConfig(
    format='%(asctime)s.%(msecs)03d %(levelname)-8s %(message)s',
    level=logging.INFO,
    datefmt='%Y-%m-%d %H:%M:%S')


bme280 = BME280()

disp = ST7735.ST7735(
    port=0,
    cs=1,
    dc=9,
    backlight=12,
    rotation=270,
    spi_speed_hz=10000000
)

disp.begin()

WIDTH = disp.width
HEIGHT = disp.height

img = Image.new('RGB', (WIDTH, HEIGHT), color=(0, 0, 0))
draw = ImageDraw.Draw(img)
font_size = 18
font = ImageFont.truetype(UserFont, font_size)

back_colour = (0, 170, 0)
colour = (255, 255, 255)

def get_cpu_temperature():
    with open("/sys/class/thermal/thermal_zone0/temp", "r") as f:
        temp = f.read()
        temp = int(temp) / 1000.0
    return temp



# Tuning factor for compensation. Decrease this number to adjust the
# temperature down, and increase to adjust up
factor = 1.5 
cpu_temps = [get_cpu_temperature()] * 5

#Graph data
dot_pos = [0]*161


while True:
    cpu_temp = get_cpu_temperature()
    # Smooth out with some averaging to decrease jitter
    cpu_temps = cpu_temps[1:] + [cpu_temp]
    avg_cpu_temp = sum(cpu_temps) / float(len(cpu_temps))
    raw_temp = bme280.get_temperature()
    comp_temp = raw_temp - ((avg_cpu_temp - raw_temp) / factor)
    temprature = "Temp: {:.2f} *C".format(comp_temp)
    logging.info(temprature)

    #On LCD in text
    draw.rectangle((0, 0, WIDTH, HEIGHT/4), back_colour)
    draw.text((0, 0), temprature, font=font, fill=colour)
    disp.display(img)
    
    

    #My own graph code

    #Shifting left
    dot_pos = dot_pos[1:] + dot_pos[:1]
    #New temp to the right of the screen
    dot_pos[160] = round(comp_temp*10 - 220) #Tweaking the response and offset on the graph (Range approx 22-27C in this case)

    draw.rectangle((0, HEIGHT/4, WIDTH, HEIGHT),(0,0,0)) #Reseting so we don't get any overlap
    for i in range(WIDTH):
        draw.rectangle((i, HEIGHT - dot_pos[i], i + 1, HEIGHT - dot_pos[i] + 1), colour) #Printing line with dot_pos as Y data
    #THIS GRAPH IS NOT ACCURATE, shape only  
    
    time.sleep(1.0)
    
      

   