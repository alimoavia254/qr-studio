"use client";

import React from "react";
import Link from "next/link";
import { QrCode, ShieldCheck, Heart, Sparkles, MessageSquare, Wifi, Palette, Contact, Camera, Star, UtensilsCrossed } from "lucide-react";

export function Footer() {
  const currentYear = 2026;

  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-xs pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 4-column footer */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                <QrCode className="w-4 h-4" />
              </div>
              <span className="text-base font-black text-white tracking-tight">QR Vibe <span className="text-indigo-400 text-xs font-semibold">.ONLINE</span></span>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed">
              Professional, static QR code generator with real-time computer-vision scan validation and 100% private in-browser generation.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              0 bytes sent to external servers
            </div>
          </div>

          {/* Generators */}
          <div>
            <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Dedicated Generators</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/qr-code-generator-with-logo" className="hover:text-white flex items-center gap-2 transition-colors">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> QR Code with Logo
                </Link>
              </li>
              <li>
                <Link href="/free-qr-code-generator-no-expiry" className="hover:text-white flex items-center gap-2 transition-colors">
                  <Sparkles className="w-3.5 h-3.5 text-violet-400" /> QR Codes That Never Expire
                </Link>
              </li>
              <li>
                <Link href="/whatsapp-qr-code-generator" className="hover:text-white flex items-center gap-2 transition-colors">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp QR Code
                </Link>
              </li>
              <li>
                <Link href="/wifi-qr-code-generator" className="hover:text-white flex items-center gap-2 transition-colors">
                  <Wifi className="w-3.5 h-3.5 text-cyan-400" /> Wi-Fi QR Code
                </Link>
              </li>
              <li>
                <Link href="/custom-qr-code-generator" className="hover:text-white flex items-center gap-2 transition-colors">
                  <Palette className="w-3.5 h-3.5 text-purple-400" /> Custom Designer QR
                </Link>
              </li>
              <li>
                <Link href="/instagram-qr-code-generator" className="hover:text-white flex items-center gap-2 transition-colors">
                  <Camera className="w-3.5 h-3.5 text-pink-400" /> Instagram QR Code
                </Link>
              </li>
              <li>
                <Link href="/google-review-qr-code-generator" className="hover:text-white flex items-center gap-2 transition-colors">
                  <Star className="w-3.5 h-3.5 text-yellow-400" /> Google Review QR
                </Link>
              </li>
              <li>
                <Link href="/menu-qr-code-generator" className="hover:text-white flex items-center gap-2 transition-colors">
                  <UtensilsCrossed className="w-3.5 h-3.5 text-orange-400" /> Restaurant Menu QR
                </Link>
              </li>
              <li>
                <Link href="/qr-code-for-business-cards" className="hover:text-white flex items-center gap-2 transition-colors">
                  <Contact className="w-3.5 h-3.5 text-amber-400" /> Business Card vCard
                </Link>
              </li>
            </ul>
          </div>

          {/* Core Features */}
          <div>
            <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Features &amp; Tech</h3>
            <ul className="space-y-2.5 text-slate-400">
              <li>
                <Link href="/#generator" className="hover:text-white transition-colors">
                  Live Hardware Scan Decoder
                </Link>
              </li>
              <li>
                <Link href="/#generator" className="hover:text-white transition-colors">
                  Vector SVG &amp; 2048px PNG Export
                </Link>
              </li>
              <li>
                <Link href="/#generator" className="hover:text-white transition-colors">
                  High Error Correction (Level H)
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-white transition-colors">
                  Free Commercial License
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-white transition-colors">
                  Scannability FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Company */}
          <div>
            <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Company &amp; Legal</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/guides" className="hover:text-white transition-colors">
                  QR Code Guides
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy (GDPR/CCPA)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact &amp; Feedback
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <p>© {currentYear} QR Vibe (qrvibe.online). All rights reserved. Made for creators, businesses &amp; agencies worldwide.</p>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Client-side optical verification</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline mx-0.5" />
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
