"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, ChevronDown, Sparkles, MessageSquare, Wifi, Palette, Contact, Menu, X, Layers, ScanLine, MessageCircle, MapPin, CalendarDays, Share2 } from "lucide-react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdown, setToolsDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 lg:h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center group" aria-label="QR Vibe home">
          <Image
            src="/brand/logo-horizontal-dark.png"
            alt="QR Vibe"
            width={484}
            height={120}
            priority
            className="h-9 lg:h-11 w-auto group-hover:scale-[1.03] transition-transform"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs text-slate-300 font-medium">
          {/* Tools Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setToolsDropdown(true)}
            onMouseLeave={() => setToolsDropdown(false)}
          >
            <button className="flex items-center gap-1.5 py-2 hover:text-white transition-colors cursor-pointer">
              <span>QR Tools</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${toolsDropdown ? "rotate-180" : ""}`} />
            </button>

            {toolsDropdown && (
              <div className="absolute top-full left-0 w-64 pt-2 shadow-2xl z-50 max-h-[80vh] overflow-y-auto">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-xl backdrop-blur-xl space-y-1">
                  <Link
                    href="/qr-code-generator-with-logo"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold">QR Code with Logo</div>
                      <div className="text-[10px] text-slate-500">Center brand logo with safe margin</div>
                    </div>
                  </Link>

                  <Link
                    href="/whatsapp-qr-code-generator"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold">WhatsApp QR Code</div>
                      <div className="text-[10px] text-slate-500">Direct wa.me chat opener</div>
                    </div>
                  </Link>

                  <Link
                    href="/wifi-qr-code-generator"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                  >
                    <Wifi className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold">Wi-Fi QR Code</div>
                      <div className="text-[10px] text-slate-500">Instant one-tap network join</div>
                    </div>
                  </Link>

                  <Link
                    href="/custom-qr-code-generator"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                  >
                    <Palette className="w-4 h-4 text-purple-400 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold">Custom Designer QR</div>
                      <div className="text-[10px] text-slate-500">Dots, eyes &amp; modern gradients</div>
                    </div>
                  </Link>

                  <Link
                    href="/qr-code-for-business-cards"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                  >
                    <Contact className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold">Business Card vCard</div>
                      <div className="text-[10px] text-slate-500">Direct contact phone book saver</div>
                    </div>
                  </Link>

                  <Link
                    href="/bulk-qr-code-generator"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                  >
                    <Layers className="w-4 h-4 text-fuchsia-400 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold">Bulk QR Generator</div>
                      <div className="text-[10px] text-slate-500">Up to 200 codes in one ZIP</div>
                    </div>
                  </Link>

                  <Link
                    href="/qr-code-scanner"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                  >
                    <ScanLine className="w-4 h-4 text-lime-400 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold">QR Code Scanner</div>
                      <div className="text-[10px] text-slate-500">Scan by camera or image</div>
                    </div>
                  </Link>

                  <Link
                    href="/sms-qr-code-generator"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-sky-400 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold">SMS QR Code</div>
                      <div className="text-[10px] text-slate-500">Pre-filled text message</div>
                    </div>
                  </Link>

                  <Link
                    href="/location-qr-code-generator"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-red-400 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold">Location QR Code</div>
                      <div className="text-[10px] text-slate-500">Open Google Maps pin</div>
                    </div>
                  </Link>

                  <Link
                    href="/event-qr-code-generator"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                  >
                    <CalendarDays className="w-4 h-4 text-teal-400 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold">Calendar Event QR</div>
                      <div className="text-[10px] text-slate-500">Add to calendar in one tap</div>
                    </div>
                  </Link>

                  <Link
                    href="/social-media-qr-code-generator"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                  >
                    <Share2 className="w-4 h-4 text-green-400 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold">Social Media QR</div>
                      <div className="text-[10px] text-slate-500">Instagram, TikTok, Facebook</div>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link href="/guides" className="hover:text-white transition-colors">
            Guides
          </Link>
          <Link href="/about" className="hover:text-white transition-colors">
            About Us
          </Link>
          <Link href="/privacy-policy" className="hover:text-white transition-colors">
            Privacy
          </Link>
          <Link href="/contact" className="hover:text-white transition-colors">
            Contact
          </Link>

          <div className="flex items-center gap-1.5 text-emerald-400 pl-2 border-l border-slate-800">
            <ShieldCheck className="w-4 h-4" />
            <span>100% In-Browser</span>
          </div>
        </nav>

        {/* Action / CTA + Mobile Menu Button */}
        <div className="flex items-center gap-3">
          <Link
            href="/#generator"
            className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Create QR</span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute inset-x-0 top-full bg-slate-950 border-b border-slate-800 px-4 py-4 space-y-3 shadow-2xl max-h-[calc(100vh-3.5rem)] overflow-y-auto">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2">Dedicated Generators</div>
          <div className="grid grid-cols-1 gap-1">
            <Link
              href="/qr-code-generator-with-logo"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-3 rounded-lg hover:bg-slate-900 text-sm text-slate-300 hover:text-white flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> QR Code with Logo
            </Link>
            <Link
              href="/whatsapp-qr-code-generator"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-3 rounded-lg hover:bg-slate-900 text-sm text-slate-300 hover:text-white flex items-center gap-2"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp QR Code
            </Link>
            <Link
              href="/wifi-qr-code-generator"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-3 rounded-lg hover:bg-slate-900 text-sm text-slate-300 hover:text-white flex items-center gap-2"
            >
              <Wifi className="w-3.5 h-3.5 text-cyan-400" /> Wi-Fi QR Code
            </Link>
            <Link
              href="/custom-qr-code-generator"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-3 rounded-lg hover:bg-slate-900 text-sm text-slate-300 hover:text-white flex items-center gap-2"
            >
              <Palette className="w-3.5 h-3.5 text-purple-400" /> Custom Designer QR
            </Link>
            <Link
              href="/qr-code-for-business-cards"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-3 rounded-lg hover:bg-slate-900 text-sm text-slate-300 hover:text-white flex items-center gap-2"
            >
              <Contact className="w-3.5 h-3.5 text-amber-400" /> Business Card vCard
            </Link>
            <Link
              href="/bulk-qr-code-generator"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-3 rounded-lg hover:bg-slate-900 text-sm text-slate-300 hover:text-white flex items-center gap-2"
            >
              <Layers className="w-3.5 h-3.5 text-fuchsia-400" /> Bulk QR Generator
            </Link>
            <Link
              href="/qr-code-scanner"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-3 rounded-lg hover:bg-slate-900 text-sm text-slate-300 hover:text-white flex items-center gap-2"
            >
              <ScanLine className="w-3.5 h-3.5 text-lime-400" /> QR Code Scanner
            </Link>
            <Link
              href="/sms-qr-code-generator"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-3 rounded-lg hover:bg-slate-900 text-sm text-slate-300 hover:text-white flex items-center gap-2"
            >
              <MessageCircle className="w-3.5 h-3.5 text-sky-400" /> SMS QR Code
            </Link>
            <Link
              href="/location-qr-code-generator"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-3 rounded-lg hover:bg-slate-900 text-sm text-slate-300 hover:text-white flex items-center gap-2"
            >
              <MapPin className="w-3.5 h-3.5 text-red-400" /> Location QR Code
            </Link>
            <Link
              href="/event-qr-code-generator"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-3 rounded-lg hover:bg-slate-900 text-sm text-slate-300 hover:text-white flex items-center gap-2"
            >
              <CalendarDays className="w-3.5 h-3.5 text-teal-400" /> Calendar Event QR
            </Link>
            <Link
              href="/social-media-qr-code-generator"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-3 rounded-lg hover:bg-slate-900 text-sm text-slate-300 hover:text-white flex items-center gap-2"
            >
              <Share2 className="w-3.5 h-3.5 text-green-400" /> Social Media QR
            </Link>
          </div>

          <div className="border-t border-slate-800 pt-3 flex flex-wrap gap-x-5 gap-y-2 px-2 text-sm text-slate-400">
            <Link href="/guides" onClick={() => setMobileMenuOpen(false)} className="hover:text-white">Guides</Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="hover:text-white">About</Link>
            <Link href="/privacy-policy" onClick={() => setMobileMenuOpen(false)} className="hover:text-white">Privacy</Link>
            <Link href="/terms" onClick={() => setMobileMenuOpen(false)} className="hover:text-white">Terms</Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-white">Contact</Link>
          </div>
        </div>
      )}
    </header>
  );
}
export default Header;
