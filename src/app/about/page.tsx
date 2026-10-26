import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Sparkles, Code2, Heart, Award, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | QR Studio PRO - The Private QR Code Platform",
  description: "Learn why we built QR Studio PRO: to free creators from scammy subscription redirects and provide a fast, beautiful, 100% private QR generator.",
  alternates: {
    canonical: "https://qr-studio-rouge-six.vercel.app/about",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
            <Heart className="w-3.5 h-3.5" />
            Our Mission &amp; Principles
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Built for Creators, Not Subscriptions
          </h1>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            We were tired of free QR generators holding restaurant menus and business cards hostage behind sudden $30/month paywalls. So we built a permanent, client-side studio.
          </p>
        </div>

        {/* Narrative & Values */}
        <div className="space-y-12 text-slate-300 leading-relaxed text-sm sm:text-base">
          <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2.5">
              <Sparkles className="w-6 h-6 text-indigo-400" />
              The Problem with Most QR Code Sites
            </h2>
            <p className="mb-4">
              Have you ever printed 5,000 flyers or restaurant menus with a &quot;free&quot; QR generator, only to discover 14 days later that the link stopped working because your trial expired?
            </p>
            <p>
              Many top-ranking search results create redirect URLs that they control. Once printed, you have no choice but to pay their recurring fee or throw away all your printed material.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/30 border border-slate-800/80">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">100% Static &amp; Permanent</h3>
              <p className="text-sm text-slate-400">
                Our generated codes encode your data directly into the matrix. They never go through an intermediary proxy server and will continue scanning indefinitely for life.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/30 border border-slate-800/80">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Hardware-Grade Decoders</h3>
              <p className="text-sm text-slate-400">
                Instead of guessing whether a logo will block scanning, we run the open-source <code className="text-cyan-400">jsQR</code> computer-vision barcode scanner directly inside your browser so you get real-time feedback before printing.
              </p>
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-bold text-white">Ready to create a professional QR code?</h4>
              <p className="text-xs text-slate-400">No account required, no watermarks, unlimited high-res downloads.</p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all"
            >
              Open QR Studio <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
