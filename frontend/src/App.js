import React, { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar
} from "recharts";

function App() {

  const [attacks, setAttacks] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  // =========================
  // BACKEND URL
  // =========================

  const API_URL = "https://loglens-w9cw.onrender.com";

  // =========================
  // LOAD ATTACKS
  // =========================

  const loadAttacks = () => {

    fetch(`${API_URL}/attacks`)
      .then((res) => res.json())
      .then((data) => {
        setAttacks(data);
      })
      .catch((error) => {
        console.log(error);
      });

  };

  // =========================
  // AUTO REFRESH
  // =========================

  useEffect(() => {

    loadAttacks();

    const interval = setInterval(() => {
      loadAttacks();
    }, 3000);

    return () => clearInterval(interval);

  }, []);

  // =========================
  // FILE UPLOAD
  // =========================

  const uploadFile = async () => {

    if (!selectedFile) {
      alert("Select a log file");
      return;
    }

    const formData = new FormData();

    formData.append("file", selectedFile);

    await fetch(`${API_URL}/upload`, {
      method: "POST",
      body: formData
    });

    alert("Logs analyzed successfully!");

    loadAttacks();
  };

  // =========================
  // TIMELINE GRAPH
  // =========================

  const hourlyCounts = {};

  attacks.forEach((attack) => {

    if (!attack.timestamp) return;

    const hour = attack.timestamp.split(":")[1];

    hourlyCounts[hour] =
      (hourlyCounts[hour] || 0) + 1;

  });

  const timelineData = Object.keys(hourlyCounts).map((hour) => ({
    hour: `${hour}:00`,
    attacks: hourlyCounts[hour]
  }));

  // =========================
  // PIE CHART DATA
  // =========================

  const attackCounts = {};

  attacks.forEach((attack) => {

    attackCounts[attack.type] =
      (attackCounts[attack.type] || 0) + 1;

  });

  const pieData = Object.keys(attackCounts).map((key) => ({
    name: key,
    value: attackCounts[key]
  }));

  const COLORS = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#3b82f6"
  ];

  // =========================
  // TOP ATTACKERS
  // =========================

  const attackerCounts = {};

  attacks.forEach((attack) => {

    attackerCounts[attack.ip] =
      (attackerCounts[attack.ip] || 0) + 1;

  });

  const topAttackers = Object.keys(attackerCounts).map((ip) => ({
    ip,
    count: attackerCounts[ip]
  }));

  // =========================
  // COUNTRY ANALYTICS
  // =========================

  const countryCounts = {};

  attacks.forEach((attack) => {

    const country =
      attack.country || "Unknown";

    countryCounts[country] =
      (countryCounts[country] || 0) + 1;

  });

  const countryData = Object.keys(countryCounts).map((country) => ({
    country,
    attacks: countryCounts[country]
  }));

  // =========================
  // UI
  // =========================

  return (

    <div
      style={{
        background: "#020617",
        minHeight: "100vh",
        color: "white",
        padding: "30px",
        fontFamily: "Arial"
      }}
    >

      <h1 style={{ marginBottom: "30px" }}>
        🚨 LogLens SIEM Dashboard
      </h1>

      {/* ========================= */}
      {/* STATS CARDS */}
      {/* ========================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "30px"
        }}
      >

        <div style={cardStyle}>
          <h2>{attacks.length}</h2>
          <p>Total Attacks</p>
        </div>

        <div style={cardStyle}>
          <h2>{topAttackers.length}</h2>
          <p>Unique Attackers</p>
        </div>

        <div style={cardStyle}>
          <h2>
            {
              attacks.filter(
                (a) => a.severity === "high"
              ).length
            }
          </h2>
          <p>High Severity</p>
        </div>

      </div>

      {/* ========================= */}
      {/* FILE UPLOAD */}
      {/* ========================= */}

      <div style={sectionStyle}>

        <h2>Upload Log File</h2>

        <input
          type="file"
          onChange={(e) =>
            setSelectedFile(e.target.files[0])
          }
        />

        <button
          onClick={uploadFile}
          style={buttonStyle}
        >
          Analyze Logs
        </button>

        {/* ========================= */}
        {/* LOAD DEMO LOG BUTTON */}
        {/* ========================= */}

        <button
          onClick={async () => {

            await fetch(`${API_URL}/demo`);

            alert("Demo log loaded!");

            loadAttacks();

          }}
          style={{
            marginLeft: "15px",
            padding: "10px 20px",
            background: "#3b82f6",
            border: "none",
            borderRadius: "5px",
            color: "white",
            cursor: "pointer"
          }}
        >
          Load Demo Log
        </button>

        {/* ========================= */}
        {/* EXPORT PDF */}
        {/* ========================= */}

        <a
          href={`${API_URL}/export`}
          target="_blank"
          rel="noreferrer"
        >
          <button
            style={{
              marginLeft: "15px",
              padding: "10px 20px",
              background: "#22c55e",
              border: "none",
              borderRadius: "5px",
              color: "white",
              cursor: "pointer"
            }}
          >
            Export PDF Report
          </button>
        </a>

      </div>

      {/* ========================= */}
      {/* CHARTS */}
      {/* ========================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginBottom: "30px"
        }}
      >

        {/* Timeline */}

        <div style={sectionStyle}>

          <h2>Attack Timeline</h2>

          <ResponsiveContainer width="100%" height={300}>

            <LineChart data={timelineData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="hour" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="attacks"
                stroke="#ef4444"
                strokeWidth={3}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

        {/* Pie Chart */}

        <div style={sectionStyle}>

          <h2>Attack Distribution</h2>

          <ResponsiveContainer width="100%" height={300}>

            <PieChart>

              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >

                {pieData.map((entry, index) => (

                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />

                ))}

              </Pie>

              <Tooltip />

              <Legend />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* ========================= */}
      {/* COUNTRY ANALYTICS */}
      {/* ========================= */}

      <div style={sectionStyle}>

        <h2>🌍 Attacks by Country</h2>

        <ResponsiveContainer width="100%" height={300}>

          <BarChart data={countryData}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="country" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="attacks"
              fill="#3b82f6"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

      {/* ========================= */}
      {/* TOP ATTACKERS */}
      {/* ========================= */}

      <div style={sectionStyle}>

        <h2>Top Attackers</h2>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse"
          }}
        >

          <thead>

            <tr>

              <th style={tableHead}>IP Address</th>
              <th style={tableHead}>Attack Count</th>

            </tr>

          </thead>

          <tbody>

            {topAttackers.map((attacker, index) => (

              <tr key={index}>

                <td style={tableCell}>
                  {attacker.ip}
                </td>

                <td style={tableCell}>
                  {attacker.count}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* ========================= */}
      {/* ATTACK LOGS */}
      {/* ========================= */}

      <div style={{ marginTop: "30px" }}>

        <h2>Detected Attacks</h2>

        {attacks.length === 0 ? (

          <p>No attacks detected</p>

        ) : (

          attacks.map((attack, index) => (

            <div
              key={index}
              style={{
                background: "#111827",
                padding: "15px",
                marginBottom: "15px",
                borderRadius: "10px",
                borderLeft:
                  attack.severity === "critical"
                    ? "5px solid red"
                    : attack.severity === "high"
                    ? "5px solid orange"
                    : "5px solid yellow"
              }}
            >

              <p><strong>IP:</strong> {attack.ip}</p>

              <p>
                <strong>Country:</strong>{" "}
                {attack.country || "Unknown"}
              </p>

              <p><strong>Type:</strong> {attack.type}</p>

              <p><strong>Severity:</strong> {attack.severity}</p>

              <p><strong>Path:</strong> {attack.path}</p>

              <p><strong>Time:</strong> {attack.timestamp}</p>

            </div>

          ))

        )}

      </div>

    </div>
  );
}

// =========================
// STYLES
// =========================

const cardStyle = {
  background: "#111827",
  padding: "20px",
  borderRadius: "15px",
  textAlign: "center",
  boxShadow: "0px 0px 10px rgba(0,0,0,0.5)"
};

const sectionStyle = {
  background: "#111827",
  padding: "20px",
  borderRadius: "15px",
  marginTop: "30px"
};

const buttonStyle = {
  marginLeft: "15px",
  padding: "10px 20px",
  background: "#ef4444",
  border: "none",
  borderRadius: "5px",
  color: "white",
  cursor: "pointer"
};

const tableHead = {
  borderBottom: "1px solid gray",
  padding: "10px",
  textAlign: "left"
};

const tableCell = {
  padding: "10px",
  borderBottom: "1px solid #1f2937"
};

export default App;