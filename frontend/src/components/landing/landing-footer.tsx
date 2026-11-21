"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowUpRight } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-16 text-sm text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3 font-bold text-white text-base tracking-tight">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black flex items-center justify-center text-sm shadow-md shadow-blue-500/25">
                N
              </div>
              <span>NEXUS <span className="text-blue-500">BI</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Unified Business &amp; Social Decision Intelligence. Explain why, predict what&apos;s next, and recommend what to do with evidence you can trust.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Deterministic Auditing</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider font-mono">
              Product
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors">
                  Executive Command Center
                </Link>
              </li>
              <li>
                <Link href="/data" className="text-slate-400 hover:text-white transition-colors">
                  Data Hub &amp; Quality Audit
                </Link>
              </li>
              <li>
                <Link href="/social" className="text-slate-400 hover:text-white transition-colors">
                  Social Intelligence
                </Link>
              </li>
              <li>
                <Link href="/analyst" className="text-slate-400 hover:text-white transition-colors">
                  AI Decision Analyst
                </Link>
              </li>
              <li>
                <Link href="/forecasting" className="text-slate-400 hover:text-white transition-colors">
                  Predictive Horizons
                </Link>
              </li>
            </ul>
          </div>

          {/* Architecture Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider font-mono">
              Architecture
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="text-slate-400">Embedded DuckDB Engine</li>
              <li className="text-slate-400">Deterministic Semantic Schema</li>
              <li className="text-slate-400">5-Dimension Quality Engine</li>
              <li className="text-slate-400">Evidence Drawer Audit Trail</li>
              <li className="text-slate-400">Groq LLM Decision Scientist</li>
            </ul>
          </div>

          {/* Security & Verification */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider font-mono">
              Security &amp; Cloud
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="text-slate-400">Firebase Auth &amp; Google SSO</li>
              <li className="text-slate-400">Multi-Tenant Firestore Vault</li>
              <li className="text-slate-400">Render Zero-Downtime Blueprint</li>
              <li className="text-slate-400">Zero Hallucination SQL Sandbox</li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} NEXUS BI Enterprise Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="text-slate-400">Deterministic Analytics</span>
            <span className="text-slate-400">DuckDB In-Memory</span>
            <span className="text-emerald-400">Zero-Hallucination</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
