"use client";

import React from "react";
import { QrCode, Heart } from "lucide-react";

export function Footer() {
  const currentYear = 2026;

  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-white tracking-tight">QR Studio</span>
              <p className="text-[11px] text-slate-400">
                Premium Brand QR Code Generator • Free forever
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-slate-400">
            <a href="#generator" className="hover:text-white transition-colors">
              Generator
            </a>
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              FAQ
            </a>
            <span className="text-slate-700">|</span>
            <span className="text-emerald-400 font-medium">No Data Collected</span>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <p>© {currentYear} QR Studio. All rights reserved. Free for commercial & personal use.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with precision for flawless scanning</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline mx-0.5" />
          </div>
        </div>
      </div>
    </footer>
  );
}
