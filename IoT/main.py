import machine
import network
import time
import onewire
import ds18x20
import urequests
import _thread

motor = machine.Pin(15, machine.Pin.OUT)
air_pump = machine.Pin(5, machine.Pin.OUT)

ds_pin = machine.Pin(14)
ds_sensor = ds18x20.DS18X20(onewire.OneWire(ds_pin))

servo_pin = machine.Pin(4)
servo = machine.PWM(servo_pin)
servo.freq(50)

lat,long = 0,0

API_URL = "https://aqua-safe-six.vercel.app/api/v1/iot/data"  # Replace with actual API URL
def connect_wifi(ssid="freddy", password="123456670"):
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)

    if not wlan.isconnected():
        print("Connecting to Wi-Fi...")
        wlan.connect(ssid, password)

        for _ in range(10): 
            if wlan.isconnected():
                print("Connected to Wi-Fi:", wlan.ifconfig())
                return True
            time.sleep(2)

    print("Failed to connect to Wi-Fi.")
    return False

def steering_angle(angle):
    min_duty = 25  
    max_duty = 125  

    duty = int(min_duty + (angle / 180) * (max_duty - min_duty))
    servo.duty(duty)

def ran_steer():
    for i in (40,120,60,90,120,80,100,30,65,145):
        steering_angle(i)
        time.sleep(1)


# Scan DS18B20 sensor once
roms = ds_sensor.scan()
if roms:
    sensor_rom = roms[0]
else:
    print("No DS18B20 sensor found!")
    sensor_rom = None

def read_temperature():
    if sensor_rom is None:
        return None

    ds_sensor.convert_temp()
    time.sleep_ms(750)
    return ds_sensor.read_temp(sensor_rom)

def move():
    _thread.start_new_thread(ran_steer,())
    motor.on()
    air_pump.value(1)
    time.sleep(10)
    motor.off()
    time.sleep(5)
    air_pump.off()

def post_data(temp = 26):
    try:
        payload = {
            "nitrogen": 0.01,
            "oxygen": 6,
            "phosphorus": 0.1,
            "temp": temp,
            "id" : "2wq50v1uibJm6vnTnT70",
            "location": {
                "latitude" : -12.39,
                "longitude" : 350.67
                }
            }  
        headers = {"Content-Type": "application/json"}
        response = urequests.post(API_URL, json=payload, headers=headers)
        print("Response:", response.status_code)
        if response.status_code == 202:
            move()
    except Exception as e:
        print("Failed to send data:", e)
        
    


if not connect_wifi():
    print("Exiting due to Wi-Fi connection failure.")
    machine.reset()

while True:
    #temp = read_temperature()
    post_data()
   

    time.sleep(2)

