from parser.parser import parse_line
from detector.detector import detect_attack
import json
import time
import os

log_path = "C:/xampp/apache/logs/access.log"

print("Starting LogLens...")

# Create logs folder automatically
os.makedirs("logs", exist_ok=True)

with open(log_path, "r") as file:

    file.seek(0, 2)

    while True:

        line = file.readline()

        if not line:
            time.sleep(1)
            continue

        parsed = parse_line(line.strip())

        if parsed:

            # Save parsed logs
            with open("logs/output.jsonl", "a") as out:
                out.write(json.dumps(parsed) + "\n")

            # Detect attacks
            attack = detect_attack(parsed)

            if attack:

                print(f"[!] ATTACK DETECTED: {attack['type']}")

                with open("logs/detected.jsonl", "a") as det:
                    det.write(json.dumps(attack) + "\n")

            else:

                print(f"[+] NORMAL: {parsed['path']}")