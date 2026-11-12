import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { GUIDES } from "@/lib/guides";

export type DeepDiveSection = { heading: string; paragraphs: string[] };

/** Page-specific explanatory sections shown between the tips and the FAQ. */
export function DeepDive({ sections }: { sections: DeepDiveSection[] }) {
  return (
    <div className="max-w-4xl mx-auto grid gap-6 mb-16">
      {sections.map((s) => (
        <section key={s.heading} className="rounded-3xl p-8 sm:p-10 border border-slate-800/80 bg-slate-900/30">
          <h2 className="text-2xl font-bold text-white mb-4">{s.heading}</h2>
          <div className="space-y-3 text-slate-300 text-sm sm:text-base leading-relaxed">
            {s.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

/** Cards linking to the guides that explain this page's topic in depth. */
export function GuideLinks({ slugs }: { slugs: string[] }) {
  const guides = slugs.flatMap((slug) => GUIDES.find((g) => g.slug === slug) ?? []);
  if (guides.length === 0) return null;
  return (
    <div className="max-w-4xl mx-auto mb-16">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Helpful Guides</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {guides.map((g) => (
          <Link
            key={g.slug}
            href={`/guides/${g.slug}`}
            className="group flex flex-col gap-2 p-5 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900 transition-all"
          >
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-300">
              <BookOpen className="w-3.5 h-3.5" /> Guide · {g.readMinutes} min read
            </span>
            <span className="text-white font-semibold text-sm sm:text-base leading-snug">{g.title}</span>
            <span className="text-xs text-slate-400 leading-relaxed">{g.excerpt}</span>
            <span className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-indigo-400 group-hover:text-indigo-300">
              Read the guide <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
