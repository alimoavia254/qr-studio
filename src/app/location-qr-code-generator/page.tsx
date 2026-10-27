import type { Metadata } from "next";
import { MapPin, Navigation, Printer } from "lucide-react";
import { UseCasePage } from "@/components/UseCasePage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/location-qr-code-generator",
  title: "Location QR Code Generator - Free Google Maps QR Code",
  description: "Make a free location QR code that opens Google Maps or the phone map app at exact coordinates. Add your logo, download PNG, SVG or PDF. No sign-up.",
  socialTitle: "Free Location QR Code Generator | QR Vibe",
  socialDescription: "Send people straight to your shop, venue or meeting point on the map.",
});

export default function LocationQRPage() {
  return (
    <UseCasePage
      path="/location-qr-code-generator"
      contentType="geo"
      badgeIcon={MapPin}
      badge="Google Maps and map apps"
      titleLead="Free Location"
      titleAccent="QR Code Generator"
      intro="Send people to the exact spot: a shop, venue, parking space or meeting point. Enter coordinates and the QR code opens the map with directions one tap away."
      features={[
        { icon: MapPin, title: "Exact Coordinates", text: "Pin the precise entrance, not just a street. Right-click any place in Google Maps to copy its latitude and longitude." },
        { icon: Navigation, title: "Two Link Styles", text: "Choose a Google Maps link that works everywhere, or a geo link that opens the default map app on the phone." },
        { icon: Printer, title: "Print Anywhere", text: "Use it on invitations, brochures, real-estate signs and event posters." },
      ]}
      howToName="How to create a location QR code"
      stepsTitle="How to create a location QR code"
      steps={[
        "Open Google Maps, right-click your place, and click the coordinates to copy them.",
        "Open the Location tab above and paste the latitude and longitude.",
        "Pick Google Maps link or Phone's map app.",
        "Wait for the green scan test, then download.",
      ]}
      tipsTitle="Tips for Location QR Codes"
      tips={[
        { label: "Choose Google Maps link for events", text: "It opens in the browser on every phone, even without a map app set up." },
        { label: "Check the pin", text: "Scan it yourself and confirm the pin is on the right entrance." },
        { label: "Add a label on the poster", text: "A frame saying \"Find us here\" explains the QR code at a glance." },
      ]}
      faqTitle="Location QR Code FAQ"
      faqs={[
        { q: "How do I make a QR code for a Google Maps location?", a: "Copy the latitude and longitude from Google Maps, choose Location in QR Vibe, paste them, and download the QR code." },
        { q: "What is the difference between the two link styles?", a: "The Google Maps link opens in any browser. The geo link opens the phone's default map app, which is faster but depends on the device." },
        { q: "Will it expire?", a: "No. The coordinates are stored inside the QR code, so it works forever." },
      ]}
    />
  );
}
