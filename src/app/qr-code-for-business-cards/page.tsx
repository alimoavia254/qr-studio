import { Metadata } from "next";
import QRStudio from "@/components/QRStudio";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Contact, CreditCard, ShieldCheck, Printer, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "QR Code Generator for Business Cards (vCard 3.0 / Digital Card)",
  description: "Create professional vCard QR codes for physical business cards. One scan lets clients instantly save your phone number, email, company, and portfolio.",
  alternates: {
    canonical: "https://qrvibe.online/qr-code-for-business-cards",
  },
  openGraph: {
    title: "Business Card QR Code Generator | vCard Digital Contact",
    description: "Generate print-ready vCard QR codes for your paper business cards. Works natively with iOS Contacts and Android Google Contacts.",
  },
};

export default function BusinessCardQRPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-white">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-4">
            <Contact className="w-3.5 h-3.5" />
            Standard vCard 3.0 Protocol
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4">
            QR Code Generator for <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Business Cards</span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Never lose a networking connection to a lost paper card. Turn your physical business card into an interactive digital handshake that saves directly into your client&apos;s phone contacts.
          </p>
        </div>

        {/* Live Studio pre-selected on vCard */}
        <div className="mb-20 -mx-4 sm:-mx-6 lg:-mx-8">
          <QRStudio initialContentType="vcard" initialTab="content" />
        </div>

        {/* Deep Dive & High Value SEO Content */}
        <section className="border-t border-slate-800/80 pt-16 mt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Native Address Book Integration</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Scanning the vCard immediately displays the &quot;Add to Contacts&quot; prompt on iOS and Android. Name, title, phone, email, and website populate cleanly into their native address book.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center mb-4">
                <Printer className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Print Resolution Guide (300 DPI)</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Standard business cards are 3.5&quot; x 2.0&quot;. We provide ultra-crisp vector SVG exports and high-resolution 2048px PNGs ready for MOO, VistaPrint, and local offset commercial printing.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Static &amp; Permanent</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Our generated vCard QR codes are 100% static. They do not rely on a redirect URL or recurring monthly subscription. Your card will continue scanning forever without expiring.
              </p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto bg-slate-900/30 rounded-3xl p-8 sm:p-10 border border-slate-800/80 mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">
              Essential Print Dimensions for Business Card QR Codes
            </h2>
            <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
              <p>
                Because vCard payloads contain more text characters than simple URLs (first name, last name, phone, email, organization), the QR code has a denser module density:
              </p>
              <ul className="space-y-2.5 my-4">
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                  <span><strong>Minimum Physical Size:</strong> Print your vCard QR code at <strong>at least 20mm x 20mm (0.8 x 0.8 inches)</strong>. Printing smaller than 18mm can cause budget smartphone lenses to struggle to focus on individual dots.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                  <span><strong>Only Include Essential Fields:</strong> Avoid stuffing physical home address or paragraphs into the contact card. Keeping fields focused (Full Name, Phone, Email, Website) keeps the QR code cleaner and easier to scan from further away.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                  <span><strong>Back of Card Placement:</strong> For maximum scannability and clean card aesthetics, place the QR code on the back side of the business card alongside a clear prompt like <em>&quot;Scan with camera to save contact info&quot;</em>.</span>
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
              <Link href="/custom-qr-code-generator" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-all">
                Custom QR Code Generator <ArrowRight className="w-3.5 h-3.5" />
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
