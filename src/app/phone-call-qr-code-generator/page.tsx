import type { Metadata } from "next";
import { Phone, Zap, Printer } from "lucide-react";
import { UseCasePage } from "@/components/UseCasePage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/phone-call-qr-code-generator",
  title: "Phone Call QR Code Generator - Free Click-to-Call",
  description: "Create a free QR code that opens the phone dialer with your number. One scan, one tap to call. Add a logo, pick colors, download PNG, SVG or PDF.",
  socialTitle: "Free Phone Call QR Code Generator | QR Vibe",
  socialDescription: "Scan and call in one tap. Free, no sign-up, never expires.",
});

export default function PhoneQRPage() {
  return (
    <UseCasePage
      path="/phone-call-qr-code-generator"
      contentType="phone"
      badgeIcon={Phone}
      badge="Click-to-call"
      titleLead="Free Phone Call"
      titleAccent="QR Code Generator"
      intro="Put a call button on anything printed. The QR code opens the phone dialer with your number ready, so customers only tap call."
      features={[
        { icon: Phone, title: "One Tap to Call", text: "Scanning opens the dialer with the number filled in. Ideal for vehicles, shop windows, notice boards and flyers." },
        { icon: Zap, title: "Instant and Offline-Safe", text: "The number lives inside the QR code. There is no redirect, so it keeps working even if our site is gone." },
        { icon: Printer, title: "Print Ready", text: "Download an exact-size PDF or a vector SVG for signs, stickers and vehicle wraps." },
      ]}
      howToName="How to create a phone call QR code"
      stepsTitle="How to create a phone call QR code"
      steps={[
        "Open the Call tab in the generator above.",
        "Enter the phone number with its country code.",
        "Style the code with your logo and colors.",
        "Wait for the green scan test, then download.",
      ]}
      tipsTitle="Tips for Click-to-Call QR Codes"
      tips={[
        { label: "Use an international format", text: "+92 300 1234567 works from anywhere, while a local number only works nearby." },
        { label: "Make it big enough", text: "Use at least 2 x 2 cm on cards and 5 x 5 cm or more on signs." },
        { label: "Test it", text: "Scan it with an iPhone and an Android phone before you print a large batch." },
      ]}
      faqTitle="Phone Call QR Code FAQ"
      faqs={[
        { q: "How do I make a QR code that calls a number?", a: "Choose Call in QR Vibe, enter the phone number, and download the QR code. Scanning opens the dialer with your number ready to call." },
        { q: "Will the call start automatically?", a: "No. The phone shows the number and the person taps call, so nobody is dialled by accident." },
        { q: "Is it free?", a: "Yes, with unlimited downloads, no watermark and no sign-up." },
      ]}
    />
  );
}
