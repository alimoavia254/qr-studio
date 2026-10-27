import type { Metadata } from "next";
import { MessageSquare, Smartphone, Printer } from "lucide-react";
import { UseCasePage } from "@/components/UseCasePage";

export const metadata: Metadata = {
  title: "SMS QR Code Generator - Free Pre-filled Text Message",
  description:
    "Make a free SMS QR code with the number and message pre-filled. Scan, tap send. Add your logo and colors, download PNG, SVG or PDF. No sign-up.",
  alternates: { canonical: "https://qrvibe.online/sms-qr-code-generator" },
  openGraph: {
    images: "/opengraph-image",
    title: "Free SMS QR Code Generator | QR Vibe",
    description: "Scanning opens the messages app with your number and text ready to send.",
  },
};

export default function SmsQRPage() {
  return (
    <UseCasePage
      path="/sms-qr-code-generator"
      contentType="sms"
      badgeIcon={MessageSquare}
      badge="Pre-filled text messages"
      titleLead="Free SMS"
      titleAccent="QR Code Generator"
      intro="Let customers text you in one scan. Enter your phone number and an optional message, and the QR code opens the messages app with both already filled in. No typing, no mistakes."
      features={[
        { icon: MessageSquare, title: "Message Ready to Send", text: "The number and your text are pre-filled, so the scanner only taps send. Perfect for coupons, votes, support and sign-up keywords." },
        { icon: Smartphone, title: "Works on iPhone and Android", text: "Phone cameras recognise the SMSTO format and offer to open the messages app. No extra app is needed." },
        { icon: Printer, title: "Print Anywhere", text: "Download SVG or a print-ready PDF at an exact size for posters, receipts, flyers and shop windows." },
      ]}
      howToName="How to create an SMS QR code"
      stepsTitle="How to create an SMS QR code"
      steps={[
        "Open the SMS tab in the generator above.",
        "Type the phone number with its country code, for example +923001234567.",
        "Write the message that should appear pre-filled (optional).",
        "Check the green scan test, then download PNG, SVG or PDF.",
      ]}
      tipsTitle="Tips for More Text Messages"
      tips={[
        { label: "Use a keyword", text: "A short keyword like \"JOIN\" or \"MENU\" makes it easy to automate replies on your side." },
        { label: "Include the country code", text: "Without +92, +1 or similar, the number may not work for people abroad." },
        { label: "Add a call to action", text: "A frame saying \"Scan to text us\" gets more scans. Use the Poster tab." },
      ]}
      faqTitle="SMS QR Code FAQ"
      faqs={[
        { q: "How do I make a QR code that sends a text message?", a: "Choose SMS in QR Vibe, enter the phone number and message, then download the QR code. Scanning opens the messages app with both filled in." },
        { q: "Does an SMS QR code send the message automatically?", a: "No. The scanner always has to tap send themselves, which keeps it safe and spam-free." },
        { q: "Does an SMS QR code expire?", a: "No. The number and message are stored inside the QR code itself, so it works forever." },
      ]}
    />
  );
}
