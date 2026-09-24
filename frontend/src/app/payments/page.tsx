"use client";
import { useEffect, useState } from "react";
import { api } from "@/services/api";

export default function PaymentsPage() {
    const [students, setStudents] = useState<any[]>([]);
    const [invoices, setInvoices] = useState<any[]>([]);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [selectedStudentId, setSelectedStudentId] = useState("");
    const [invoiceId, setInvoiceId] = useState("");
    const [amountPaid, setAmountPaid] = useState("");
    const [gatewayRef, setGatewayRef] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

    useEffect(() => { api.getStudents().then(setStudents); }, []);

    const handleStudentChange = async (id: string) => {
        setSelectedStudentId(id);
        setInvoiceId("");
        setInvoices([]);
        if (id) {
            const result = await api.getStudentInvoices(parseInt(id));
            setInvoices(result.filter((inv: any) => inv.outstanding_amount > 0));
        }
    };

    const handleInvoiceChange = async (id: string) => {
        setInvoiceId(id);
        if (id) {
            const txns = await api.getInvoiceTransactions(parseInt(id));
            setTransactions(txns);
        }
    };

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        const ref = gatewayRef || `TXN-${Date.now()}`;
        const result = await api.makePayment({
            invoice_id: parseInt(invoiceId),
            amount_paid: parseFloat(amountPaid),
            gateway_reference: ref,
        });
        if (result.id) {
            setMessage({ text: `✅ Payment of ₹${parseFloat(amountPaid).toLocaleString()} recorded successfully! Ref: ${result.gateway_reference}`, type: "success" });
            setAmountPaid("");
            setGatewayRef("");
            handleInvoiceChange(invoiceId);
            handleStudentChange(selectedStudentId);
        } else {
            setMessage({ text: result.detail || "Payment failed.", type: "error" });
        }
        setLoading(false);
    };

    const selectedInvoice = invoices.find((inv: any) => inv.id === parseInt(invoiceId));

    return (
        <div>
            <div style={{ marginBottom: "32px" }}>
                <h1 style={{ fontSize: "28px", fontWeight: "800" }}>💳 Payments</h1>
                <p style={{ color: "var(--text-muted)", marginTop: "6px" }}>Process fee payments and view transaction history</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                {/* Payment Form */}
                <div className="card">
                    <h2 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "20px" }}>Make a Payment</h2>
                    <form onSubmit={handlePayment} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                        <div>
                            <label style={{ fontSize: "13px", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>Select Student</label>
                            <select id="select-pay-student" className="input-field" value={selectedStudentId} onChange={e => handleStudentChange(e.target.value)} required>
                                <option value="">-- Choose Student --</option>
                                {students.map((s: any) => (
                                    <option key={s.id} value={s.id}>{s.name} ({s.roll_number})</option>
                                ))}
                            </select>
                        </div>

                        {invoices.length > 0 && (
                            <div>
                                <label style={{ fontSize: "13px", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>Select Invoice</label>
                                <select id="select-pay-invoice" className="input-field" value={invoiceId} onChange={e => handleInvoiceChange(e.target.value)} required>
                                    <option value="">-- Choose Invoice --</option>
                                    {invoices.map((inv: any) => (
                                        <option key={inv.id} value={inv.id}>
                                            Invoice #{inv.id} — Outstanding: ₹{inv.outstanding_amount.toLocaleString()}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {selectedStudentId && invoices.length === 0 && (
                            <div style={{ padding: "12px", borderRadius: "8px", background: "rgba(16,185,129,0.1)", color: "var(--accent-green)", fontSize: "13px" }}>
                                ✅ This student has no outstanding invoices!
                            </div>
                        )}

                        {selectedInvoice && (
                            <div style={{ padding: "12px", borderRadius: "8px", background: "var(--bg-secondary)", border: "1px solid var(--border-color)", fontSize: "13px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ color: "var(--text-muted)" }}>Total Amount:</span>
                                    <span style={{ fontWeight: "600" }}>₹{selectedInvoice.total_amount.toLocaleString()}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
                                    <span style={{ color: "var(--text-muted)" }}>Outstanding:</span>
                                    <span style={{ fontWeight: "700", color: "var(--accent-yellow)" }}>₹{selectedInvoice.outstanding_amount.toLocaleString()}</span>
                                </div>
                            </div>
                        )}

                        {invoiceId && (
                            <>
                                <div>
                                    <label style={{ fontSize: "13px", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>Amount to Pay (₹)</label>
                                    <input id="input-pay-amount" className="input-field" type="number" placeholder="Enter amount" value={amountPaid}
                                        onChange={e => setAmountPaid(e.target.value)} max={selectedInvoice?.outstanding_amount} min="1" required />
                                </div>
                                <div>
                                    <label style={{ fontSize: "13px", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>Gateway Reference (optional)</label>
                                    <input id="input-gateway-ref" className="input-field" type="text" placeholder="e.g. UPI-REF-12345" value={gatewayRef}
                                        onChange={e => setGatewayRef(e.target.value)} />
                                </div>
                            </>
                        )}

                        {message && (
                            <div style={{
                                padding: "10px 14px", borderRadius: "8px", fontSize: "13px",
                                background: message.type === "success" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                                color: message.type === "success" ? "var(--accent-green)" : "var(--accent-red)"
                            }}>{message.text}</div>
                        )}

                        {invoiceId && (
                            <button id="btn-make-payment" className="btn-primary" type="submit" disabled={loading}>
                                {loading ? "Processing..." : "💳 Pay Now"}
                            </button>
                        )}
                    </form>
                </div>

                {/* Transaction History */}
                <div className="card">
                    <h2 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "20px" }}>Transaction History</h2>
                    {transactions.length === 0 ? (
                        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Select an invoice to view its transactions.</p>
                    ) : (
                        transactions.map((t: any) => (
                            <div key={t.id} style={{
                                padding: "14px", borderRadius: "10px", border: "1px solid var(--border-color)",
                                marginBottom: "10px", background: "var(--bg-secondary)"
                            }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                                    <span style={{ fontWeight: "700", color: "var(--accent-green)", fontSize: "16px" }}>
                                        ₹{t.amount_paid.toLocaleString()}
                                    </span>
                                    <span className="badge-success">✅ Success</span>
                                </div>
                                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                                    <div>Ref: {t.gateway_reference || "N/A"}</div>
                                    <div>Date: {new Date(t.transaction_date).toLocaleString()}</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
