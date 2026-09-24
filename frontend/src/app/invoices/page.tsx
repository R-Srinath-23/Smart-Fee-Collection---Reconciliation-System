"use client";
import { useEffect, useState } from "react";
import { api } from "@/services/api";

export default function InvoicesPage() {
    const [students, setStudents] = useState<any[]>([]);
    const [feeHeads, setFeeHeads] = useState<any[]>([]);
    const [invoices, setInvoices] = useState<any[]>([]);
    const [studentId, setStudentId] = useState("");
    const [feeHeadId, setFeeHeadId] = useState("");
    const [amount, setAmount] = useState("");
    const [searchId, setSearchId] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

    useEffect(() => {
        api.getStudents().then(setStudents);
        api.getFeeHeads().then(setFeeHeads);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        const result = await api.createInvoice({
            student_id: parseInt(studentId),
            fee_head_id: parseInt(feeHeadId),
            total_amount: parseFloat(amount),
        });
        if (result.id) {
            setMessage({ text: `Invoice #${result.id} created successfully!`, type: "success" });
            setAmount("");
        } else {
            setMessage({ text: result.detail || "Failed to create invoice.", type: "error" });
        }
        setLoading(false);
    };

    const handleSearch = async () => {
        if (!searchId) return;
        const result = await api.getStudentInvoices(parseInt(searchId));
        setInvoices(result);
    };

    const getStatusBadge = (status: string) => {
        if (status === "SUCCESS") return <span className="badge-success">✅ Paid</span>;
        if (status === "FAILED") return <span className="badge-failed">❌ Failed</span>;
        return <span className="badge-pending">⏳ Pending</span>;
    };

    return (
        <div>
            <div style={{ marginBottom: "32px" }}>
                <h1 style={{ fontSize: "28px", fontWeight: "800" }}>🧾 Invoices</h1>
                <p style={{ color: "var(--text-muted)", marginTop: "6px" }}>Generate and view student invoices</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "24px", marginBottom: "24px" }}>
                {/* Create Invoice */}
                <div className="card">
                    <h2 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "20px" }}>Generate Invoice</h2>
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                        <div>
                            <label style={{ fontSize: "13px", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>Select Student</label>
                            <select id="select-student" className="input-field" value={studentId} onChange={e => setStudentId(e.target.value)} required>
                                <option value="">-- Choose Student --</option>
                                {students.map((s: any) => (
                                    <option key={s.id} value={s.id}>{s.name} ({s.roll_number})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={{ fontSize: "13px", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>Select Fee Head</label>
                            <select id="select-feehead" className="input-field" value={feeHeadId} onChange={e => setFeeHeadId(e.target.value)} required>
                                <option value="">-- Choose Fee Head --</option>
                                {feeHeads.map((f: any) => (
                                    <option key={f.id} value={f.id}>{f.name} (₹{f.default_amount.toLocaleString()})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={{ fontSize: "13px", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>Total Amount (₹)</label>
                            <input id="input-invoice-amount" className="input-field" type="number" placeholder="e.g. 50000" value={amount} onChange={e => setAmount(e.target.value)} min="0" required />
                        </div>
                        {message && (
                            <div style={{
                                padding: "10px 14px", borderRadius: "8px", fontSize: "13px",
                                background: message.type === "success" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                                color: message.type === "success" ? "var(--accent-green)" : "var(--accent-red)"
                            }}>{message.text}</div>
                        )}
                        <button id="btn-create-invoice" className="btn-primary" type="submit" disabled={loading}>
                            {loading ? "Generating..." : "Generate Invoice"}
                        </button>
                    </form>
                </div>

                {/* Search Invoices */}
                <div className="card">
                    <h2 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "20px" }}>View Student Invoices</h2>
                    <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                        <select id="select-search-student" className="input-field" value={searchId} onChange={e => setSearchId(e.target.value)}>
                            <option value="">-- Select Student --</option>
                            {students.map((s: any) => (
                                <option key={s.id} value={s.id}>{s.name} ({s.roll_number})</option>
                            ))}
                        </select>
                        <button id="btn-search-invoice" className="btn-primary" onClick={handleSearch} style={{ whiteSpace: "nowrap" }}>
                            Search
                        </button>
                    </div>

                    {invoices.length === 0 ? (
                        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Select a student to view their invoices.</p>
                    ) : (
                        invoices.map((inv: any) => (
                            <div key={inv.id} style={{
                                padding: "14px", borderRadius: "10px", border: "1px solid var(--border-color)",
                                marginBottom: "10px", background: "var(--bg-secondary)"
                            }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                    <span style={{ fontWeight: "600", fontSize: "14px" }}>Invoice #{inv.id}</span>
                                    {getStatusBadge(inv.status)}
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "var(--text-muted)" }}>
                                    <span>Total: <strong style={{ color: "var(--text-primary)" }}>₹{inv.total_amount.toLocaleString()}</strong></span>
                                    <span>Outstanding: <strong style={{ color: "var(--accent-yellow)" }}>₹{inv.outstanding_amount.toLocaleString()}</strong></span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
