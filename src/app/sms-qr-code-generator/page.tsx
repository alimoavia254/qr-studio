import type { Metadata } from "next";
import { MessageSquare, Smartphone, Printer } from "lucide-react";
import { UseCasePage } from "@/components/UseCasePage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/sms-qr-code-generator",
  title: "SMS QR Code Generator - Free Pre-filled Text Message",
  description: "Make a free SMS QR code with the number and message pre-filled. Scan, tap send. Add your logo and colors, download PNG, SVG or PDF. No sign-up.",
  socialTitle: "Free SMS QR Code Generator | QR Vibe",
  socialDescription: "Scanning opens the messages app with your number and text ready to send.",
});

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
      deepDive={[
        {
          "heading": "What an SMS QR code contains",
          "paragraphs": [
            "QR Vibe encodes your number and message in the SMSTO format, for example SMSTO:+15551234567:JOIN. Phone cameras read this as an instruction to open the messages app with the recipient and the text already filled in. The scanner only has to tap send.",
            "Because the number and message live inside the code itself, nothing is stored on a server. That is why the code keeps working as long as the number does, and why changing the message later means making a new code."
          ]
        },
        {
          "heading": "Practical ways to use a text message QR code",
          "paragraphs": [
            "Shops print a code on receipts or shelf signs that texts a keyword such as JOIN or MENU to their business number, so staff can reply with a coupon or link. Event organisers use one on a poster so guests can text a question without saving a contact first.",
            "Clinics, salons and repair shops put one on a window sticker or appointment card with a message like \"Hi, I would like to book a visit\". If you would rather start a call or a chat, use the phone call or WhatsApp generators instead."
          ]
        },
        {
          "heading": "Before you print it",
          "paragraphs": [
            "Scan the finished code with both an iPhone and an Android phone. Keep the message short, because a long pre-filled text makes the QR pattern denser and harder to scan from a distance. Print it at least 2 x 2 cm and leave a white margin around it."
          ]
        }
      ]}
      guides={["how-to-test-a-qr-code-before-printing", "qr-code-size-for-printing", "static-vs-dynamic-qr-codes"]}
      faqTitle="SMS QR Code FAQ"
      faqs={[
        { q: "How do I make a QR code that sends a text message?", a: "Choose SMS in QR Vibe, enter the phone number and message, then download the QR code. Scanning opens the messages app with both filled in." },
        { q: "Does an SMS QR code send the message automatically?", a: "No. The scanner always has to tap send themselves, which keeps it safe and spam-free." },
        { q: "Does an SMS QR code expire?", a: "No. The number and message are stored inside the QR code itself, so it works forever." },
        { q: "What is the best SMS QR code generator for a text message?", a: "Pick one that lets you pre-fill both the number and the message and does not route scans through a redirect. QR Vibe's SMS tab does this for free, with no sign-up, and the code works without an expiry date." },
        { q: "How do I make a QR code that texts a specific message?", a: "Open the SMS tab, enter the number with its country code, type the message to pre-fill, then download the QR code. When someone scans it, their messages app opens with the number and text ready to send." },
      ]}
    />
  );
}
