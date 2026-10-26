import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Scale, CheckCircle2, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | QR Vibe",
  description: "Terms and conditions of use for QR Vibe free online QR code generation utilities.",
  alternates: {
    canonical: "https://qrvibe.online/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
            <Scale className="w-3.5 h-3.5" />
            Terms &amp; Acceptable Usage
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Terms of Service
          </h1>
          <p className="text-slate-400 text-sm">
            Last Updated: October 2026
          </p>
        </div>

        <div className="prose prose-invert prose-slate max-w-none space-y-8 text-sm sm:text-base text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Agreement to Terms</h2>
            <p>
              By accessing or using QR Vibe (<code className="text-indigo-400">qrvibe.online</code>), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you disagree with any part of these terms, you may not access our service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              2. Commercial &amp; Personal License
            </h2>
            <p>
              All QR codes generated through QR Vibe are 100% free for both personal and commercial use without royalty fees, attribution requirements, or forced subscription renewals. You retain full ownership and intellectual property rights over any logos and content you encode into your QR images.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              3. Prohibited Uses
            </h2>
            <p>You agree not to use QR Vibe to generate codes for:</p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-400 my-2">
              <li>Phishing schemes, malware distribution, or deceptive social engineering URLs.</li>
              <li>Harassment, illicit content, or illegal activities in your local jurisdiction.</li>
              <li>Attempting to disrupt or overwhelm our web delivery infrastructure.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Disclaimer of Warranty &amp; Print Verification</h2>
            <p>
              While QR Vibe includes real-time computer-vision scan validation (<code className="text-slate-200">jsQR</code>) to assist in creating readable designs, real-world scannability depends on factors beyond our control, including physical print ink saturation, paper finish (glossy vs. matte), ambient lighting, and individual camera hardware capabilities. <strong>Users must test-scan physical test prints with multiple smartphone models before executing large commercial print runs.</strong>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Modifications to Service</h2>
            <p>
              We reserve the right to modify, replace, or discontinue our tool at any time without notice. We are not liable to you or any third party for modifications or suspension of the service.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
