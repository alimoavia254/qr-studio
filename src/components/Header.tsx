"use client";

import React from "react";
import { QrCode, Sparkles, ShieldCheck, Download, Smartphone } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <QrCode className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                QR Studio
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Branded & Scannable QR Code Studio
            </p>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="hidden md:flex items-center gap-6 text-xs text-slate-300 font-medium">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Client-Side Safe</span>
          </div>
          <div className="flex items-center gap-1.5 text-indigo-400">
            <Sparkles className="w-4 h-4" />
            <span>Brand Logo Integration</span>
          </div>
          <div className="flex items-center gap-1.5 text-purple-400">
            <Smartphone className="w-4 h-4" />
            <span>Scan-Guaranteed</span>
          </div>
        </div>

        {/* Action / CTA */}
        <div className="flex items-center gap-3">
          <a
            href="#generator"
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Create Free QR</span>
          </a>
        </div>
      </div>
    </header>
  );
}
