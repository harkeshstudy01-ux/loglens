import json
from urllib.parse import unquote
from collections import defaultdict

# Load signatures
with open("signatures/signatures.json", "r") as file:
    signatures = json.load(file)

# Brute force tracker
failed_logins = defaultdict(int)

# Severity map
severity_map = {
    "sql_injection": "high",
    "xss": "medium",
    "dir_traversal": "high",
    "brute_force": "critical"
}

def detect_attack(log):

    # Decode URL attacks
    path = unquote(log["path"]).lower()

    print("DECODED PATH:", path)

    # Signature-based detection
    for attack_type, patterns in signatures.items():

        for pattern in patterns:

            if pattern.lower() in path:

                return {
                    "ip": log["ip"],
                    "type": attack_type,
                    "severity": severity_map.get(attack_type, "low"),
                    "path": path,
                    "timestamp": log["timestamp"]
                }

    # Brute force detection
    if log["status"] == 401:

        failed_logins[log["ip"]] += 1

        if failed_logins[log["ip"]] >= 5:

            return {
                "ip": log["ip"],
                "type": "brute_force",
                "severity": severity_map["brute_force"],
                "path": path,
                "timestamp": log["timestamp"]
            }

    return None