"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, MessageSquare, Send, CheckCircle2, Clock } from "lucide-react";

const CONTACT_EMAIL = "Aeink7@gmail.com";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    // No backend: open the visitor's email app with the message pre-filled.
    const body = `${formData.message}\n\n-- ${formData.name} (${formData.email})`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
            <Mail className="w-3.5 h-3.5" />
            Support &amp; Feedback
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Get in Touch
          </h1>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Have questions about QR code printing, feedback on styling options, or custom brand integration? We would love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Info cards */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Response Time</h3>
              <p className="text-xs text-slate-400">Usually within 24 to 48 business hours.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Open Source &amp; Feature Requests</h3>
              <p className="text-xs text-slate-400">Suggest new eye shapes, frames, or custom protocols anytime.</p>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-2 p-6 sm:p-8 rounded-3xl bg-slate-900/50 border border-slate-800">
            {submitted ? (
              <div className="py-12 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Almost there: send it from your email app</h3>
                <p className="text-sm text-slate-400 max-w-sm mx-auto mb-6">
                  We opened your email app with your message ready to send. Press send there to reach us. If nothing opened, email{" "}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="text-indigo-300 hover:underline">{CONTACT_EMAIL}</a> directly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", email: "", subject: "", message: "" });
                  }}
                  className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
                >
                  Write Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-sm text-slate-400">
                  You can also email us directly at{" "}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="text-indigo-300 hover:underline">{CONTACT_EMAIL}</a>.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Feature feedback / Print sizing query"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Your Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Write your question, suggestion, or bug report here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition-all mt-2"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
