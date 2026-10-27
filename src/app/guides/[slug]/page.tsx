import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { PageFAQ } from "@/components/PageFAQ";
import { GUIDES, getGuide } from "@/lib/guides";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  const url = `${SITE_URL}/guides/${guide.slug}`;
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: guide.title,
      description: guide.description,
      publishedTime: guide.published,
      modifiedTime: guide.updated,
      siteName: SITE_NAME,
      images: "/opengraph-image",
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: guide.description,
      images: "/twitter-image",
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const url = `${SITE_URL}/guides/${guide.slug}`;
  const related = GUIDES.filter((g) => g.slug !== guide.slug).slice(0, 3);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    url,
    mainEntityOfPage: url,
    datePublished: guide.published,
    dateModified: guide.updated,
    image: `${SITE_URL}/opengraph-image`,
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Guides", item: `${SITE_URL}/guides` },
      { "@type": "ListItem", position: 3, name: guide.title, item: url },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-white">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/guides" className="hover:text-white">Guides</Link>
        </nav>

        <article>
          <header className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">{guide.title}</h1>
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed mb-4">{guide.description}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
              <span>By the {SITE_NAME} team</span>
              <span>Updated <time dateTime={guide.updated}>{formatDate(guide.updated)}</time></span>
              <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {guide.readMinutes} min read</span>
            </div>
          </header>

          <div className="space-y-10 text-slate-300 leading-relaxed text-sm sm:text-base">
            {guide.sections.map((s) => (
              <section key={s.heading}>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">{s.heading}</h2>
                {s.paragraphs.map((p) => (
                  <p key={p} className="mb-3">{p}</p>
                ))}
                {s.list && (
                  <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                    {s.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </article>

        <div className="my-12 p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white font-semibold text-sm sm:text-base">Free, no sign-up, never expires.</p>
          <Link
            href={guide.tool.href}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all"
          >
            {guide.tool.label} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <PageFAQ title="Frequently asked questions" faqs={guide.faqs} />

        <aside>
          <h2 className="text-lg font-bold text-white mb-4">More guides</h2>
          <ul className="space-y-2">
            {related.map((g) => (
              <li key={g.slug}>
                <Link href={`/guides/${g.slug}`} className="text-indigo-400 hover:text-indigo-300 text-sm">
                  {g.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </main>

      <Footer />
    </div>
  );
}
