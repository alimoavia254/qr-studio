import type { Metadata } from "next";
import { Share2, Smartphone, Printer } from "lucide-react";
import { UseCasePage } from "@/components/UseCasePage";

export const metadata: Metadata = {
  title: "Social Media QR Code Generator - Free, With Logo",
  description:
    "Make a free QR code for your Instagram, TikTok, Facebook, YouTube, Telegram or X profile. Type your username, add a logo and download PNG, SVG or PDF.",
  alternates: { canonical: "https://qrvibe.online/social-media-qr-code-generator" },
  openGraph: {
    images: "/opengraph-image",
    title: "Free Social Media QR Code Generator | QR Vibe",
    description: "Turn your username into a branded QR code that opens your profile in one scan.",
  },
};

export default function SocialQRPage() {
  return (
    <UseCasePage
      path="/social-media-qr-code-generator"
      contentType="social"
      badgeIcon={Share2}
      badge="Instagram, TikTok, Facebook, YouTube & more"
      titleLead="Free Social Media"
      titleAccent="QR Code Generator"
      intro="Get followers from the real world. Pick your platform, type your username, and the QR code opens your profile in the app. No need to find or paste the link."
      features={[
        { icon: Share2, title: "8 Platforms", text: "Instagram, Facebook, TikTok, YouTube, Telegram, X, LinkedIn and Snapchat. Just type the username." },
        { icon: Smartphone, title: "Opens in the App", text: "Profile links open the installed app on phones, and the website on phones that don't have it." },
        { icon: Printer, title: "Print Anywhere", text: "Add your logo and brand colors, then download SVG or an exact-size PDF for cards, shop windows and packaging." },
      ]}
      howToName="How to create a social media QR code"
      stepsTitle="How to Create a Social Media QR Code"
      steps={[
        "Open the Social tab in the generator above.",
        "Choose your platform, for example Instagram or TikTok.",
        "Type your username without the @, or paste your full profile link.",
        "Add your logo in the Logo tab, wait for the green scan test, then download.",
      ]}
      tipsTitle="Tips for More Followers"
      tips={[
        { label: "Add a call to action", text: "A frame saying \"Scan to follow\" gets more scans than a bare code. Use the Poster tab." },
        { label: "Link the profile, not a post", text: "Profile links stay useful for years; post links are best for campaigns." },
        { label: "Size it right", text: "Print at least 2 x 2 cm on cards and 5 x 5 cm or more on posters." },
      ]}
      faqTitle="Social Media QR Code FAQ"
      faqs={[
        { q: "How do I make a QR code for my Instagram or TikTok?", a: "Choose Social in QR Vibe, pick the platform, type your username, and download the QR code. It's free and needs no sign-up." },
        { q: "Can I use a full profile link instead of a username?", a: "Yes. Paste the full link into the same box and it is used as is." },
        { q: "Will it expire?", a: "No. The QR code contains your profile link directly, so it works as long as your profile exists." },
      ]}
    />
  );
}
