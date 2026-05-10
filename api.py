from flask import Flask, jsonify, request, send_file
from flask_cors import CORS

from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer
)

from reportlab.lib.styles import getSampleStyleSheet

import json
import os
import uuid
import threading

from parser.parser import parse_log
from detector.detector import detect_attack

app = Flask(__name__)

CORS(app)

# =========================
# JOB STORAGE
# =========================

jobs = {}

# =========================
# LOAD ATTACKS
# =========================

@app.route("/attacks")
def get_attacks():

    attacks = []

    file_path = "logs/detected.jsonl"

    if os.path.exists(file_path):

        with open(file_path, "r") as file:

            for line in file:

                try:
                    attacks.append(json.loads(line))
                except:
                    pass

    return jsonify(attacks)

# =========================
# BACKGROUND LOG PROCESSING
# =========================

def process_logs(filepath, job_id):

    jobs[job_id]["status"] = "processing"

    detected_file = "logs/detected.jsonl"

    with open(filepath, "r", encoding="utf-8") as file:

        for line in file:

            parsed = parse_log(line)

            if parsed:

                attack = detect_attack(parsed)

                if attack:

                    with open(
                        detected_file,
                        "a",
                        encoding="utf-8"
                    ) as out:

                        out.write(
                            json.dumps(attack) + "\n"
                        )

    jobs[job_id]["status"] = "completed"

# =========================
# FILE UPLOAD
# =========================

@app.route("/upload", methods=["POST"])
def upload_file():

    if "file" not in request.files:

        return jsonify({
            "error": "No file uploaded"
        }), 400

    file = request.files["file"]

    upload_folder = "uploads"

    os.makedirs(upload_folder, exist_ok=True)

    filepath = os.path.join(
        upload_folder,
        file.filename
    )

    file.save(filepath)

    # Create Job ID
    job_id = str(uuid.uuid4())

    jobs[job_id] = {
        "status": "queued"
    }

    # Background thread
    thread = threading.Thread(
        target=process_logs,
        args=(filepath, job_id)
    )

    thread.start()

    return jsonify({
        "job_id": job_id,
        "status": "processing"
    })

# =========================
# JOB STATUS
# =========================

@app.route("/status/<job_id>")
def job_status(job_id):

    job = jobs.get(job_id)

    if not job:

        return jsonify({
            "error": "Job not found"
        }), 404

    return jsonify(job)

# =========================
# PDF EXPORT
# =========================

@app.route("/export")
def export_report():

    attacks = []

    file_path = "logs/detected.jsonl"

    if os.path.exists(file_path):

        with open(file_path, "r") as file:

            for line in file:

                try:
                    attacks.append(json.loads(line))
                except:
                    pass

    pdf_path = "security_report.pdf"

    doc = SimpleDocTemplate(pdf_path)

    styles = getSampleStyleSheet()

    elements = []

    title = Paragraph(
        "LogLens Security Report",
        styles['Title']
    )

    elements.append(title)

    elements.append(Spacer(1, 20))

    summary = Paragraph(
        f"Total Detected Attacks: {len(attacks)}",
        styles['Heading2']
    )

    elements.append(summary)

    elements.append(Spacer(1, 20))

    for attack in attacks:

        text = f"""
        <b>IP:</b> {attack.get('ip')}<br/>
        <b>Country:</b> {attack.get('country', 'Unknown')}<br/>
        <b>Type:</b> {attack.get('type')}<br/>
        <b>Severity:</b> {attack.get('severity')}<br/>
        <b>Path:</b> {attack.get('path')}<br/>
        <b>Timestamp:</b> {attack.get('timestamp')}<br/><br/>
        """

        elements.append(
            Paragraph(text, styles['BodyText'])
        )

        elements.append(Spacer(1, 12))

    doc.build(elements)

    return send_file(
        pdf_path,
        as_attachment=True
    )

# =========================
# HOME ROUTE
# =========================

@app.route("/")
def home():

    return jsonify({
        "message": "LogLens API Running"
    })

# =========================
# RUN SERVER
# =========================

if __name__ == "__main__":

    app.run(debug=True)