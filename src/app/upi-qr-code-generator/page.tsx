import type { Metadata } from "next";
import { IndianRupee, ShieldCheck, Printer } from "lucide-react";
import { UseCasePage } from "@/components/UseCasePage";

export const metadata: Metadata = {
  title: "UPI QR Code Generator - Free Payment QR Code for India",
  description:
    "Make a free UPI payment QR code for GPay, PhonePe and Paytm. Add your UPI ID, name and amount. Style it with your logo and download PNG, SVG or PDF.",
  alternates: { canonical: "https://qrvibe.online/upi-qr-code-generator" },
  openGraph: {
    images: "/opengraph-image",
    title: "Free UPI QR Code Generator | QR Vibe",
    description: "Accept payments with a branded UPI QR code. No sign-up, no fees from us.",
  },
};

export default function UpiQRPage() {
  return (
    <UseCasePage
      path="/upi-qr-code-generator"
      contentType="upi"
      badgeIcon={IndianRupee}
      badge="GPay, PhonePe, Paytm, BHIM"
      titleLead="Free UPI"
      titleAccent="QR Code Generator"
      intro="Get paid at your counter, stall or event. Enter your UPI ID and the QR code opens any UPI app with you as the payee. Add an amount for fixed-price payments."
      features={[
        { icon: IndianRupee, title: "Works With Every UPI App", text: "The standard upi://pay link is understood by GPay, PhonePe, Paytm, BHIM and bank apps." },
        { icon: ShieldCheck, title: "Direct to Your Account", text: "Money goes straight from the payer to your UPI ID. QR Vibe never touches or sees any payment." },
        { icon: Printer, title: "Counter-Ready", text: "Add a poster frame, then print an exact-size PDF to stick on your counter or stand." },
      ]}
      howToName="How to create a UPI payment QR code"
      stepsTitle="How to create a UPI payment QR code"
      steps={[
        "Open the UPI Pay tab in the generator above.",
        "Enter your UPI ID, for example shopname@okaxis, and your display name.",
        "Add an amount only if every payment is the same price.",
        "Scan it yourself with a UPI app, then download.",
      ]}
      tipsTitle="Tips for UPI QR Codes"
      tips={[
        { label: "Scan and verify before you print", text: "Make a ₹1 test payment to confirm the name shown is yours." },
        { label: "Leave the amount empty for shops", text: "Customers then type their own bill amount." },
        { label: "Keep your UPI ID private on shared designs", text: "Anyone who scans can see the ID, so only share the design link with people you trust." },
      ]}
      faqTitle="UPI QR Code FAQ"
      faqs={[
        { q: "How do I make a UPI QR code?", a: "Choose UPI Pay in QR Vibe, enter your UPI ID and name, optionally add an amount, and download the QR code." },
        { q: "Is this the same as the QR code in my bank app?", a: "It uses the same UPI standard, but you can style it with your logo and colors and print it at any size." },
        { q: "Does QR Vibe charge any fee on payments?", a: "No. QR Vibe never handles money. Payments go directly between the payer's app and your UPI account." },
      ]}
    />
  );
}
