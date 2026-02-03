import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ARPS-CORE — Causal, ROI-Aware Revenue Protection",
  description:
    "The World's First Causal, ROI-Aware Revenue Protection Agent. Explains why revenue is at risk, what action saves the most money, and why that action is compliant.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0a0a0f] text-slate-200 antialiased">
        {children}
      </body>
    </html>
  );
}
