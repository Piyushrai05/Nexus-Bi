"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight, ShieldCheck, Activity } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-background/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 font-bold text-foreground tracking-tight group">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black flex items-center justify-center text-sm shadow-md shadow-blue-500/25 transition-transform group-hover:scale-105">
            N
          </div>
          <span className="text-base font-bold tracking-tight text-white">NEXUS <span className="text-blue-500">BI</span></span>
          <span className="hidden sm:inline-block px-2.5 py-0.5 text-[10px] font-mono font-semibold tracking-wider rounded-full bg-blue-950/60 border border-blue-800/60 text-blue-400">
            ENTERPRISE
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-wider uppercase text-slate-300">
          <a href="#features" className="hover:text-blue-400 transition-colors duration-200">
            Features
          </a>
          <a href="#workflow" className="hover:text-blue-400 transition-colors duration-200">
            Architecture
          </a>
          <a href="#demo" className="hover:text-blue-400 transition-colors duration-200">
            Telemetry
          </a>
          <a href="#faq" className="hover:text-blue-400 transition-colors duration-200">
            Governance
          </a>
          <Link href="/dashboard" className="text-blue-400 hover:text-blue-300 transition-colors duration-200 font-mono normal-case text-sm font-medium">
            Command Center →
          </Link>
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/data"
            className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700/80 hover:border-slate-600 transition-all duration-200"
          >
            Explore Data Hub
          </Link>
          <Link
            href="/dashboard"
            className="btn-primary-glow inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-500/30 transition-all duration-200 active:scale-95"
          >
            <span>Launch Demo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg border border-slate-800 bg-slate-900 text-foreground"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 py-4 space-y-3">
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-300 py-1"
          >
            Features
          </a>
          <a
            href="#workflow"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-300 py-1"
          >
            Architecture
          </a>
          <a
            href="#demo"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-300 py-1"
          >
            Telemetry
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-300 py-1"
          >
            Governance
          </a>
          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <Link
              href="/data"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 text-xs font-medium text-slate-300 border border-slate-700 rounded-lg"
            >
              Explore Data Hub
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg shadow-sm"
            >
              Launch Demo
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
