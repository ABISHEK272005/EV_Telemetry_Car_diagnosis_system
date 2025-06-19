import socket
import json
import threading
import time
import requests

# Configuration
PORT1 = 8080
PORT2 = 12345
BUFFER_SIZE = 1024

# Replace with your laptop's actual IP address
LAPTOP_API_URL = "http://192.168.138.39:8000/update"  # Change IP if needed

lock = threading.Lock()

# Shared data structure (optional but useful for merging payloads)
latest_data = {
    "STM32": {},
    "BMP180": {},
    "CH": {}
}

def send_to_laptop(payload):
    try:
        requests.post(LAPTOP_API_URL, json=payload, timeout=1)
    except requests.RequestException as e:
        print(f"❌ Could not send data to laptop: {e}")

# Receiver 1: STM32 & BMP180
def receiver_port1():
    sock1 = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock1.bind(("0.0.0.0", PORT1))
    print(f"Receiver 1 (STM32/BMP180) listening on port {PORT1}")

    while True:
        data, addr = sock1.recvfrom(BUFFER_SIZE)
        decoded = data.decode('utf-8').strip()

        with lock:
            if decoded.startswith('STM32:'):
                try:
                    stm_data = json.loads(decoded[6:].strip())
                    latest_data['STM32'].update(stm_data)
                    send_to_laptop({"STM32": stm_data})
                except json.JSONDecodeError:
                    print(f"❌ Invalid STM32 JSON: {decoded}")

            elif decoded.startswith('BMP180:'):
                try:
                    bmp_data = json.loads(decoded[7:].strip())
                    latest_data['BMP180'].update(bmp_data)
                    send_to_laptop({"BMP180": bmp_data})
                except json.JSONDecodeError:
                    print(f"❌ Invalid BMP180 JSON: {decoded}")

        time.sleep(0.01)

# Receiver 2: CH0/CH1/TEMP/VIB/RPM
def receiver_port2():
    sock2 = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock2.bind(("0.0.0.0", PORT2))
    print(f"Receiver 2 (CH/TEMP/VIB/RPM) listening on port {PORT2}")

    while True:
        data, addr = sock2.recvfrom(BUFFER_SIZE)
        try:
            decoded = data.decode('utf-8').strip()
            sensor_data = json.loads(decoded)
            with lock:
                latest_data['CH'].update(sensor_data)
                send_to_laptop({"CH": sensor_data})
        except (json.JSONDecodeError, UnicodeDecodeError):
            print(f"❌ Invalid JSON on port {PORT2}: {decoded}")
        time.sleep(0.01)

if _name_ == "_main_":
    try:
        threading.Thread(target=receiver_port1, daemon=True).start()
        threading.Thread(target=receiver_port2, daemon=True).start()
        print("🟢 Forwarding sensor data to FastAPI backend at", LAPTOP_API_URL)
        while True:
            time.sleep(10)
    except KeyboardInterrupt:
        print("\n🔴 Stopping sensor forwarder...")