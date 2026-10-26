import { Metadata } from "next";
import QRStudio from "@/components/QRStudio";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Wifi, ShieldCheck, Printer, KeyRound, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { PageFAQ } from "@/components/PageFAQ";
import { PAGE_FAQS } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Wi-Fi QR Code Generator - One-Tap Auto Connect",
  description: "Generate free Wi-Fi QR codes for Airbnb hosts, cafes, and offices. Guests scan to auto-connect without typing complex network passwords.",
  alternates: {
    canonical: "https://qrvibe.online/wifi-qr-code-generator",
  },
  openGraph: {
    images: "/opengraph-image",
    title: "Free Wi-Fi QR Code Generator | Auto Connect Scanner",
    description: "Connect guests instantly to your Wi-Fi network. Scannable by any iOS and Android camera.",
  },
};

export default function WiFiQRPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-4">
            <Wifi className="w-3.5 h-3.5" />
            WIFI:S: protocol (Auto-Join Standard)
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4">
            Free Wi-Fi <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">QR Code Generator</span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Eliminate password typos. Generate clean, high-resolution Wi-Fi QR codes that allow visitors, guests, and customers to connect with a single camera scan.
          </p>
        </div>

        {/* Live Studio pre-selected on Wi-Fi */}
        <div className="mb-20 -mx-4 sm:-mx-6 lg:-mx-8">
          <QRStudio initialContentType="wifi" initialTab="content" />
        </div>

        {/* Deep Dive & High Value SEO Content */}
        <section className="border-t border-slate-800/80 pt-16 mt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No Password Sharing Stress</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Staff don&apos;t have to repeatedly spell out 24-character random passwords or write them on chalkboards. A tabletop acrylic stand lets guests join in 1 second.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
                <Printer className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Print-Ready Vector SVG</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Export directly to SVG or crisp 2048px PNG to print tabletop tent cards, stickers, and guest manuals with zero pixelation or blurry edges.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Password Stays on Your Device</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Your Wi-Fi network SSID and password are never sent over the internet. The standard <code className="text-cyan-400">WIFI:T:WPA;S:...;P:...;;</code> payload is compiled in browser memory.
              </p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto bg-slate-900/30 rounded-3xl p-8 sm:p-10 border border-slate-800/80 mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">
              Best Practices for Printing Wi-Fi QR Codes for Guests
            </h2>
            <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
              <p>
                To guarantee effortless connection across iPhone (iOS 11+) and Android (Android 10+) devices:
              </p>
              <ul className="space-y-2.5 my-4">
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-1" />
                  <span><strong>Choose WPA/WPA2 (Most Common):</strong> 98% of home routers and hotel gateways utilize WPA or WPA2 Personal authentication.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-1" />
                  <span><strong>Hidden Networks:</strong> If your router broadcasts a hidden SSID, ensure the hidden toggle is enabled so phone operating systems initiate active beacon probing.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-1" />
                  <span><strong>Minimum Print Size:</strong> Print your Wi-Fi QR code at a minimum of <strong>30mm x 30mm (1.2 x 1.2 inches)</strong> when placed on tables so phones can focus easily in dim restaurant or bedroom lighting.</span>
                </li>
              </ul>
            </div>
          </div>

          <PageFAQ title="Wi-Fi QR Code FAQ" faqs={PAGE_FAQS.wifi} />

          {/* Quick Links */}
          <div className="text-center">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">Explore More Dedicated Generators</h3>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/qr-code-generator-with-logo" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-all">
                QR Code with Logo <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link href="/whatsapp-qr-code-generator" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-all">
                WhatsApp QR Code <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link href="/qr-code-for-business-cards" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-all">
                Business Card vCard QR <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
