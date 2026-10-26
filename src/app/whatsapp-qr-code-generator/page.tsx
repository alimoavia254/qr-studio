import { Metadata } from "next";
import QRStudio from "@/components/QRStudio";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MessageSquare, ShieldCheck, Zap, Smartphone, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { PageFAQ } from "@/components/PageFAQ";
import { PAGE_FAQS } from "@/lib/seo";

export const metadata: Metadata = {
  title: "WhatsApp QR Code Generator - Direct Chat Link (No Contact Save)",
  description: "Create direct-to-chat WhatsApp QR codes with pre-filled custom messages. Fast, free, scannable by any mobile camera, with 100% private in-browser generation.",
  alternates: {
    canonical: "https://qrvibe.online/whatsapp-qr-code-generator",
  },
  openGraph: {
    images: "/opengraph-image",
    title: "Free WhatsApp QR Code Generator | Instant Chat Opener",
    description: "Generate WhatsApp QR codes that open direct chats without forcing customers to save your number first.",
  },
};

export default function WhatsAppQRPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4">
            <MessageSquare className="w-3.5 h-3.5" />
            Direct wa.me Instant Protocol
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4">
            Free WhatsApp <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">QR Code Generator</span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Create high-conversion WhatsApp QR codes that instantly open a direct chat with your pre-filled inquiry message — no contact saving required.
          </p>
        </div>

        {/* Live Studio pre-selected on WhatsApp */}
        <div className="mb-20 -mx-4 sm:-mx-6 lg:-mx-8">
          <QRStudio initialContentType="whatsapp" initialTab="content" />
        </div>

        {/* Deep Dive & High Value SEO Content */}
        <section className="border-t border-slate-800/80 pt-16 mt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Zero Friction Inquiries</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Customers abandon 70% of outreach when forced to add a phone number to their contacts. Our standard <code className="text-emerald-400">https://wa.me/</code> link opens WhatsApp natively on iOS and Android with one camera tap.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Automated Pre-filled Text</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Pre-populate the customer&apos;s composer with greeting templates like <em>&quot;Hi! I am interested in table reservation #12&quot;</em> or <em>&quot;Product SKU inquiry&quot;</em> so all they do is tap Send.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">100% Client-Side Private</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Your customer contact numbers and business messages are never transmitted to our servers or stored in third-party analytics. Everything renders in your browser memory.
              </p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto bg-slate-900/30 rounded-3xl p-8 sm:p-10 border border-slate-800/80 mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">
              How to Format WhatsApp Numbers for 100% Global Scannability
            </h2>
            <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
              <p>
                When creating a WhatsApp QR code, phone number formatting is critical. The international <code className="text-emerald-400">E.164 standard</code> ensures the WhatsApp mobile app recognizes the destination country correctly from any network worldwide:
              </p>
              <ul className="space-y-2.5 my-4">
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                  <span><strong>Include Country Code:</strong> For United States / Canada use <code className="text-slate-200">1XXXXXXXXXX</code>, for UK use <code className="text-slate-200">44XXXXXXXXXX</code>, for Pakistan use <code className="text-slate-200">92XXXXXXXXXX</code>.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                  <span><strong>Omit Leading Zeroes &amp; Plus Signs:</strong> Never add <code className="text-rose-400">+</code>, dashes, spaces, or parenthesized area codes. For example, use <code className="text-emerald-400">14155552671</code> instead of <code className="text-rose-400">+1 (415) 555-2671</code>.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                  <span><strong>Automatic URL-Encoding:</strong> QR Vibe automatically URL-encodes spaces and special characters inside your pre-filled message body so it never breaks camera decoders.</span>
                </li>
              </ul>
            </div>
          </div>

          <PageFAQ title="WhatsApp QR Code FAQ" faqs={PAGE_FAQS.whatsapp} />

          {/* Quick Links to other generators */}
          <div className="text-center">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">Explore More Dedicated Generators</h3>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/qr-code-generator-with-logo" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-all">
                QR Code with Logo <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link href="/wifi-qr-code-generator" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-all">
                Wi-Fi QR Code Generator <ArrowRight className="w-3.5 h-3.5" />
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
