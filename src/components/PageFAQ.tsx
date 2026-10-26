import { ChevronDown } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { faqSchema, type Faq } from "@/lib/seo";

export function PageFAQ({ title, faqs }: { title: string; faqs: Faq[] }) {
  return (
    <div className="max-w-4xl mx-auto mb-16">
      <JsonLd data={faqSchema(faqs)} />
      <h2 className="text-2xl font-bold text-white mb-6 text-center">{title}</h2>
      <div className="space-y-3">
        {faqs.map((f) => (
          <details
            key={f.q}
            className="group rounded-xl border border-slate-800/80 bg-slate-900/40 open:border-slate-700"
          >
            <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer list-none text-white font-semibold text-sm sm:text-base">
              {f.q}
              <ChevronDown className="w-5 h-5 text-slate-400 shrink-0 transition-transform group-open:rotate-180" />
            </summary>
            <p className="px-5 pb-4 text-sm text-slate-400 leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
