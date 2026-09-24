import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./components/Sidebar";

export const metadata: Metadata = {
  title: "Edumerge Fee System",
  description: "Smart Fee Collection & Reconciliation System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <Sidebar />
          <main style={{ marginLeft: "240px", flex: 1, padding: "32px" }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
