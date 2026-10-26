import type { Metadata } from "next";
import { UtensilsCrossed, Smartphone, RefreshCw, Printer } from "lucide-react";
import { UseCasePage } from "@/components/UseCasePage";

export const metadata: Metadata = {
  title: "Restaurant Menu QR Code Generator - Free & Contactless",
  description:
    "Create a free menu QR code for your restaurant or cafe. Link your online or PDF menu, add your logo and a 'Scan for menu' frame, and print table stickers.",
  alternates: { canonical: "https://qrvibe.online/menu-qr-code-generator" },
  openGraph: {
    images: "/opengraph-image",
    title: "Free Restaurant Menu QR Code Generator | QR Vibe",
    description: "Contactless menu QR codes for restaurants and cafes. Branded, scan-tested and print-ready.",
  },
};

export default function MenuQRPage() {
  return (
    <UseCasePage
      path="/menu-qr-code-generator"
      badgeIcon={UtensilsCrossed}
      badge="Restaurants, cafes & food stalls"
      titleLead="Restaurant Menu"
      titleAccent="QR Code Generator"
      intro="Let guests open your menu on their phone. Paste your menu link, add your logo and a 'Scan for menu' frame, and print it for every table."
      features={[
        { icon: Smartphone, title: "Contactless Menu", text: "Guests scan with the normal camera app, no download needed, and see your menu on their own phone." },
        { icon: RefreshCw, title: "Update Without Reprinting", text: "Point the QR code to a page or file link you control. When prices change, update the menu at that link and the printed code keeps working." },
        { icon: Printer, title: "Table-Ready Prints", text: "Download SVG or print-size PNG for table tents, stickers, standees and window posters." },
      ]}
      howToName="How to create a menu QR code"
      stepsTitle="How to Make a QR Code for Your Menu"
      steps={[
        "Put your menu online: a page on your website, a Google Drive or Dropbox PDF shared as 'Anyone with the link', or your food delivery page.",
        "Copy the menu link and paste it into the Website link box above.",
        "Add your restaurant logo and brand colors, then add a 'Scan for menu' frame from the Poster tab.",
        "Download and print. Test-scan the printed copy with two different phones before placing it on tables.",
      ]}
      tipsTitle="Menu QR Code Best Practices"
      tips={[
        { label: "Keep the link stable", text: "If you replace the PDF, keep the same share link so printed codes don't break." },
        { label: "Make the menu phone-friendly", text: "Use large text and a single-column layout; a phone-sized page converts better than a tiny A3 PDF." },
        { label: "Print size", text: "At least 3 x 3 cm on table tents, with good contrast and a white margin, so phones focus easily in dim light." },
      ]}
      faqTitle="Menu QR Code FAQ"
      faqs={[
        { q: "How do I make a QR code for my restaurant menu?", a: "Upload your menu as a web page or shared PDF, copy its link, paste it into QR Vibe, and download the QR code. Add your logo and a 'Scan for menu' frame for better results." },
        { q: "Can I change my menu after printing the QR code?", a: "Yes, if the QR code points to a link you control. Update the menu at that same link and the printed QR code shows the new version." },
        { q: "Is the menu QR code free?", a: "Yes. QR Vibe is free, has no watermark, and the QR codes never expire." },
      ]}
    />
  );
}
