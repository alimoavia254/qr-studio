import { Metadata } from "next";
import QRStudio from "@/components/QRStudio";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Sparkles, Palette, ShieldCheck, Layers, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Custom QR Code Generator - Designer Dots, Corners & Gradients",
  description: "Design custom QR codes with rounded dots, sleek corner eye styles, modern color gradients, and brand frames with instant real-time scan verification.",
  alternates: {
    canonical: "https://qrvibe.online/custom-qr-code-generator",
  },
  openGraph: {
    title: "Custom QR Code Generator | Aesthetic Brand Designer",
    description: "Upgrade from boring square black-and-white barcodes to sleek, custom-designed branded QR codes.",
  },
};

export default function CustomQRPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-purple-500 selection:text-white">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-4">
            <Palette className="w-3.5 h-3.5" />
            Bespoke Aesthetics &amp; Scannable Design
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4">
            Custom <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300">QR Code Generator</span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Move beyond generic black-and-white grids. Customize body dot shapes, eye corners, brand gradients, and call-to-action frames without sacrificing scan reliability.
          </p>
        </div>

        {/* Live Studio pre-selected on Style tab */}
        <div className="mb-20">
          <QRStudio initialContentType="url" initialTab="style" />
        </div>

        {/* Deep Dive & High Value SEO Content */}
        <section className="border-t border-slate-800/80 pt-16 mt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Curated Dot &amp; Eye Geometry</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Choose between rounded dots, classy diamonds, fluid organic shapes, or modern tech squares to reflect your brand identity with visual finesse.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Dual Color Gradient Blends</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Apply linear or radial color transitions. Our built-in contrast meter ensures dark colors stay dark enough for camera sensors to differentiate them from light backgrounds.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Real Hardware Scan Verification</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                As you tweak colors and shapes, our live computer-vision decoder tests your code in real time, calculating latency and confirming 100% scan integrity.
              </p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto bg-slate-900/30 rounded-3xl p-8 sm:p-10 border border-slate-800/80 mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">
              The 3 Golden Rules of Custom QR Code Aesthetics
            </h2>
            <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
              <p>
                Customizing a QR code looks fantastic, but breaking contrast ruins scannability. Keep these rules in mind:
              </p>
              <ul className="space-y-2.5 my-4">
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-purple-400 shrink-0 mt-1" />
                  <span><strong>Maintain 4:1+ Luminance Contrast:</strong> Barcode optical sensors rely on brightness differentials. Always pair dark foregrounds (navy, deep purple, black) with light backgrounds (white, cream, pale gray). Inverted codes (white on black) fail on 35% of Android budget camera lenses.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-purple-400 shrink-0 mt-1" />
                  <span><strong>Preserve the Quiet Zone:</strong> Never crop right up against the edge of the QR matrix. Always leave at least 4 modules worth of empty margin space around the perimeter so camera algorithms can delineate the boundary.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-purple-400 shrink-0 mt-1" />
                  <span><strong>Eye Pattern Integrity:</strong> The three corner squares (Finder Patterns) are what orientation sensors look for first. Keep eye colors deep and sharp for rapid focal lock.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">Explore More Dedicated Generators</h3>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/qr-code-generator-with-logo" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-all">
                QR Code with Logo <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link href="/qr-code-for-business-cards" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-all">
                Business Card vCard QR <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link href="/whatsapp-qr-code-generator" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-all">
                WhatsApp QR Code <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
