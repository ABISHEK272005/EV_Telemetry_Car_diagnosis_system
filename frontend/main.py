import socket
import json
import threading
import time
import requests
import re

# Ports & Buffer
PORT1 = 8080     # STM32 + BMP180
PORT2 = 12345    # CH/TEMP/VIB/RPM
BUFFER_SIZE = 1024

# Your FastAPI endpoint
LAPTOP_API_URL = "https://ev-telemetry-car-diagnosis-system.onrender.com/update"

lock = threading.Lock()
latest_data = {
    "STM32": {},
    "BMP180": {},
    "CH": {}
}

def send_to_laptop(payload):
    try:
        res = requests.post(LAPTOP_API_URL, json=payload, timeout=1)
        print(f"✅ Sent to laptop: {res.status_code}")
    except requests.RequestException as e:
        print(f"❌ Could not send data to laptop: {e}")

def parse_stm32_data(raw: str):
    """
    Parse lines like:
      STM32:Accel: X=0.37g, Y=0.06g, Z=-1.95g
      STM32:Gyro: X=-3.74/s, Y=0.38/s, Z=-0.89/s
      STM32:----------ACCIDENT DETECTED---------------
    Returns a dict or None.
    """
    content = raw[len("STM32:"):].strip()
    if not content:
        return None

    # Separator-only lines (many dashes)
    if re.fullmatch(r"-{3,}", content):
        return None

    # Strict accident detection: only dashes + phrase + dashes
    if re.fullmatch(r"-+ACCIDENT DETECTED-+", content):
        return {"ACCIDENT_DETECTED": True}

    # Accel parsing
    if content.startswith("Accel:"):
        try:
            parts = content[len("Accel:"):].split(',')
            x = float(parts[0].split('=')[1].replace('g', '').strip())
            y = float(parts[1].split('=')[1].replace('g', '').strip())
            z = float(parts[2].split('=')[1].replace('g', '').strip())
            return {"Accel": {"X": x, "Y": y, "Z": z}}
        except Exception as e:
            print(f"❌ Accel parse error: {content} -> {e}")
            return None

    # Gyro parsing
    if content.startswith("Gyro:"):
        try:
            parts = content[len("Gyro:"):].split(',')
            x = float(parts[0].split('=')[1].replace('/s', '').strip())
            y = float(parts[1].split('=')[1].replace('/s', '').strip())
            z = float(parts[2].split('=')[1].replace('/s', '').strip())
            return {"Gyro": {"X": x, "Y": y, "Z": z}}
        except Exception as e:
            print(f"❌ Gyro parse error: {content} -> {e}")
            return None

    # Anything else we don’t recognize
    return None

def receiver_port1():
    sock1 = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock1.bind(("0.0.0.0", PORT1))
    print(f"Receiver 1 (STM32/BMP180) listening on port {PORT1}")

    while True:
        data, _ = sock1.recvfrom(BUFFER_SIZE)
        decoded = data.decode('utf-8', errors='ignore').strip()

        with lock:
            if decoded.startswith('STM32:'):
                parsed = parse_stm32_data(decoded)
                if parsed:
                    # If not an accident event, explicitly set to False
                    if 'ACCIDENT_DETECTED' not in parsed:
                        parsed['ACCIDENT_DETECTED'] = False

                    latest_data["STM32"].update(parsed)
                    print("[STM32]", parsed)
                    send_to_laptop({"STM32": parsed})
                else:
                    print(f"❌ Ignored STM32 line: {decoded}")

            elif decoded.startswith('BMP180:'):
                try:
                    bmp_data = json.loads(decoded[len("BMP180:"):].strip())
                    latest_data["BMP180"].update(bmp_data)
                    print("[BMP180]", bmp_data)
                    send_to_laptop({"BMP180": bmp_data})
                except json.JSONDecodeError:
                    print(f"❌ Invalid BMP180 JSON: {decoded}")

        time.sleep(0.01)

def receiver_port2():
    sock2 = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock2.bind(("0.0.0.0", PORT2))
    print(f"Receiver 2 (CH/TEMP/VIB/RPM) listening on port {PORT2}")

    while True:
        data, _ = sock2.recvfrom(BUFFER_SIZE)
        decoded = data.decode('utf-8', errors='ignore').strip()
        try:
            sensor_data = json.loads(decoded)
            with lock:
                latest_data['CH'].update(sensor_data)
                print("[CH]", sensor_data)
                send_to_laptop({"CH": sensor_data})
        except json.JSONDecodeError:
            print(f"❌ Invalid JSON on port {PORT2}: {decoded}")

        time.sleep(0.01)

if __name__ == "__main__":
    threading.Thread(target=receiver_port1, daemon=True).start()
    threading.Thread(target=receiver_port2, daemon=True).start()
    print("🟢 Forwarding sensor data to FastAPI backend at", LAPTOP_API_URL)
    try:
        while True:
            time.sleep(10)
    except KeyboardInterrupt:
        print("\n🔴 Stopping sensor forwarder...")