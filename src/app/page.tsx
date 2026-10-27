import { Header } from "@/components/Header";
import { QRStudio } from "@/components/QRStudio";
import { FeaturesSection } from "@/components/FeaturesSection";
import { PopularGenerators } from "@/components/PopularGenerators";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { HOME_FAQS, SITE_NAME, SITE_URL, faqSchema } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: SITE_URL },
};

const homeSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/icon`,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "WebApplication",
      name: "QR Vibe - Free QR Code Generator With Logo",
      url: SITE_URL,
      applicationCategory: "DesignApplication",
      operatingSystem: "Any (web browser)",
      browserRequirements: "Requires JavaScript",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      featureList: [
        "QR codes with your logo",
        "Website, WhatsApp, Wi-Fi, vCard contact, email and text QR codes",
        "Custom colors, gradients, dot and corner styles",
        "Printable poster frames with call-to-action",
        "Live scan test before download",
        "PNG, JPG and SVG download in HD and print sizes",
        "No sign-up, no watermark, codes never expire",
        "Runs fully in the browser; data is never uploaded",
      ],
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "HowTo",
      name: "How to create a QR code with a logo",
      totalTime: "PT1M",
      step: [
        { "@type": "HowToStep", name: "Choose content", text: "Pick what the QR should open: website, WhatsApp, Wi-Fi, contact, email or text, and fill in the details." },
        { "@type": "HowToStep", name: "Add your logo", text: "Upload your logo in the Logo tab. Error correction switches to high automatically." },
        { "@type": "HowToStep", name: "Style it", text: "Choose colors, dot style, corners or a ready-made theme, and optionally a poster frame." },
        { "@type": "HowToStep", name: "Check and download", text: "Wait for the live scan check to pass, then download as PNG, JPG or SVG." },
      ],
    },
  ],
};

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Background ambient gradient glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full [background:radial-gradient(closest-side,rgba(99,102,241,0.18),rgba(168,85,247,0.08)_55%,transparent)]" />
        <div className="absolute top-[45%] -right-40 w-[700px] h-[600px] rounded-full [background:radial-gradient(closest-side,rgba(99,102,241,0.12),transparent)]" />
      </div>

      <JsonLd data={homeSchema} />
      <JsonLd data={faqSchema(HOME_FAQS)} />
      <Header />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 pt-4 pb-3 sm:pt-10 sm:pb-8 text-center">
          <h1 className="text-xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Free QR Code Generator{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              With Logo
            </span>
          </h1>
          <p className="mt-2 sm:mt-3 text-slate-400 text-sm sm:text-base">
            Add your logo, pick colors, check it scans, then download in HD. No sign-up.
          </p>
        </div>
        <QRStudio />
        <div id="features">
          <FeaturesSection />
        </div>
        <PopularGenerators />
        <div id="faq">
          <FAQSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}
