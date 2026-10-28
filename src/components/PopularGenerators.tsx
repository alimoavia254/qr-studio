import Link from "next/link";

const ITEMS = [
  {
    href: "/qr-code-generator-with-logo",
    title: "QR code generator with logo",
    text: "Put your brand logo in the center. Error correction switches to Level H automatically and a live scan test confirms the code reads before you download.",
  },
  {
    href: "/wifi-qr-code-generator",
    title: "Wi-Fi QR code",
    text: "Guests scan once to join your network without typing the password. Works with the built-in camera on current iPhone and Android phones.",
  },
  {
    href: "/whatsapp-qr-code-generator",
    title: "WhatsApp QR code",
    text: "Open a chat with you in one scan, with an optional pre-filled message. Customers do not need to save your number first.",
  },
  {
    href: "/qr-code-for-business-cards",
    title: "Business card (vCard) QR code",
    text: "Let people save your name, phone, email and website as a contact in one tap.",
  },
  {
    href: "/menu-qr-code-generator",
    title: "Restaurant menu QR code",
    text: "Link a PDF or online menu and print a branded table card with a Scan for menu frame.",
  },
  {
    href: "/google-review-qr-code-generator",
    title: "Google review QR code",
    text: "Send customers straight to your review form from a counter sign or receipt.",
  },
  {
    href: "/instagram-qr-code-generator",
    title: "Instagram QR code",
    text: "Turn a profile, post or reel link into a branded code for flyers, packaging and shop windows.",
  },
  {
    href: "/sms-qr-code-generator",
    title: "SMS QR code",
    text: "Open a text message to your number with the message already typed.",
  },
  {
    href: "/phone-call-qr-code-generator",
    title: "Phone call QR code",
    text: "Scan to open the dialer with your number ready to call.",
  },
  {
    href: "/location-qr-code-generator",
    title: "Location QR code",
    text: "Open your place in Google Maps for directions in one scan.",
  },
  {
    href: "/event-qr-code-generator",
    title: "Calendar event QR code",
    text: "Add an event to the phone calendar with date, time and place filled in.",
  },
  {
    href: "/social-media-qr-code-generator",
    title: "Social media QR code",
    text: "Link your Instagram, TikTok, YouTube or other profile from one branded code.",
  },
  {
    href: "/bulk-qr-code-generator",
    title: "Bulk QR code generator",
    text: "Make many QR codes at once from a list and download them as a ZIP.",
  },
  {
    href: "/qr-code-scanner",
    title: "Online QR code scanner",
    text: "Scan a QR code with your camera or an image to see where it leads before you open it.",
  },
  {
    href: "/free-qr-code-generator-no-expiry",
    title: "QR codes that never expire",
    text: "Static codes hold your link directly, so there is no trial, scan limit or subscription that can switch them off.",
  },
];

export function PopularGenerators() {
  return (
    <section className="py-16 bg-slate-950/60 border-t border-slate-900/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-black text-white text-center mb-3">
          Free QR code generators for every use
        </h2>
        <p className="text-center text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mb-10">
          QR Vibe is a free QR code generator with no sign-up and no watermark. Pick the type you need, or read our{" "}
          <Link href="/guides" className="text-indigo-300 hover:underline">
            QR code guides
          </Link>{" "}
          on print size, error correction and staying safe from QR scams.
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ITEMS.map((i) => (
            <li key={i.href} className="rounded-2xl bg-slate-900/50 border border-slate-800 p-5">
              <h3 className="text-base font-bold text-white mb-2">
                <Link href={i.href} className="hover:text-indigo-300">
                  {i.title}
                </Link>
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">{i.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
