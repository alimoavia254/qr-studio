import type { Metadata } from "next";
import { Star, MapPin, ThumbsUp, Store } from "lucide-react";
import { UseCasePage } from "@/components/UseCasePage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/google-review-qr-code-generator",
  title: "Google Review QR Code Generator - Free, With Logo",
  description: "Create a free Google review QR code that opens your review form in one scan. Add your logo and a 'Review us' frame, then print it for your counter.",
  socialTitle: "Free Google Review QR Code Generator | QR Vibe",
  socialDescription: "Let customers leave a Google review with one scan. Free, branded and print-ready.",
});

export default function GoogleReviewQRPage() {
  return (
    <UseCasePage
      path="/google-review-qr-code-generator"
      badgeIcon={Star}
      badge="For Google Business Profile"
      titleLead="Google Review"
      titleAccent="QR Code Generator"
      intro="Make it easy for happy customers to review you. Paste your Google review link, add your logo, and print a QR code that opens your review form in one scan."
      features={[
        { icon: ThumbsUp, title: "One Scan to Review", text: "Your Google review link opens the review box directly, so customers don't have to search for your business first." },
        { icon: Store, title: "Made for Counters & Tables", text: "Add a 'Review us on Google' frame and print it for counters, tables, receipts, invoices and delivery bags." },
        { icon: MapPin, title: "Helps Local SEO", text: "More recent reviews are one of the signals Google uses for local results, so a steady flow of reviews can help you show up in Maps." },
      ]}
      howToName="How to create a Google review QR code"
      stepsTitle="How to Get Your Google Review Link and QR Code"
      steps={[
        "Sign in to your Google Business Profile (search your business name on Google while logged in, or open business.google.com).",
        "Click 'Ask for reviews' (or 'Get more reviews') and copy the review link it shows.",
        "Paste that link into the Website link box above.",
        "Add your logo, choose a frame with 'Review us' text in the Poster tab, then download and print.",
      ]}
      tipsTitle="Tips for Getting More Google Reviews"
      tips={[
        { label: "Ask at the right moment", text: "Show the QR code right after a good experience, such as at checkout or on the receipt." },
        { label: "Keep it visible", text: "Put it at eye level on the counter or table, printed at least 5 x 5 cm." },
        { label: "Follow Google's rules", text: "Don't offer rewards for reviews or only ask happy customers; Google's policies don't allow incentivised or filtered reviews." },
      ]}
      faqTitle="Google Review QR Code FAQ"
      faqs={[
        { q: "How do I create a QR code for Google reviews?", a: "Copy your review link from Google Business Profile ('Ask for reviews'), paste it into QR Vibe, and download the QR code. Customers who scan it land on your review form." },
        { q: "Is a Google review QR code free?", a: "Yes. QR Vibe is free with no sign-up, no watermark and no scan limit, and the QR code never expires." },
        { q: "Does the customer need a Google account?", a: "Yes. Google requires reviewers to be signed in to a Google account to post a review." },
      ]}
    />
  );
}
