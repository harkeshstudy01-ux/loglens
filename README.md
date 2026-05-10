# 🚨 LogLens – Security Log Analysis & SIEM Lite

## 📖 Introduction

Modern web servers generate thousands or even millions of log entries every day.  
Hidden inside these logs can be attack attempts such as SQL Injection, XSS, brute force login attempts, and directory traversal attacks.

Analyzing these logs manually is difficult and time-consuming.

**LogLens** is a lightweight SIEM-like (Security Information and Event Management) tool built to solve this problem.  
The system automatically parses Apache/Nginx logs, detects suspicious activity using regex-based attack signatures, and visualizes the results through an interactive dashboard.

This project was developed as a Security Software Engineering internship project focused on:
- Log parsing
- Threat detection
- Security analytics
- Dashboard visualization
- Backend optimization

---

# 🎯 Project Goals

The main objective of LogLens is to help system administrators and security analysts quickly answer:

- Who is attacking the server?
- What type of attack is being used?
- When did the attack happen?
- How severe is the attack?
- Which countries are attacks coming from?

---

# ⚡ Core Features

## 🔍 Log Parser Engine

The parser supports Apache and Nginx Common Log Format (CLF).

It extracts important fields from raw logs including:

- IP Address
- Timestamp
- HTTP Method
- Request Path
- Status Code
- Referrer
- User Agent

The parser processes logs line-by-line for efficient handling of large files.

---

## 🛡️ Threat Detection Engine

LogLens uses regex-based signatures to detect multiple types of web attacks.

### Supported Attack Types

- SQL Injection (SQLi)
- Cross Site Scripting (XSS)
- Directory Traversal
- Command Injection
- File Inclusion
- Remote Code Execution (RCE)
- SSRF (Server-Side Request Forgery)
- Brute Force Login Attempts
- Scanner/Bot Detection

Each detected attack is automatically tagged with:
- Attack type
- Severity level
- Source IP
- Timestamp
- Request path

---

# 📊 Dashboard & Visualization

The frontend dashboard provides real-time attack analytics using React.js and Recharts.

### Dashboard Features

- 📈 Attack Timeline Graph
- 🥧 Attack Distribution Pie Chart
- 🌍 Country-wise Attack Analytics
- 🧑‍💻 Top Attackers Table
- 🚨 Severity-based Highlighting
- 🔄 Live Auto Refresh
- 📄 PDF Report Export

---

# ⚙️ Backend Features

The backend is built using Flask and includes:

- REST API architecture
- Background log processing
- Async upload handling
- File upload support
- JSONL-based attack storage
- Job status tracking
- PDF report generation

---

# 🧰 Technologies Used

## Frontend
- React.js
- Recharts

## Backend
- Python
- Flask
- Regular Expressions (Regex)

## Additional Libraries
- flask-cors
- requests
- reportlab

---

# 📂 Project Structure

```bash
LOGLENS/
│
├── api.py
├── main.py
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

# 🚀 Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone YOUR_GITHUB_REPO_LINK
```

---

## 2️⃣ Install Python Dependencies

```bash
pip install -r requirements.txt
```

---

## 3️⃣ Start Backend Server

```bash
python api.py
```

Backend runs on:

```txt
http://127.0.0.1:5000
```

---

## 4️⃣ Start Frontend

```bash
cd frontend
npm start
```

Frontend runs on:

```txt
http://localhost:3000
```

---

# 📌 How LogLens Works

### Step 1
User uploads a log file.

### Step 2
Backend parses logs line-by-line.

### Step 3
Threat detection engine scans requests using attack signatures.

### Step 4
Detected attacks are stored in JSONL format.

### Step 5
Dashboard visualizes attack statistics and analytics.

---

# 📈 Example Detection Workflow

```txt
Raw Log
   ↓
Parser Engine
   ↓
Structured JSON
   ↓
Threat Detection
   ↓
Attack Classification
   ↓
Dashboard Visualization
```

---

# 🔮 Future Improvements

Some planned improvements for future versions:

- Real GeoIP database integration
- Interactive world attack map
- AI-based anomaly detection
- WebSocket real-time streaming
- Docker container deployment
- User authentication system
- Cloud deployment support

---

# 👨‍💻 Author

Developed by Harkesh

Security Software Engineering Project