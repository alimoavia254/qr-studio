import { Metadata } from "next";
import Link from "next/link";
import { BookOpen, ArrowRight, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { GUIDES } from "@/lib/guides";
import { SITE_URL, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/guides",
  title: "QR Code Guides - Sizes, Menus, Error Correction & Safety",
  description:
    "Practical QR code guides: print sizes, static vs dynamic codes, menu QR codes, error correction, scanning on iPhone and Android, and avoiding QR scams.",
});

export default function GuidesPage() {
  const listSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "QR Code Guides",
    url: `${SITE_URL}/guides`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: GUIDES.map((g, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/guides/${g.slug}`,
        name: g.title,
      })),
    },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <JsonLd data={listSchema} />
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            Guides
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">QR Code Guides</h1>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Clear, practical answers for businesses, designers and everyday users: how big to print, which type to use, and how to keep people safe.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {GUIDES.map((g) => (
            <Link
              key={g.slug}
              href={`/guides/${g.slug}`}
              className="group p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-indigo-500/40 transition-colors flex flex-col"
            >
              <h2 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">{g.title}</h2>
              <p className="text-sm text-slate-400 leading-relaxed mb-4 flex-1">{g.excerpt}</p>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> {g.readMinutes} min read
                </span>
                <span className="inline-flex items-center gap-1 text-indigo-400 font-semibold">
                  Read guide <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
