import { Header } from "@/components/Header";
import { QRStudio } from "@/components/QRStudio";
import { FeaturesSection } from "@/components/FeaturesSection";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Background ambient gradient glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-indigo-600/15 via-purple-600/15 to-pink-600/10 blur-[130px] rounded-full" />
        <div className="absolute top-[45%] -right-40 w-[500px] h-[400px] bg-indigo-500/10 blur-[140px] rounded-full" />
      </div>

      <Header />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 pt-6 pb-4 sm:pt-10 sm:pb-8 text-center">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
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
        <div id="faq">
          <FAQSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}
