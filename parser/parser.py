import re

# Apache/Nginx Common Log Format regex

pattern = r'([\da-fA-F\.:]+) - - \[(.*?)\] "(GET|POST|PUT|DELETE|HEAD|OPTIONS|PATCH) (.*?) HTTP.*" (\d+) .* "(.*?)" "(.*?)"'

def parse_log(line):

    try:

        match = re.match(pattern, line)

        if not match:
            return None

        return {

            "ip": match.group(1),

            "timestamp": match.group(2),

            "method": match.group(3),

            "path": match.group(4),

            "status": int(match.group(5)),

            "referrer": match.group(6),

            "user_agent": match.group(7)

        }

    except Exception as e:

        print(f"[PARSER ERROR] {e}")

        return None