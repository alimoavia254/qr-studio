import React from "react";
import {
  Sparkles,
  ShieldCheck,
  Palette,
  Maximize2,
  FileCheck,
  Zap,
} from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Sparkles,
      title: "Custom Brand Logo Blend",
      description:
        "Upload your company or brand logo. QR Vibe auto-centers and pads it seamlessly without obscuring critical data patterns.",
      color: "from-pink-500 to-rose-500",
    },
    {
      icon: ShieldCheck,
      title: "Scanability Health Engine",
      description:
        "Real-time contrast calculation and automatic Level-H error correction (30% redundancy) ensure your QR scans effortlessly on every smartphone.",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: Palette,
      title: "Designer Gradients & Eyes",
      description:
        "Choose custom linear or radial gradients, sleek rounded or classy dot patterns, and independent corner eye colors.",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: Maximize2,
      title: "Ultra-HD Print Resolution",
      description:
        "Export in up to 2048px Ultra-HD PNG for brochures and billboards, plus sharp SVG vector format for graphic designers.",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: FileCheck,
      title: "Multiple QR Tool Types",
      description:
        "Easily generate standardized QR codes for Website URLs, WhatsApp chats, Wi-Fi connections, digital vCards, and Emails.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Zap,
      title: "100% Client-Side & No Expiry",
      description:
        "Your data and logo never leave your browser. Standard static QR codes never expire and require no recurring subscription.",
      color: "from-violet-500 to-fuchsia-500",
    },
  ];

  return (
    <section className="py-20 bg-slate-950/60 border-t border-slate-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Built For Brands & Creators</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Why QR Vibe Delivers Better Results
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Most online QR generators create boring black-and-white codes or break when you add a logo.
            QR Vibe bridges high-end aesthetics with mathematical scan reliability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="group relative p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/80 transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feat.color} flex items-center justify-center mb-5 shadow-lg opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {feat.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
