"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname();

    const navItems = [
        { href: "/", label: "📊 Dashboard", id: "nav-dashboard" },
        { href: "/students", label: "🎓 Students", id: "nav-students" },
        { href: "/fee-heads", label: "📋 Fee Heads", id: "nav-feeheads" },
        { href: "/invoices", label: "🧾 Invoices", id: "nav-invoices" },
        { href: "/payments", label: "💳 Payments", id: "nav-payments" },
    ];

    return (
        <aside style={{
            width: "240px",
            background: "var(--bg-card)",
            borderRight: "1px solid var(--border-color)",
            padding: "24px 16px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            position: "fixed",
            height: "100vh",
            top: 0,
            left: 0
        }}>
            <div style={{ marginBottom: "32px", padding: "0 8px" }}>
                <div style={{
                    fontSize: "20px", fontWeight: "800",
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
                }}>
                    💰 Edumerge
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
                    Fee Management System
                </div>
            </div>

            {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        id={item.id}
                        style={{
                            display: "block",
                            padding: "12px 16px",
                            borderRadius: "10px",
                            textDecoration: "none",
                            fontWeight: isActive ? "700" : "500",
                            fontSize: "14px",
                            transition: "all 0.2s ease",
                            background: isActive ? "rgba(99,102,241,0.15)" : "transparent",
                            color: isActive ? "#a5b4fc" : "var(--text-muted)",
                            borderLeft: isActive ? "3px solid #6366f1" : "3px solid transparent",
                        }}
                    >
                        {item.label}
                    </Link>
                );
            })}
        </aside>
    );
}
