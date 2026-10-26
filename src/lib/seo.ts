export const SITE_URL = "https://qrvibe.online";
export const SITE_NAME = "QR Vibe";

export type Faq = { q: string; a: string };

export const HOME_FAQS: Faq[] = [
  {
    q: "Is QR Vibe really free?",
    a: "Yes. QR Vibe is 100% free with no sign-up, no watermark and no scan limits. You can download unlimited QR codes as PNG, JPG or SVG.",
  },
  {
    q: "How does QR Vibe ensure the QR code actually scans with a logo?",
    a: "QR codes use Reed-Solomon Error Correction. QR Vibe automatically switches the error correction level to 'High' (Level H) when you upload a logo. Level H allows up to 30% of the QR pattern to be covered or damaged while still being readable, and a built-in decoder test-scans every design before you download it.",
  },
  {
    q: "Why do some colored QR codes fail to scan?",
    a: "The most common reason is low contrast. Phone cameras need strong separation between the dark modules (dots) and the light background. QR Vibe checks contrast in real time and warns you if your colors are too close.",
  },
  {
    q: "Do these QR codes expire or have scan limits?",
    a: "No. All QR codes made with QR Vibe are static and encode your content directly (URL, Wi-Fi details, vCard, WhatsApp link). They never route through a redirect, so they never expire and never need a subscription.",
  },
  {
    q: "What format should I download for printing on packaging or business cards?",
    a: "Choose SVG for professional printing because it scales to any size without pixelation. For digital sharing and social media, the HD or Print PNG option works best.",
  },
  {
    q: "Is my uploaded logo or private data stored on any server?",
    a: "No. Everything runs locally in your web browser. Your Wi-Fi password, contact details and brand logo are never uploaded to a server.",
  },
];

export const PAGE_FAQS: Record<string, Faq[]> = {
  wifi: [
    {
      q: "How do I make a QR code for my Wi-Fi?",
      a: "Choose Wi-Fi in QR Vibe, enter your network name (SSID), password and security type (usually WPA/WPA2), then download the QR code. Guests scan it with their phone camera to join without typing the password.",
    },
    {
      q: "Do Wi-Fi QR codes work on iPhone and Android?",
      a: "Yes. iPhones on iOS 11 or newer and Android phones on Android 10 or newer can join a network straight from the built-in camera app.",
    },
    {
      q: "Is it safe to put my Wi-Fi password in a QR code?",
      a: "The password is stored inside the QR code itself, so anyone who scans it can join. QR Vibe generates it in your browser and never sends it to a server. For public places, use a separate guest network.",
    },
  ],
  whatsapp: [
    {
      q: "How do I create a WhatsApp QR code?",
      a: "Choose WhatsApp in QR Vibe, enter your number with country code (for example 923001234567 for Pakistan), optionally add a pre-filled message, and download. Scanning it opens a chat with you directly.",
    },
    {
      q: "Does the customer need to save my number first?",
      a: "No. A WhatsApp QR code uses a wa.me link, which opens a chat instantly without saving the contact.",
    },
    {
      q: "Can I add a default message to a WhatsApp QR code?",
      a: "Yes. Add text in the message field and it will be pre-typed in the chat when someone scans the code. They can edit it before sending.",
    },
  ],
  businessCard: [
    {
      q: "What is a vCard QR code?",
      a: "A vCard QR code stores your contact details (name, phone, email, company, website) in the standard vCard format. When scanned, the phone offers to save you as a contact in one tap.",
    },
    {
      q: "What size should a QR code be on a business card?",
      a: "Print it at least 2 x 2 cm (0.8 x 0.8 inches) and keep a white margin around it. Download the SVG version for the sharpest print quality.",
    },
    {
      q: "Can I add my company logo to a business card QR code?",
      a: "Yes. Upload your logo in the Logo tab. QR Vibe switches to high error correction automatically so the code still scans.",
    },
  ],
  custom: [
    {
      q: "Can I change the colors and shape of a QR code?",
      a: "Yes. QR Vibe lets you pick dot styles, corner shapes, solid colors or gradients, and add a frame with a call-to-action like 'Scan me'.",
    },
    {
      q: "Will a custom designed QR code still scan?",
      a: "As long as the dots are clearly darker than the background, yes. QR Vibe test-scans your design live and shows a warning if contrast is too low.",
    },
    {
      q: "Can I download a custom QR code as SVG?",
      a: "Yes. Every design can be downloaded as SVG for print or as PNG/JPG in multiple sizes, free and without a watermark.",
    },
  ],
};

export function faqSchema(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
