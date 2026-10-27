import type { Metadata } from "next";
import { ScanLine, ShieldCheck, ImageUp } from "lucide-react";
import { UseCasePage } from "@/components/UseCasePage";
import { QRScanner } from "@/components/QRScanner";

export const metadata: Metadata = {
  title: "Free QR Code Scanner Online - Scan With Camera or Image",
  description:
    "Scan any QR code online with your camera or an uploaded image. See where a link goes before you open it. Free, private, no app and no sign-up.",
  alternates: { canonical: "https://qrvibe.online/qr-code-scanner" },
  openGraph: {
    images: "/opengraph-image",
    title: "Free Online QR Code Scanner | QR Vibe",
    description: "Scan with your camera or upload an image, and check the link before you open it.",
  },
};

export default function QRScannerPage() {
  return (
    <UseCasePage
      path="/qr-code-scanner"
      tool={<QRScanner />}
      badgeIcon={ScanLine}
      badge="Camera or image upload"
      titleLead="Free Online"
      titleAccent="QR Code Scanner"
      intro="Scan a QR code with your camera, or upload a screenshot or photo. You see exactly what is inside, and where a link leads, before you decide to open it."
      features={[
        { icon: ScanLine, title: "Camera or Image", text: "Use your phone or laptop camera for a live scan, or drop in a screenshot or photo of the QR code." },
        { icon: ShieldCheck, title: "Check Before You Open", text: "Links are shown with their website name first. Fake QR codes are a common scam, so you stay in control." },
        { icon: ImageUp, title: "Private by Design", text: "Decoding happens in your browser. The camera feed and images are never uploaded to any server." },
      ]}
      howToName="How to scan a QR code online"
      stepsTitle="How to Scan a QR Code Online"
      steps={[
        "Tap Start camera and allow camera access, or tap Upload image and choose a photo or screenshot.",
        "Hold the QR code inside the dashed frame, or wait while the uploaded image is read.",
        "Read the result. For links, check the website name shown.",
        "Tap Copy or Open link when you trust the content.",
      ]}
      tipsTitle="Tips for a Fast Scan"
      tips={[
        { label: "Good light", text: "Avoid glare and shadows on the QR code." },
        { label: "Hold steady", text: "Keep the code flat and fill about half of the frame." },
        { label: "Scanning a screenshot", text: "Use Upload image. It works with screenshots, saved photos and downloaded QR codes." },
      ]}
      faqTitle="QR Code Scanner FAQ"
      faqs={[
        { q: "How do I scan a QR code without an app?", a: "Open this page, tap Start camera, and point at the QR code. Phones also have a built-in scanner in the camera app. This page is useful on laptops or for QR codes inside images." },
        { q: "Can I scan a QR code from a screenshot or image?", a: "Yes. Tap Upload image and choose the screenshot or photo. The QR code is read directly in your browser." },
        { q: "Is it safe to scan unknown QR codes?", a: "Scanning only reads the content. The risk is opening a malicious link, so always check the website name shown before you tap Open link." },
        { q: "Are my images or camera feed uploaded?", a: "No. Everything is processed on your device and nothing is sent to a server." },
      ]}
    />
  );
}
