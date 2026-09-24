"use client";
import { useEffect, useState } from "react";
import { api } from "@/services/api";

export default function FeeHeadsPage() {
    const [feeHeads, setFeeHeads] = useState<any[]>([]);
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

    const fetchFeeHeads = () => api.getFeeHeads().then(setFeeHeads);

    useEffect(() => { fetchFeeHeads(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        const result = await api.createFeeHead({ name, default_amount: parseFloat(amount) });
        if (result.id) {
            setMessage({ text: `Fee Head "${result.name}" created successfully!`, type: "success" });
            setName("");
            setAmount("");
            fetchFeeHeads();
        } else {
            setMessage({ text: result.detail || "Failed to create fee head.", type: "error" });
        }
        setLoading(false);
    };

    return (
        <div>
            <div style={{ marginBottom: "32px" }}>
                <h1 style={{ fontSize: "28px", fontWeight: "800" }}>📋 Fee Heads</h1>
                <p style={{ color: "var(--text-muted)", marginTop: "6px" }}>Define fee categories like Tuition, Transport, Library</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "24px" }}>
                {/* Add Fee Head Form */}
                <div className="card">
                    <h2 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "20px" }}>Create Fee Head</h2>
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                        <div>
                            <label style={{ fontSize: "13px", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>Fee Name</label>
                            <input
                                id="input-fee-name"
                                className="input-field"
                                type="text"
                                placeholder="e.g. Tuition Fee"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: "13px", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>Default Amount (₹)</label>
                            <input
                                id="input-fee-amount"
                                className="input-field"
                                type="number"
                                placeholder="e.g. 50000"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                min="0"
                                required
                            />
                        </div>
                        {message && (
                            <div style={{
                                padding: "10px 14px", borderRadius: "8px", fontSize: "13px",
                                background: message.type === "success" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                                color: message.type === "success" ? "var(--accent-green)" : "var(--accent-red)"
                            }}>
                                {message.text}
                            </div>
                        )}
                        <button id="btn-add-feehead" className="btn-primary" type="submit" disabled={loading}>
                            {loading ? "Creating..." : "Create Fee Head"}
                        </button>
                    </form>
                </div>

                {/* Fee Heads List */}
                <div className="card">
                    <h2 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "20px" }}>
                        All Fee Heads <span style={{ color: "var(--text-muted)", fontWeight: "400" }}>({feeHeads.length})</span>
                    </h2>
                    {feeHeads.length === 0 ? (
                        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>No fee heads created yet.</p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                            {feeHeads.map((f: any) => (
                                <div key={f.id} style={{
                                    display: "flex", justifyContent: "space-between", alignItems: "center",
                                    padding: "14px", borderRadius: "10px", border: "1px solid var(--border-color)",
                                    marginBottom: "8px", background: "var(--bg-secondary)"
                                }}>
                                    <div>
                                        <div style={{ fontSize: "14px", fontWeight: "600" }}>{f.name}</div>
                                        <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>Fee Head ID: {f.id}</div>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <div style={{ fontSize: "18px", fontWeight: "700", color: "var(--accent-green)" }}>
                                            ₹{f.default_amount.toLocaleString()}
                                        </div>
                                        <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>default amount</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
