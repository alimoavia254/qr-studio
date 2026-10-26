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
