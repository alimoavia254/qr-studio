import type { Metadata } from "next";
import { AtSign, Camera, Palette, Printer } from "lucide-react";
import { UseCasePage } from "@/components/UseCasePage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/instagram-qr-code-generator",
  title: "Instagram QR Code Generator - Free, With Logo",
  description: "Make a free Instagram QR code for your profile, post or reel. Add your logo, match your brand colors, test the scan and download PNG or SVG. No sign-up.",
  socialTitle: "Free Instagram QR Code Generator | QR Vibe",
  socialDescription: "Turn your Instagram profile, post or reel link into a branded, scan-tested QR code.",
});

export default function InstagramQRPage() {
  return (
    <UseCasePage
      path="/instagram-qr-code-generator"
      badgeIcon={AtSign}
      badge="Profile, post & reel links"
      titleLead="Free Instagram"
      titleAccent="QR Code Generator"
      intro="Get more followers from offline places. Paste your Instagram link, add your logo and brand colors, and download a QR code people can scan to open your profile instantly."
      features={[
        { icon: Camera, title: "Opens Straight in Instagram", text: "Scanning an instagram.com link opens the Instagram app on phones that have it installed, and the website on phones that don't." },
        { icon: Palette, title: "Matches Your Brand", text: "Use Instagram-style gradients or your own colors, add your logo in the middle, and put a 'Follow us' frame around it." },
        { icon: Printer, title: "Print Anywhere", text: "Download SVG for packaging, flyers and shop windows, or HD PNG for stories, posts and digital menus." },
      ]}
      howToName="How to create an Instagram QR code"
      stepsTitle="How to Create an Instagram QR Code"
      steps={[
        "Open your Instagram profile, post or reel and copy its link (Share → Copy link). A profile link looks like instagram.com/yourname.",
        "Paste the link in the Website link box above. You can tap the instagram.com/ chip and type your username.",
        "Open the Logo tab to add your logo, and the Style or Themes tab to pick colors.",
        "Wait for the green scan check, then download PNG, JPG or SVG.",
      ]}
      tipsTitle="Tips for More Instagram Scans"
      tips={[
        { label: "Add a call to action", text: "A frame with text like 'Scan to follow' gets more scans than a bare code. Use the Poster tab." },
        { label: "Link the profile, not a post", text: "Profile links stay useful for years; a single post or reel link is best for campaigns." },
        { label: "Size it right", text: "Print at least 2 x 2 cm on cards and 5 x 5 cm or more on posters and shop windows." },
      ]}
      faqTitle="Instagram QR Code FAQ"
      faqs={[
        { q: "How do I make a QR code for my Instagram?", a: "Copy your profile link (instagram.com/yourname), paste it into QR Vibe, optionally add your logo and colors, and download the QR code. It's free and needs no sign-up." },
        { q: "Is this different from Instagram's built-in QR code?", a: "Instagram's own QR code has fixed styles. QR Vibe lets you add your logo, use your brand colors, add a frame, and download print-quality SVG files." },
        { q: "Will my Instagram QR code expire?", a: "No. The QR code contains your Instagram link directly, so it works as long as your profile or post exists." },
      ]}
    />
  );
}
