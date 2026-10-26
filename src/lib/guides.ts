import type { Faq } from "@/lib/seo";

export type GuideSection = {
  heading: string;
  paragraphs: string[];
  list?: string[];
};

export type Guide = {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  published: string;
  updated: string;
  readMinutes: number;
  tool: { href: string; label: string };
  sections: GuideSection[];
  faqs: Faq[];
};

export const GUIDES: Guide[] = [
  {
    slug: "static-vs-dynamic-qr-codes",
    title: "Static vs Dynamic QR Codes: Which One Should You Use?",
    description:
      "The real difference between static and dynamic QR codes, why some 'free' QR codes stop working, and how to choose the right type for print, menus and marketing.",
    excerpt:
      "Why some free QR codes suddenly stop working, and how to pick a type that will still scan in five years.",
    published: "2026-10-26",
    updated: "2026-10-26",
    readMinutes: 6,
    tool: { href: "/", label: "Create a free static QR code" },
    sections: [
      {
        heading: "The short answer",
        paragraphs: [
          "A static QR code stores your content (a URL, Wi-Fi login, contact card or text) directly inside the black and white pattern. A dynamic QR code stores a short redirect link owned by the company that generated it, and that company forwards each scan to your real destination.",
          "If your destination will not change and you want the code to work forever without a subscription, use a static QR code. If you need to change the destination after printing or you need detailed scan analytics, a dynamic code can make sense, but only from a provider you are happy to pay for as long as the code is in circulation.",
        ],
      },
      {
        heading: "How a static QR code works",
        paragraphs: [
          "When you create a static code, the generator encodes your data into the module pattern using the QR code standard (ISO/IEC 18004). A phone camera decodes the pattern and acts on the data immediately. No server sits in the middle, so there is nothing that can expire, go offline or be switched off.",
          "Because the data lives inside the code, longer content produces a denser pattern. A short URL such as https://example.com/menu makes a clean, easy-to-scan code. A 500-character paragraph of text makes a very dense one that needs to be printed larger.",
        ],
      },
      {
        heading: "How a dynamic QR code works",
        paragraphs: [
          "A dynamic code encodes something like https://qr-provider.example/abc123. When someone scans it, the provider's server looks up abc123 and redirects the visitor to the destination you set in your dashboard. That gives you two genuine benefits: you can change the destination later, and the provider can count scans by time, device and approximate location.",
          "The trade-off is dependency. If the provider shuts down, changes its pricing, or your trial or subscription ends, the redirect can stop working. Every printed copy then points at an error page or an upsell screen, and you cannot fix it without reprinting.",
        ],
      },
      {
        heading: "Why so many 'free' QR codes stop working",
        paragraphs: [
          "A common pattern on QR generator websites is to offer a free code that is secretly dynamic. The code works during a 7 or 14 day trial, then the redirect is paused until you subscribe. Restaurants, estate agents and small shops in the US, UK and Europe have reported discovering this only after printing menus, flyers or window signs.",
          "Before you download a code from any generator, check what it actually encodes. Scan it with your phone and look at the preview link. If you see the generator's domain instead of your own URL, it is a dynamic code and it depends on that company.",
        ],
      },
      {
        heading: "Side-by-side comparison",
        paragraphs: ["Here is how the two types compare on the points that matter most to small businesses:"],
        list: [
          "Cost: static codes are free forever; dynamic codes usually require a monthly or yearly plan.",
          "Lifespan: static codes never expire; dynamic codes work only while the provider's redirect is active.",
          "Editing after printing: not possible with static codes; possible with dynamic codes.",
          "Scan analytics: static codes have none built in (use UTM tags with your own analytics); dynamic codes include a dashboard.",
          "Privacy: static codes involve no third party; dynamic codes route every scan through the provider's servers.",
          "Speed: static codes open instantly; dynamic codes add a redirect hop.",
        ],
      },
      {
        heading: "How to track scans with a static QR code",
        paragraphs: [
          "You can still measure results without a dynamic code. Add UTM parameters to the URL before you generate the QR code, for example https://yoursite.com/offer?utm_source=flyer&utm_medium=qr&utm_campaign=spring. Google Analytics, Plausible, Matomo and most other analytics tools will then report visits from that QR code separately.",
          "If you want the freedom to change the destination later, point the static QR code at a page on your own website and set up a redirect on your own domain. You keep full control and never depend on a QR vendor.",
        ],
      },
      {
        heading: "Which should you choose?",
        paragraphs: [
          "Choose static for restaurant menus, business cards, Wi-Fi access, product packaging, posters, WhatsApp chat links and anything you will print in volume. Choose dynamic only for short-term campaigns where analytics matter more than permanence, and only if you are comfortable paying for the full life of the printed material.",
          "Every code made with QR Vibe is static. Your data is encoded directly, nothing passes through our servers, and the code keeps working for as long as the destination exists.",
        ],
      },
    ],
    faqs: [
      {
        q: "Do static QR codes expire?",
        a: "No. A static QR code stores its content inside the pattern itself, so there is no server or subscription that can expire. It works as long as the destination (for example your website) is online.",
      },
      {
        q: "Can I edit a static QR code after printing?",
        a: "Not the code itself. If you may need to change the destination, point the QR code at a URL on your own domain and redirect that URL wherever you want later.",
      },
      {
        q: "How can I tell if a QR code is static or dynamic?",
        a: "Scan it and look at the link preview. If it shows your own domain or the actual content, it is static. If it shows a QR provider's short link, it is dynamic.",
      },
    ],
  },
  {
    slug: "qr-code-size-for-printing",
    title: "What Size Should a QR Code Be? Print Size Guide (cm and inches)",
    description:
      "Minimum QR code print sizes for business cards, flyers, posters and signs, the 10:1 distance rule, quiet zone requirements and the best file format for printing.",
    excerpt:
      "Minimum sizes in cm and inches for business cards, flyers, posters and signs, plus the simple 10:1 distance rule.",
    published: "2026-10-26",
    updated: "2026-10-26",
    readMinutes: 5,
    tool: { href: "/qr-code-for-business-cards", label: "Make a print-ready QR code" },
    sections: [
      {
        heading: "The quick rule: 10:1",
        paragraphs: [
          "A reliable rule of thumb is that a QR code should be at least one tenth of the distance it will be scanned from. If people will scan from 1 metre away, make the code at least 10 cm wide. If they will scan from 30 cm (a menu on a table), 3 cm is enough. In imperial units, a code scanned from 3 feet away should be roughly 3.6 inches wide.",
          "This rule assumes a reasonably simple code. Dense codes with a lot of data need extra size, so keep URLs short where you can.",
        ],
      },
      {
        heading: "Recommended minimum sizes",
        paragraphs: ["These sizes work well for a short URL with good contrast:"],
        list: [
          "Business card: 2 x 2 cm (0.8 x 0.8 in) minimum, 2.5 cm is more comfortable.",
          "Flyer or leaflet (A5 / half letter): 3 to 4 cm (1.2 to 1.6 in).",
          "Restaurant table tent or menu: 3 to 5 cm (1.2 to 2 in).",
          "Product packaging: at least 2 cm, larger if the surface is curved.",
          "A3 / tabloid poster read from 1 to 2 m: 10 to 20 cm (4 to 8 in).",
          "Window sign or banner read from across the street: 50 cm or more.",
        ],
      },
      {
        heading: "Don't forget the quiet zone",
        paragraphs: [
          "The QR code standard asks for a blank margin, called the quiet zone, around the code. It should be about four modules wide (a module is one of the small squares). Without it, the scanner can confuse the edges of the code with nearby text or graphics.",
          "In practice, leave a white border roughly 10 to 15 percent of the code's width on every side, and do not place the code right against the edge of a card or a busy background photo.",
        ],
      },
      {
        heading: "Why data length changes the size you need",
        paragraphs: [
          "QR codes come in versions from 1 (21 x 21 modules) to 40 (177 x 177 modules). The more data you encode, the higher the version and the smaller each module becomes at a given print size. Small modules are harder for a camera to resolve, especially in dim light or from an angle.",
          "A short URL usually fits in version 2 to 4. A full vCard with address, several phone numbers and a long job title can reach version 10 or higher. For business cards, include only the details people actually need.",
        ],
      },
      {
        heading: "Best file format for printing",
        paragraphs: [
          "Use SVG (vector) for anything that goes to a professional printer. Vector files stay perfectly sharp at any size, from a business card to a building banner. Most design tools, including Adobe Illustrator, InDesign, Affinity, Figma and Canva, accept SVG.",
          "If you must use a raster image, export a large PNG (at least 1000 px wide for small print, 2000 px or more for posters) and never enlarge a small PNG, because the edges will blur.",
        ],
      },
      {
        heading: "Print checklist",
        paragraphs: ["Before you send a file to print, run through this list:"],
        list: [
          "Dark code on a light background with strong contrast. Avoid light-on-dark unless you have tested it widely.",
          "Quiet zone of white space around the code.",
          "Short URL, ideally with UTM tags for tracking.",
          "Test-scan the final artwork with both an iPhone and an Android phone, at the real distance and lighting.",
          "Avoid glossy laminate in direct light, which can cause glare.",
          "Add a short call to action such as 'Scan to see the menu' so people know what they will get.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is the smallest size a QR code can be printed?",
        a: "Around 2 x 2 cm (0.8 x 0.8 in) for a short URL scanned up close. Smaller codes can work with very little data and high-quality printing, but they are less reliable.",
      },
      {
        q: "How big should a QR code be on a poster?",
        a: "Use the 10:1 rule. For a poster read from 2 metres away, make the code about 20 cm wide.",
      },
      {
        q: "Is SVG or PNG better for printing QR codes?",
        a: "SVG. It is a vector format, so it prints perfectly sharp at any size. Use PNG for websites, email and social media.",
      },
    ],
  },
  {
    slug: "how-to-make-a-qr-code-for-a-restaurant-menu",
    title: "How to Make a QR Code for a Restaurant Menu (Free, Step by Step)",
    description:
      "Create a free QR code menu for your restaurant, café or bar: host your menu as a PDF or web page, generate a QR code that never expires, and print it on table tents.",
    excerpt:
      "Put your menu online, generate a QR code that never expires, and print table tents that guests actually scan.",
    published: "2026-10-26",
    updated: "2026-10-26",
    readMinutes: 6,
    tool: { href: "/qr-code-generator-with-logo", label: "Create a menu QR code with your logo" },
    sections: [
      {
        heading: "Step 1: Put your menu online",
        paragraphs: [
          "A QR code only points to your menu; the menu itself has to live somewhere online. You have three common options:",
        ],
        list: [
          "A page on your own website (best for search rankings and easiest to update).",
          "A PDF uploaded to your website, Google Drive or Dropbox with public link sharing enabled.",
          "Your listing on a delivery or booking platform, if it shows the full menu.",
        ],
      },
      {
        heading: "Use a link you can keep forever",
        paragraphs: [
          "The best setup is a stable address on your own domain, such as yourrestaurant.com/menu. When prices change, you update that page or replace the PDF at the same address, and every printed QR code keeps working.",
          "If you use Google Drive, replace the file using 'Manage versions' rather than uploading a new file, because a new upload gets a new link and your printed codes would point at the old menu.",
        ],
      },
      {
        heading: "Step 2: Generate the QR code",
        paragraphs: [
          "Open QR Vibe, choose the URL type and paste your menu link. Add your logo in the Logo tab and pick your brand colours. QR Vibe automatically switches to high error correction when a logo is added, so the code stays scannable.",
          "Watch the live scan check before you download. If it warns about contrast, darken the code colour or lighten the background.",
        ],
      },
      {
        heading: "Step 3: Avoid the subscription trap",
        paragraphs: [
          "Many menu QR services offer a free code that is actually a dynamic redirect. After a trial period the redirect stops unless you pay, and every table in the restaurant suddenly shows an error. QR Vibe creates static codes that encode your link directly, so they never expire and never need a plan. Read our guide on static vs dynamic QR codes for more detail.",
        ],
      },
      {
        heading: "Step 4: Design and print table tents",
        paragraphs: [
          "Download the SVG for printing. On a table tent or menu card, a code 3 to 5 cm wide works well because guests scan from about 30 to 50 cm away. Add a clear call to action such as 'Scan for menu and allergens' and, if you take orders at the table, the table number.",
          "Matte card works better than glossy laminate, which reflects overhead lights and can stop cameras from focusing.",
        ],
      },
      {
        heading: "Accessibility and legal points",
        paragraphs: [
          "Not every guest has a smartphone or wants to use one. Keep a few printed menus available. In the UK and EU, allergen information must be available to customers, so make sure it is clearly visible in your online menu or available from staff. In the US, many states and cities have their own menu labelling rules for larger chains.",
          "Make the online menu easy to read on a phone: large text, no tiny PDF columns, and prices clearly listed.",
        ],
      },
      {
        heading: "Bonus: add a Wi-Fi QR code",
        paragraphs: [
          "Guests often ask for the Wi-Fi password. A second QR code on the table tent, made with the Wi-Fi QR code generator, lets them join without typing anything. Use a separate guest network rather than the one your till or card machines use.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is a QR code menu free to make?",
        a: "Yes. With QR Vibe you can create a static menu QR code for free, with no sign-up and no expiry. You only need somewhere to host the menu, such as your website or a public PDF link.",
      },
      {
        q: "Can I update my menu without reprinting the QR code?",
        a: "Yes, as long as the menu stays at the same URL. Update the web page or replace the PDF at the same address and the existing QR codes will show the new version.",
      },
      {
        q: "What size should a menu QR code be?",
        a: "About 3 to 5 cm (1.2 to 2 inches) wide for table tents and menu cards scanned from arm's length.",
      },
    ],
  },
  {
    slug: "qr-code-error-correction-levels",
    title: "QR Code Error Correction Levels Explained (L, M, Q, H)",
    description:
      "What QR code error correction is, how levels L, M, Q and H differ (7%, 15%, 25%, 30%), and which level to use when you add a logo or print on rough surfaces.",
    excerpt:
      "What L, M, Q and H actually mean, and which level you need when you add a logo to a QR code.",
    published: "2026-10-26",
    updated: "2026-10-26",
    readMinutes: 5,
    tool: { href: "/qr-code-generator-with-logo", label: "Try a logo QR code (auto Level H)" },
    sections: [
      {
        heading: "What error correction does",
        paragraphs: [
          "Every QR code contains extra recovery data calculated with Reed-Solomon error correction, the same family of maths used on CDs and in deep-space communication. If part of the code is dirty, scratched, poorly printed or covered by a logo, the scanner uses that recovery data to rebuild the missing pieces.",
          "The QR standard defines four levels. Higher levels can recover more damage, but they need more modules, so the code becomes denser for the same content.",
        ],
      },
      {
        heading: "The four levels",
        paragraphs: ["Approximate share of the code that can be damaged and still be read:"],
        list: [
          "Level L (Low): about 7%. Smallest, simplest code. Good for clean digital screens.",
          "Level M (Medium): about 15%. A sensible default for most printed codes.",
          "Level Q (Quartile): about 25%. Good for industrial labels and outdoor signage.",
          "Level H (High): about 30%. Needed when a logo covers the centre of the code.",
        ],
      },
      {
        heading: "Why logos need Level H",
        paragraphs: [
          "A logo placed in the middle of a QR code physically hides modules. The scanner treats those hidden modules as damage. If the logo covers 15% of the code and you used Level M, there is no recovery margin left for anything else, such as a slightly blurry photo or glare. With Level H, the same logo leaves comfortable headroom.",
          "As a guideline, keep the logo below about 20 to 25% of the code area even at Level H, and never cover the three large square finder patterns in the corners.",
        ],
      },
      {
        heading: "The trade-off: density",
        paragraphs: [
          "Higher error correction adds modules. For a short URL the difference is small, but for long content it can push the code to a much higher version with tiny modules. If you need Level H and have a lot of data, print the code larger or shorten the content.",
        ],
      },
      {
        heading: "Which level should you choose?",
        paragraphs: ["A practical summary:"],
        list: [
          "Plain code on a screen or website: L or M.",
          "Printed flyers, menus, business cards without a logo: M.",
          "Outdoor signs, packaging, labels that may get scuffed: Q.",
          "Any code with a logo or heavy styling: H.",
        ],
      },
      {
        heading: "How QR Vibe handles it",
        paragraphs: [
          "QR Vibe switches to Level H automatically as soon as you upload a logo, then runs a real decoder (jsQR) on your design in the browser to confirm it scans before you download. You do not need to choose the level by hand.",
        ],
      },
    ],
    faqs: [
      {
        q: "What error correction level is best for a QR code with a logo?",
        a: "Level H, which can recover roughly 30% of the code. Keep the logo small and away from the three corner squares.",
      },
      {
        q: "Does higher error correction make a QR code harder to scan?",
        a: "Not by itself, but it makes the code denser. For long content, a denser code needs to be printed larger to scan easily.",
      },
      {
        q: "What error correction level do most QR generators use?",
        a: "Many default to Level M (about 15%). QR Vibe uses M for plain codes and switches to H automatically when you add a logo.",
      },
    ],
  },
  {
    slug: "how-to-scan-a-qr-code-on-iphone-and-android",
    title: "How to Scan a QR Code on iPhone and Android (No App Needed)",
    description:
      "Scan QR codes with the built-in camera on iPhone and Android, scan a QR code from a screenshot or photo, and fix codes that won't scan.",
    excerpt:
      "Use your phone's built-in camera, scan from a screenshot, and fix QR codes that refuse to scan.",
    published: "2026-10-26",
    updated: "2026-10-26",
    readMinutes: 5,
    tool: { href: "/", label: "Create a QR code to test" },
    sections: [
      {
        heading: "On iPhone and iPad",
        paragraphs: [
          "iPhones running iOS 11 or later read QR codes with the standard Camera app. Open Camera, point it at the code and hold steady for a second. A yellow link preview appears; tap it to open the link, join the Wi-Fi network or save the contact.",
          "You can also add the Code Scanner to Control Centre (Settings > Control Centre) for a dedicated scanner that opens with one swipe.",
        ],
      },
      {
        heading: "On Android phones",
        paragraphs: [
          "Most Android phones from the last several years scan QR codes in the default camera app. On Samsung Galaxy phones, the scanner is built into the Camera; on Google Pixel phones, point the camera at the code and tap the link that appears, or use Google Lens.",
          "If your camera does not react, open Google Lens (from the Google app, the search bar widget or the camera) and point it at the code. Quick Settings on many Android phones also has a 'Scan QR code' tile.",
        ],
      },
      {
        heading: "Scanning a QR code from a screenshot or photo",
        paragraphs: [
          "On iPhone, open the image in Photos and press and hold the QR code, or tap the Live Text icon, then tap the link. On Android, open the image in Google Photos and tap Lens. On a computer, Google Lens in Chrome (right-click the image and choose 'Search image with Google') can read QR codes too.",
        ],
      },
      {
        heading: "Why a QR code won't scan",
        paragraphs: ["If a code refuses to scan, the cause is usually one of these:"],
        list: [
          "Low contrast: light grey or pastel codes, or a code on a busy photo.",
          "Inverted colours: a light code on a dark background confuses some older scanners.",
          "Too small for the distance: use the 10:1 rule (code width about one tenth of scan distance).",
          "No quiet zone: text or graphics touching the edge of the code.",
          "Glare or curve: glossy laminate, glass or a code wrapped around a bottle.",
          "Logo too large: covering more than the error correction can recover.",
          "Dirty camera lens: wipe it, it fixes more problems than you would think.",
        ],
      },
      {
        heading: "Scan safely",
        paragraphs: [
          "Always read the link preview before you tap. Be cautious with QR codes stuck on parking meters, EV chargers or in unsolicited letters and emails, because fake codes are used to steal payment details. Our QR code scam guide explains what to look for.",
        ],
      },
    ],
    faqs: [
      {
        q: "Do I need an app to scan QR codes?",
        a: "No. iPhones (iOS 11+) and most modern Android phones scan QR codes with the built-in camera or Google Lens.",
      },
      {
        q: "How do I scan a QR code that is on my own screen?",
        a: "Take a screenshot, then open it in Photos (iPhone) and press on the code, or in Google Photos and tap Lens (Android).",
      },
      {
        q: "Why does my camera not detect the QR code?",
        a: "Check the lighting, move closer or further away, clean the lens, and make sure the code has strong contrast and a white margin. On Android, try Google Lens.",
      },
    ],
  },
  {
    slug: "qr-code-scams-how-to-stay-safe",
    title: "QR Code Scams (Quishing): How to Spot a Fake QR Code",
    description:
      "How QR code phishing ('quishing') works, common scams on parking meters, emails and parcels, warning signs of a fake QR code, and how businesses can protect their customers.",
    excerpt:
      "How quishing works, the parking meter and email scams to watch for, and how to protect your customers.",
    published: "2026-10-26",
    updated: "2026-10-26",
    readMinutes: 6,
    tool: { href: "/", label: "Create a safe static QR code" },
    sections: [
      {
        heading: "What is quishing?",
        paragraphs: [
          "Quishing is phishing with a QR code. Instead of a suspicious link in an email, the scammer gives you a QR code that leads to a fake login page, a fake payment page or a malicious download. Because you cannot read a QR code by looking at it, it is easier to trick people, and email filters have historically been worse at checking images than text links.",
          "Consumer protection bodies including the US Federal Trade Commission and the UK's Action Fraud have published warnings about QR code scams, particularly around parking payments and fake delivery notices.",
        ],
      },
      {
        heading: "Common QR code scams",
        paragraphs: ["Watch out for these patterns:"],
        list: [
          "Stickers on parking meters and EV chargers that lead to a fake payment site.",
          "Emails claiming your Microsoft 365 or bank password expires, with a QR code to 'verify'.",
          "Fake parcel delivery cards or letters asking you to scan and pay a small fee.",
          "Stickers placed over a restaurant's genuine menu QR code.",
          "QR codes on social media promising giveaways or crypto rewards.",
        ],
      },
      {
        heading: "Warning signs of a fake QR code",
        paragraphs: [
          "Look at the physical code first. A sticker placed on top of signage, a code that looks misaligned, or a second code next to an official one are all red flags. Then read the link preview your camera shows before tapping it.",
        ],
        list: [
          "The domain does not match the organisation (for example a council parking page on an unrelated .xyz domain).",
          "Shortened links that hide the real destination.",
          "The page asks for passwords, bank details or a one-time code immediately.",
          "Urgency: 'pay within 1 hour or receive a fine'.",
        ],
      },
      {
        heading: "What to do if you scanned a fake code",
        paragraphs: [
          "Do not enter any more information. If you entered card details, contact your bank immediately and ask them to block the card. If you entered a password, change it everywhere you used it and turn on two-factor authentication. In the UK you can report fraud to Action Fraud; in the US, report it to the FTC at ReportFraud.ftc.gov; in EU countries, contact your national police or consumer protection authority.",
        ],
      },
      {
        heading: "How businesses can protect customers",
        paragraphs: [
          "If you display QR codes in public, make them hard to imitate and easy to verify:",
        ],
        list: [
          "Point codes at your own, recognisable domain, not an unfamiliar short link.",
          "Add your logo and brand colours so a plain replacement sticker stands out.",
          "Print the destination URL in text under the code so people can compare.",
          "Check public codes regularly for stickers placed on top.",
          "Use static codes so there is no third-party redirect that could be hijacked or expire.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can scanning a QR code hack my phone?",
        a: "Scanning alone usually does nothing harmful. The risk comes from what you do next: opening a fake site, entering details or installing an app. Always check the link preview before tapping.",
      },
      {
        q: "How do I check where a QR code goes before opening it?",
        a: "Your phone camera shows the link as a preview before opening it. Read the domain carefully. If in doubt, type the organisation's official address yourself instead.",
      },
      {
        q: "Are QR codes made with QR Vibe safe?",
        a: "QR Vibe codes are static and encode exactly the content you enter, with no redirect through our servers. Anyone scanning sees your real link in the preview.",
      },
    ],
  },
];

export function getGuide(slug: string) {
  return GUIDES.find((g) => g.slug === slug);
}
