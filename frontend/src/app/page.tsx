"use client";
import { useEffect, useState } from "react";
import { api } from "@/services/api";

export default function Dashboard() {
  const [students, setStudents] = useState<any[]>([]);
  const [feeHeads, setFeeHeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getStudents(), api.getFeeHeads()])
      .then(([s, f]) => { setStudents(s); setFeeHeads(f); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: "calc(100vh - 64px)" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "800", color: "var(--text-primary)" }}>
          Dashboard
        </h1>
        <p style={{ color: "var(--text-muted)", marginTop: "6px" }}>
          Welcome to Edumerge Fee Collection System
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "32px" }}>
        <div className="card">
          <div style={{ color: "var(--text-muted)", fontSize: "13px", fontWeight: "600", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Total Students
          </div>
          <div className="stat-number">{loading ? "..." : students.length}</div>
          <div style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "8px" }}>Registered in system</div>
        </div>

        <div className="card">
          <div style={{ color: "var(--text-muted)", fontSize: "13px", fontWeight: "600", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Fee Categories
          </div>
          <div className="stat-number">{loading ? "..." : feeHeads.length}</div>
          <div style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "8px" }}>Active fee heads</div>
        </div>

        <div className="card">
          <div style={{ color: "var(--text-muted)", fontSize: "13px", fontWeight: "600", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            System Status
          </div>
          <div style={{ fontSize: "2rem", fontWeight: "800", color: "var(--accent-green)" }}>● Live</div>
          <div style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "8px" }}>Backend connected</div>
        </div>
      </div>

      {/* Quick Info */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {/* Recent Students */}
        <div className="card">
          <h2 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "16px" }}>🎓 Recent Students</h2>
          {loading ? (
            <p style={{ color: "var(--text-muted)" }}>Loading...</p>
          ) : students.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>No students added yet.</p>
          ) : (
            students.slice(-5).reverse().map((s: any) => (
              <div key={s.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border-color)" }}>
                <span style={{ fontSize: "14px" }}>{s.name}</span>
                <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>{s.roll_number}</span>
              </div>
            ))
          )}
        </div>

        {/* Fee Heads */}
        <div className="card">
          <h2 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "16px" }}>📋 Fee Categories</h2>
          {loading ? (
            <p style={{ color: "var(--text-muted)" }}>Loading...</p>
          ) : feeHeads.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>No fee heads added yet.</p>
          ) : (
            feeHeads.map((f: any) => (
              <div key={f.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border-color)" }}>
                <span style={{ fontSize: "14px" }}>{f.name}</span>
                <span style={{ fontSize: "13px", color: "var(--accent-green)", fontWeight: "600" }}>₹{f.default_amount.toLocaleString()}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
