import type React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle, type LucideIcon } from "lucide-react";
import { QRStudio } from "@/components/QRStudio";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageFAQ } from "@/components/PageFAQ";
import { JsonLd } from "@/components/JsonLd";
import type { QRContentType } from "@/types/qr";
import { SITE_URL, breadcrumbSchema, type Faq } from "@/lib/seo";

export type UseCaseFeature = { icon: LucideIcon; title: string; text: string };

export interface UseCasePageProps {
  path: string;
  /** Which QR type the generator opens on. Defaults to a website link. */
  contentType?: QRContentType;
  /** Replaces the QR generator with another tool (scanner, bulk generator). */
  tool?: React.ReactNode;
  badgeIcon: LucideIcon;
  badge: string;
  titleLead: string;
  titleAccent: string;
  intro: string;
  features: UseCaseFeature[];
  howToName: string;
  stepsTitle: string;
  steps: string[];
  tipsTitle: string;
  tips: { label: string; text: string }[];
  faqTitle: string;
  faqs: Faq[];
}

const RELATED = [
  { href: "/qr-code-generator-with-logo", label: "QR Code with Logo" },
  { href: "/free-qr-code-generator-no-expiry", label: "QR Codes That Never Expire" },
  { href: "/instagram-qr-code-generator", label: "Instagram QR Code" },
  { href: "/google-review-qr-code-generator", label: "Google Review QR Code" },
  { href: "/menu-qr-code-generator", label: "Restaurant Menu QR" },
  { href: "/whatsapp-qr-code-generator", label: "WhatsApp QR Code" },
  { href: "/wifi-qr-code-generator", label: "Wi-Fi QR Code" },
  { href: "/qr-code-for-business-cards", label: "Business Card vCard QR" },
  { href: "/sms-qr-code-generator", label: "SMS QR Code" },
  { href: "/phone-call-qr-code-generator", label: "Phone Call QR Code" },
  { href: "/location-qr-code-generator", label: "Location QR Code" },
  { href: "/event-qr-code-generator", label: "Calendar Event QR Code" },
  { href: "/social-media-qr-code-generator", label: "Social Media QR Code" },
  { href: "/bulk-qr-code-generator", label: "Bulk QR Code Generator" },
  { href: "/qr-code-scanner", label: "Free QR Code Scanner" },
];

export function UseCasePage(p: UseCasePageProps) {
  const BadgeIcon = p.badgeIcon;
  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: p.howToName,
    url: `${SITE_URL}${p.path}`,
    step: p.steps.map((text, i) => ({ "@type": "HowToStep", position: i + 1, text })),
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <JsonLd data={howTo} />
      <JsonLd data={breadcrumbSchema([{ name: p.titleLead + " " + p.titleAccent, path: p.path }])} />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-4">
            <BadgeIcon className="w-3.5 h-3.5" />
            {p.badge}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4">
            {p.titleLead}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              {p.titleAccent}
            </span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">{p.intro}</p>
        </div>

        <div className="mb-20 -mx-4 sm:-mx-6 lg:-mx-8">
          {p.tool ?? <QRStudio initialContentType={p.contentType ?? "url"} initialTab="content" />}
        </div>

        <section className="border-t border-slate-800/80 pt-16 mt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {p.features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-300 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{f.text}</p>
                </div>
              );
            })}
          </div>

          <div className="max-w-4xl mx-auto bg-slate-900/30 rounded-3xl p-8 sm:p-10 border border-slate-800/80 mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">{p.stepsTitle}</h2>
            <ol className="space-y-3 text-slate-300 text-sm leading-relaxed list-decimal pl-5">
              {p.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </div>

          <div className="max-w-4xl mx-auto bg-slate-900/30 rounded-3xl p-8 sm:p-10 border border-slate-800/80 mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">{p.tipsTitle}</h2>
            <ul className="space-y-2.5 text-slate-300 text-sm leading-relaxed">
              {p.tips.map((t) => (
                <li key={t.label} className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-1" />
                  <span>
                    <strong>{t.label}:</strong> {t.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <PageFAQ title={p.faqTitle} faqs={p.faqs} />

          <div className="text-center">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">Explore More Dedicated Generators</h3>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {RELATED.filter((r) => r.href !== p.path).map((r) => (
                <Link
                  key={r.href}
                  href={r.href}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-all"
                >
                  {r.label} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
