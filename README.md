# 🚨 LogLens - Security Log Analyzer

## About the Project

LogLens is a simple SIEM-lite security project made for analyzing Apache and Nginx server logs.

Normally, web server logs contain thousands of lines, and it becomes very difficult for system administrators to manually find suspicious activities. This project helps automate that process.

The system reads uploaded log files, detects possible cyber attacks using regex patterns, and shows the results on a dashboard with charts and analytics.

This project was built as part of a Security Software Engineering Internship.

---

# Main Features

## Log Parsing

The parser reads Apache/Nginx log files and extracts important details like:

* IP Address
* Timestamp
* HTTP Method
* Request Path
* Status Code
* User Agent

Regex is used to convert raw logs into structured JSON data.

---

## Attack Detection

The system can detect different types of attacks such as:

* SQL Injection
* XSS Attacks
* Directory Traversal
* Command Injection
* File Inclusion
* Brute Force Attempts
* Scanner Bots

Each detected attack is tagged with:

* Attack Type
* Severity
* Source IP
* Time

---

# Dashboard

The React dashboard shows:

* Attack Timeline Graph
* Attack Distribution Pie Chart
* Country-wise Attack Analysis
* Top Attackers Table
* PDF Report Export
* Auto Refresh
* Demo Log Loader

---

# Technologies Used

## Frontend

* React.js
* Recharts

## Backend

* Flask
* Python
* Regex

## Libraries

* flask-cors
* reportlab
* requests

---

# Project Structure

```bash
LOGLENS/
│
├── api.py
├── requirements.txt
├── README.md
│
├── parser/
│   └── parser.py
│
├── detector/
│   └── detector.py
│
├── signatures/
│   └── signatures.json
│
├── logs/
│   ├── sample.log
│   └── detected.jsonl
│
├── uploads/
│
├── frontend/
│   ├── src/
│   └── package.json
```

---

# How to Run the Project

## 1. Clone the Repository

```bash
git clone https://github.com/harkeshstudy01-ux/loglens.git
```

---

## 2. Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 3. Start Backend Server

```bash
python api.py
```

Backend runs on:

```txt
http://127.0.0.1:5000
```

---

## 4. Start Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs on:

```txt
http://localhost:3000
```

---

# Live Links

## Backend

https://loglens-w9cw.onrender.com

## Frontend

npx plugins add vercel/vercel-plugin

---

# Performance Handling

To avoid loading huge log files into memory:

* Logs are processed line-by-line
* Background processing is used
* Auto refresh updates the dashboard every few seconds

This makes the application more efficient for large files.

---

# Future Improvements

Some future upgrades that can be added:

* Real GeoIP integration
* World attack map
* AI-based anomaly detection
* Docker deployment
* Authentication system
* Real-time WebSocket updates

---

# Author

Developed by Harkesh
