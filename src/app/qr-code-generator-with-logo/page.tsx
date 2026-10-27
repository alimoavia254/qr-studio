import { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { QRStudio } from "@/components/QRStudio";
import { ShieldCheck, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = pageMetadata({
  path: "/qr-code-generator-with-logo",
  title: "QR Code Generator with Logo - Free & Scan-Tested",
  description: "Generate custom branded QR codes with your company logo centered. Verified with real-time in-browser computer-vision decoder and Level-H 30% error correction.",
  socialTitle: "QR Code Generator with Logo | Free & Scan-Tested",
  keywords: ["qr code generator with logo", "custom qr code with logo free", "brand qr code generator", "scannable qr code with logo", "high resolution qr code logo"],
});

export default function LogoQRPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Will putting a logo in the center of a QR code prevent it from scanning?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No, provided you use Level-H (High) Reed-Solomon Error Correction, which restores up to 30% of covered or damaged data modules. QR Vibe automatically locks Level-H when a logo is detected.",
        },
      },
      {
        "@type": "Question",
        name: "What is the best logo size for a QR code?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The golden rule is keeping your logo width between 18% and 28% of the total QR code size. Going over 32% risks obstructing the timing patterns and parity modules required by standard smartphone cameras.",
        },
      },
      {
        "@type": "Question",
        name: "Which image format is recommended for the logo?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "PNG or SVG files with transparent backgrounds (alpha channel) produce the crispest results. Square aspect ratios (1:1) look best and avoid distorting the surrounding modules.",
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <JsonLd data={breadcrumbSchema([{ name: "QR Code Generator with Logo", path: "/qr-code-generator-with-logo" }])} />
      <Header />

      <main className="flex-1 pb-16">
        {/* Hero Section */}
        <div className="pt-8 pb-6 px-4 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Centerpiece Logo Integration • Hardware Decoder Verified</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            QR Code Generator <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">With Logo</span>
          </h1>
          <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
            Upload your company emblem or brand icon directly into the center of your QR code.
            Protected by automated 30% Level-H redundancy and verified with our live computer-vision decoder.
          </p>
        </div>

        {/* Interactive Tool with Logo Tab Pre-Selected */}
        <QRStudio initialTab="logo" initialContentType="url" />

        {/* Practical Educational Content (AdSense & SEO Optimized) */}
        <section className="mt-16 max-w-5xl mx-auto px-4 space-y-12">
          {/* Guide Card 1 */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2.5">
              <ShieldCheck className="w-6 h-6 text-indigo-400" />
              The Science of Scannable Logo QR Codes
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Standard QR codes (ISO/IEC 18004) use mathematical <strong>Reed-Solomon Error Correction</strong>.
              When you superimpose a company emblem onto the center of a QR code, you are intentionally obscuring part of the 2D matrix.
              To guarantee that every smartphone camera (Apple Camera, Google Lens, Samsung Scanner, MIUI) reads the code instantly, two critical technical criteria must be met:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm mb-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>1. Automatic Level-H Redundancy</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Level-H stores 30% backup parity data across the surrounding grid. If your logo takes up 20% to 25% of the center, the scanner uses the remaining parity blocks to reconstruct the missing information with zero data loss.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm mb-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>2. Position &amp; Timing Quiet Zones</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The three large square eyes in the corners (Position Detection Patterns) and the alternating black-and-white timing strips must never be covered. Centering the logo keeps these vital optical markers completely untouched.
                </p>
              </div>
            </div>
          </div>

          {/* Guide Card 2: Practical Best Practices */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
            <h2 className="text-xl font-bold text-white mb-4">
              3 Rules for Perfect Logo QR Printing
            </h2>
            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <strong className="text-white block">Maintain Minimum 20mm x 20mm Print Size</strong>
                  For printed business cards, table tents, and flyers, never print your logo QR code smaller than 2cm x 2cm. Budget smartphone camera lenses struggle to resolve microscopic dots with a center badge.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <strong className="text-white block">Use a Transparent PNG or Vector SVG</strong>
                  Logos with non-transparent colored rectangular boxes create harsh visual clutter. Using a transparent PNG or SVG with our &ldquo;Clean background dots&rdquo; toggle ensures maximum elegance.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <strong className="text-white block">High Contrast is Mandatory (4:1 Minimum)</strong>
                  Dark dots on a white or light background provide optical stability under direct sunlight, shadows, and low indoor lighting.
                </div>
              </li>
            </ul>
          </div>

          {/* Quick Links to Other Tools */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-white">Need a specific QR type?</p>
              <p className="text-xs text-slate-400">Explore our specialized generators tailored for messaging and connectivity.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/whatsapp-qr-code-generator"
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors flex items-center gap-1"
              >
                <span>WhatsApp QR</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              <Link
                href="/wifi-qr-code-generator"
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors flex items-center gap-1"
              >
                <span>Wi-Fi QR</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
