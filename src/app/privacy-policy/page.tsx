import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ShieldCheck, Lock, EyeOff, ServerOff, FileCheck } from "lucide-react";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/privacy-policy",
  title: "Privacy Policy - 100% In-Browser Privacy",
  description: "Learn how QR Vibe protects your privacy with 100% client-side QR code generation. Zero server uploads, zero database storage.",
});

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified Client-Side Architecture
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Privacy Policy
          </h1>
          <p className="text-slate-400 text-sm">
            Last Updated: October 2026 &bull; Effective Immediately
          </p>
        </div>

        {/* Highlights Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
            <ServerOff className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-sm font-semibold text-white">0 Bytes to Servers</h2>
              <p className="text-xs text-slate-400 mt-1">Your logos and text are rendered locally inside HTML5 Canvas.</p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
            <Lock className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-sm font-semibold text-white">No Database Storage</h2>
              <p className="text-xs text-slate-400 mt-1">We do not operate backend user accounts or store created codes.</p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
            <EyeOff className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-sm font-semibold text-white">Zero Tracking Cookies</h2>
              <p className="text-xs text-slate-400 mt-1">Clean session management with no invasive cross-site profiling.</p>
            </div>
          </div>
        </div>

        {/* Legal Text Content */}
        <div className="prose prose-invert prose-slate max-w-none space-y-8 text-sm sm:text-base text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-indigo-400" />
              1. Our Foundational Privacy Promise
            </h2>
            <p>
              At QR Vibe (accessible from <code className="text-indigo-400">qrvibe.online</code>), the privacy of our visitors is of paramount importance. This document explains the exact technical mechanisms and data policies governing your use of our platform.
            </p>
            <p className="mt-2">
              Unlike legacy QR generators that route your data through intermediary tracking servers, <strong>QR Vibe executes 100% of QR code compilation and image encoding in your local browser&apos;s memory</strong>. When you input a Wi-Fi password, paste a vCard contact, type a message, or upload a custom company logo, that information is processed directly by client-side JavaScript (<code className="text-slate-200">qr-code-styling</code> and <code className="text-slate-200">jsQR</code>) without ever being transmitted to our web servers or any remote storage facility.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Information We Do NOT Collect</h2>
            <ul className="list-disc list-inside space-y-1.5 text-slate-400">
              <li>We do <strong>not</strong> collect or store the URLs, Wi-Fi credentials, emails, or text entered into the generator.</li>
              <li>We do <strong>not</strong> transmit or retain images, logos, or brand marks uploaded via the drag-and-drop studio.</li>
              <li>We do <strong>not</strong> require user registration, passwords, credit card numbers, or physical billing addresses to use our tools.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Log Files &amp; Hosting Infrastructure</h2>
            <p>
              Like most web hosts, our hosting provider (Vercel Inc.) maintains standard access logs when your browser requests web assets (HTML, CSS, JS bundles). These logs include internet protocol (IP) addresses, browser type, internet service provider (ISP), date/time stamps, and referring/exit pages. This data is not linked to any personally identifiable information and is utilized strictly for system uptime, DDOS mitigation, and CDN performance monitoring.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Third-Party Advertising &amp; Google AdSense</h2>
            <p>
              QR Vibe may display non-intrusive advertisements served by third-party ad networks, including Google AdSense, to support free development and hosting costs.
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-400 my-3">
              <li>Google, as a third-party vendor, uses cookies to serve ads on our site.</li>
              <li>Google&apos;s use of advertising cookies enables it and its partners to serve ads to users based on their visit to our sites and/or other sites on the Internet.</li>
              <li>Users may opt out of personalized advertising by visiting <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Google Ads Settings</a> or through <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">aboutads.info</a>.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. GDPR &amp; CCPA Compliance</h2>
            <p>
              Under General Data Protection Regulation (GDPR) and California Consumer Privacy Act (CCPA), users possess rights including the right to know, delete, and prevent the sale of personal data. Because QR Vibe does not gather or retain personal data or sell user information to data brokers, our service by design satisfies the highest standard of data minimization.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Contact Information</h2>
            <p>
              If you have any questions or require more information regarding our Privacy Policy, please reach out through our <a href="/contact" className="text-indigo-400 hover:underline">Contact Page</a>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
