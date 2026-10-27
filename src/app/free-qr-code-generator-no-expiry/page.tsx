import type { Metadata } from "next";
import { Infinity as InfinityIcon, ShieldCheck, Ban } from "lucide-react";
import { UseCasePage } from "@/components/UseCasePage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/free-qr-code-generator-no-expiry",
  title: "Free QR Code Generator That Never Expires (No Sign-up)",
  description: "Make free QR codes that never expire: static codes with no sign-up, no watermark, no scan limits and no subscription. Add your logo and download PNG or SVG.",
  socialTitle: "Free QR Code Generator That Never Expires | QR Vibe",
  socialDescription: "Static QR codes that keep working forever. No account, no watermark, no trial.",
});

export default function NoExpiryQRPage() {
  return (
    <UseCasePage
      path="/free-qr-code-generator-no-expiry"
      badgeIcon={InfinityIcon}
      badge="Static codes · no trial · no account"
      titleLead="Free QR Codes That"
      titleAccent="Never Expire"
      intro="Many 'free' QR generators make dynamic codes that stop working when a trial ends. QR Vibe makes static QR codes: your link or data is stored inside the code itself, so it keeps working forever with no sign-up and no subscription."
      features={[
        { icon: InfinityIcon, title: "Works Forever", text: "A static QR code contains your data directly. There is no redirect server in between, so there is nothing that can expire or be switched off." },
        { icon: Ban, title: "No Account, No Watermark", text: "Create and download unlimited codes without signing up. Downloads have no watermark and no scan limit." },
        { icon: ShieldCheck, title: "Private by Design", text: "Codes are generated in your browser. Your links, Wi-Fi passwords and contact details are never uploaded or tracked." },
      ]}
      howToName="How to make a QR code that never expires"
      stepsTitle="How to Make a QR Code That Never Expires"
      steps={[
        "Choose what the QR code should open: website, WhatsApp, Wi-Fi, contact card, email or text.",
        "Enter your link or details in the generator above.",
        "Optionally add your logo and colors. Error correction switches to high automatically so it still scans.",
        "Wait for the green scan check and download PNG, JPG or SVG. The file is yours and works permanently.",
      ]}
      tipsTitle="How to Tell If a QR Code Will Expire"
      tips={[
        { label: "Scan it and look at the link", text: "If the phone shows a short link from the QR company (instead of your own website), it is a dynamic code that depends on their service." },
        { label: "Check for a subscription", text: "If the generator asked you to create an account or start a trial to download, the code is usually dynamic and tied to that plan." },
        { label: "Static is right for most uses", text: "Business cards, Wi-Fi, menus with a stable link, packaging and posters all work well with static codes. Choose dynamic only if you need scan analytics or must change the destination later." },
        { label: "Keep your destination alive", text: "A static code never expires, but it can only open what it points to. Keep the website or file at that link online." },
      ]}
      faqTitle="QR Code Expiry FAQ"
      faqs={[
        { q: "Do QR codes expire?", a: "Static QR codes never expire because the data is stored inside the code. Dynamic QR codes can stop working if the service that redirects them is cancelled or a free trial ends." },
        { q: "Is there a QR code generator that is free forever?", a: "Yes. QR Vibe is free with no sign-up, no watermark and no scan limit, and it creates static QR codes that do not expire." },
        { q: "Why did my free QR code stop working?", a: "It was most likely a dynamic code from a service that requires a subscription. When the trial or plan ended, the redirect was switched off. Recreate it as a static code to make it permanent." },
        { q: "Can I change the link of a static QR code later?", a: "No. The link is part of the code, so changing it means making a new code. To keep printed codes flexible, point them to a page you control and update that page instead." },
      ]}
    />
  );
}
