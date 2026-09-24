"use client";
import { useEffect, useState } from "react";
import { api } from "@/services/api";

export default function StudentsPage() {
    const [students, setStudents] = useState<any[]>([]);
    const [name, setName] = useState("");
    const [rollNumber, setRollNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

    const fetchStudents = () => {
        api.getStudents().then(setStudents);
    };

    useEffect(() => { fetchStudents(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        const result = await api.createStudent({ name, roll_number: rollNumber });
        if (result.id) {
            setMessage({ text: `Student "${result.name}" added successfully!`, type: "success" });
            setName("");
            setRollNumber("");
            fetchStudents();
        } else {
            setMessage({ text: result.detail || "Failed to add student.", type: "error" });
        }
        setLoading(false);
    };

    return (
        <div>
            <div style={{ marginBottom: "32px" }}>
                <h1 style={{ fontSize: "28px", fontWeight: "800" }}>🎓 Students</h1>
                <p style={{ color: "var(--text-muted)", marginTop: "6px" }}>Manage registered students</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "24px" }}>
                <div className="card">
                    <h2 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "20px" }}>Add New Student</h2>
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                        <div>
                            <label style={{ fontSize: "13px", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>Full Name</label>
                            <input id="input-student-name" className="input-field" type="text" placeholder="e.g. John Doe"
                                value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                        <div>
                            <label style={{ fontSize: "13px", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>Roll Number</label>
                            <input id="input-roll-number" className="input-field" type="text" placeholder="e.g. CS2024001"
                                value={rollNumber} onChange={e => setRollNumber(e.target.value)} required />
                        </div>
                        {message && (
                            <div style={{
                                padding: "10px 14px", borderRadius: "8px", fontSize: "13px",
                                background: message.type === "success" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                                color: message.type === "success" ? "var(--accent-green)" : "var(--accent-red)"
                            }}>{message.text}</div>
                        )}
                        <button id="btn-add-student" className="btn-primary" type="submit" disabled={loading}>
                            {loading ? "Adding..." : "Add Student"}
                        </button>
                    </form>
                </div>

                <div className="card">
                    <h2 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "20px" }}>
                        All Students <span style={{ color: "var(--text-muted)", fontWeight: "400" }}>({students.length})</span>
                    </h2>
                    {students.length === 0 ? (
                        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>No students registered yet.</p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                            {students.map((s: any) => (
                                <div key={s.id} style={{
                                    display: "flex", justifyContent: "space-between", alignItems: "center",
                                    padding: "12px", borderRadius: "8px", transition: "background 0.15s ease"
                                }}
                                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                                >
                                    <div>
                                        <div style={{ fontSize: "14px", fontWeight: "600" }}>{s.name}</div>
                                        <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>ID: {s.id}</div>
                                    </div>
                                    <span style={{
                                        background: "rgba(99,102,241,0.15)", color: "#a5b4fc",
                                        borderRadius: "20px", padding: "4px 12px", fontSize: "12px", fontWeight: "600"
                                    }}>{s.roll_number}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}