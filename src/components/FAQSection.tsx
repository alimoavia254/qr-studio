"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does QR Studio ensure the QR code actually scans with a logo?",
      a: "QR codes use Reed-Solomon Error Correction. QR Studio automatically switches the error correction level to 'High' (Level H) when you upload a logo. Level H allows up to 30% of the QR pattern to be covered or damaged while still being 100% reconstructible and readable by any phone camera.",
    },
    {
      q: "Why do some colored QR codes fail to scan?",
      a: "The most common reason is low contrast. Phone camera sensors need strong optical separation between the dark modules (dots) and the light background. QR Studio features a live Scannability Engine that checks the WCAG contrast ratio in real-time and warns you if the colors are too low contrast.",
    },
    {
      q: "Do these QR codes expire or have scan limits?",
      a: "No! All QR codes generated in QR Studio are 100% static and encode your direct content (such as your direct URL, Wi-Fi credentials, or vCard details). They never route through a third-party redirect and never expire or ask you for a monthly subscription.",
    },
    {
      q: "What format should I download for printing on packaging or business cards?",
      a: "For professional printing, select SVG (Scalable Vector Graphics). SVGs scale to any billboard or packaging dimension without pixelation. For digital sharing and social media, the 1024px or 2048px Ultra-HD PNG option is perfect.",
    },
    {
      q: "Is my uploaded logo or private data stored on any server?",
      a: "No. Everything runs 100% locally on your computer inside your web browser. Neither your Wi-Fi password, vCard data, nor your brand logo is uploaded to external servers, guaranteeing complete privacy and confidentiality.",
    },
  ];

  return (
    <section className="py-20 bg-slate-950 border-t border-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-slate-400 text-sm">
            Everything you need to know about designing scannable branded QR codes.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-800/80 bg-slate-900/40 overflow-hidden transition-colors hover:border-slate-700"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left text-white font-medium hover:text-indigo-300 transition-colors"
                >
                  <span className="text-sm sm:text-base font-semibold">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180 text-indigo-400" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-4 text-sm text-slate-400 leading-relaxed border-t border-slate-800/40 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
