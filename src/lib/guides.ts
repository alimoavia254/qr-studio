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
      "Static vs dynamic QR codes explained: why some 'free' QR codes stop working, and how to pick the right type for print, menus and marketing.",
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
    title: "What Size Should a QR Code Be? Print Size Guide",
    description:
      "Minimum QR code print sizes for business cards, flyers, posters and signs, plus the 10:1 distance rule, quiet zone and best file format.",
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
    title: "How to Make a QR Code for a Restaurant Menu (Free)",
    description:
      "Make a free QR code menu for your restaurant, café or bar: host the menu as a PDF or web page, create a QR code that never expires, and print it.",
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
      "How QR code phishing ('quishing') works, common scams on parking meters, emails and parcels, and the warning signs of a fake QR code.",
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
  {
    slug: "how-to-test-a-qr-code-before-printing",
    title: "How to Test a QR Code Before You Print It (Checklist)",
    description:
      "A simple checklist to test a QR code before printing: scan on iPhone and Android, check size, contrast and logo, and confirm the link opens the right page.",
    excerpt:
      "Printing 500 flyers with a QR code that does not scan is an expensive mistake. Run through this checklist first.",
    published: "2026-10-27",
    updated: "2026-10-27",
    readMinutes: 5,
    tool: { href: "/", label: "Make a QR code with a live scan test" },
    sections: [
      {
        heading: "Why testing matters",
        paragraphs: [
          "A QR code that looks fine on screen can still fail once it is printed small, on glossy paper, or in dim light. The only way to know it works is to scan the exact design you plan to print, on real phones, at the size you plan to print it.",
          "Testing takes two minutes and costs nothing. Reprinting packaging, menus or signs costs real money.",
        ],
      },
      {
        heading: "The pre-print checklist",
        paragraphs: ["Work through these checks in order before you send anything to a printer:"],
        list: [
          "Scan the final design with the built-in camera app on at least one iPhone and one Android phone.",
          "Confirm the link opens the correct page, and that the page loads on mobile data, not only on your office Wi-Fi.",
          "Check the preview text your phone shows before opening. It should be your own address, not an unfamiliar redirect domain.",
          "Print a test copy at the real size and scan that paper copy, not the screen.",
          "Scan it from the distance people will actually stand or sit, for example a table tent at arm's length.",
          "Try it in poor light and with a slight angle. A good code should still read.",
          "If you added a logo, confirm error correction is set to High (Level H) and the logo is not oversized.",
          "Leave a clear blank margin around the code. Do not let text, borders or photos touch it.",
        ],
      },
      {
        heading: "Common reasons a code fails",
        paragraphs: [
          "Low contrast between the dots and the background is the most common cause. The dots should be clearly darker than the background. Very light colors, or colors that look different on screen than in print, can break scanning.",
          "Other frequent causes are printing too small, a logo that covers too much of the pattern, stretched or distorted artwork, glare from glossy lamination, and a missing blank margin around the code.",
        ],
      },
      {
        heading: "Use a built-in scan check",
        paragraphs: [
          "QR Vibe decodes the preview in your browser while you design and shows whether it reads, plus a warning when contrast or logo size is risky. This catches most design mistakes early. It does not replace a real phone test of your printed copy, so still do the checklist above before a large print run.",
        ],
      },
    ],
    faqs: [
      {
        q: "How do I check if my QR code works?",
        a: "Scan it with your phone's camera app, confirm the preview shows your own link and that the page opens. Then print a test copy at the real size and scan that too.",
      },
      {
        q: "What size should I test at?",
        a: "Test at the exact size you will print. A code that scans at 10 cm on screen may fail at 2 cm on a business card, especially with long links or logos.",
      },
      {
        q: "Does a QR code work on any phone?",
        a: "Current iPhone and Android phones can scan QR codes with the built-in camera. Always confirm on your own devices before printing.",
      },
    ],
  },
  {
    slug: "best-colors-for-qr-codes",
    title: "Best Colors for QR Codes: Contrast Rules That Still Scan",
    description:
      "Which QR code colors scan reliably? Learn contrast rules, why light-on-dark can fail, and how to use brand colors and gradients without breaking your code.",
    excerpt:
      "You can use brand colors on a QR code, but only if the contrast is strong. Here is how to keep it scannable.",
    published: "2026-10-27",
    updated: "2026-10-27",
    readMinutes: 5,
    tool: { href: "/custom-qr-code-generator", label: "Design a custom colored QR code" },
    sections: [
      {
        heading: "The one rule that matters: contrast",
        paragraphs: [
          "A QR code is read by comparing dark modules (the dots) against a light background. Phone cameras need a clear difference in brightness between the two. Hue matters far less than lightness: a dark navy dot on a white background scans well, while a bright yellow dot on white does not, even though both are colorful.",
          "A reliable starting point is dark dots on a light background, which is exactly what most printed QR codes use.",
        ],
      },
      {
        heading: "How QR Vibe rates your colors",
        paragraphs: [
          "QR Vibe calculates the contrast ratio between your dot color and background in real time. It treats a ratio of about 7:1 or higher as excellent, 4.5:1 or higher as good, 3:1 or higher as risky, and anything below 3:1 as likely to fail on many phones. These are the tool's own guidance thresholds, so treat them as a safe rule of thumb rather than a guarantee.",
        ],
      },
      {
        heading: "Colors and styles to be careful with",
        paragraphs: ["These choices are the usual cause of failed scans:"],
        list: [
          "Light dots on a dark background (inverted codes). Some scanner apps do not read them, so test on your target phones.",
          "Pastel or yellow dots on white.",
          "Gradients that fade toward the background color. Keep the lightest part of the gradient dark enough.",
          "Busy photo backgrounds behind the code.",
          "Transparent backgrounds placed on top of patterned or colored surfaces.",
        ],
      },
      {
        heading: "Using brand colors safely",
        paragraphs: [
          "Pick your darkest brand color for the dots and keep the background white or very light. If your brand color is bright, use a darker shade of it for the code. Place your logo in the center with High error correction, and keep the logo small.",
          "Finally, remember that printed colors can look different from your screen. Always scan a printed proof before a full print run.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can I make a QR code in my brand colors?",
        a: "Yes, as long as the dots are clearly darker than the background. Use a dark shade of your brand color on a white or very light background.",
      },
      {
        q: "Do inverted QR codes with light dots scan?",
        a: "Some scanners read them and some do not. For print, dark dots on a light background is the safest choice.",
      },
      {
        q: "Can I use a gradient on a QR code?",
        a: "Yes, but keep every part of the gradient dark enough against the background. QR Vibe warns you if contrast gets too low.",
      },
    ],
  },
  {
    slug: "how-to-make-an-email-qr-code",
    title: "How to Make an Email QR Code (With Subject and Message)",
    description:
      "Create an email QR code that opens a new message with your address, subject and body filled in. Free, no sign-up, works on iPhone and Android.",
    excerpt:
      "Let people email you with one scan: the address, subject and message are already filled in.",
    published: "2026-10-27",
    updated: "2026-10-27",
    readMinutes: 4,
    tool: { href: "/", label: "Create an email QR code" },
    sections: [
      {
        heading: "What an email QR code does",
        paragraphs: [
          "An email QR code stores a mailto link. When someone scans it, their phone opens the default email app with a new message already addressed to you. You can also pre-fill the subject line and the message body.",
          "It is useful on business cards, flyers, product packaging, event posters and support leaflets, anywhere typing an email address by hand would put people off.",
        ],
      },
      {
        heading: "How to create one",
        paragraphs: ["Follow these steps in QR Vibe:"],
        list: [
          "Open the generator and choose Email as the content type.",
          "Enter the address people should write to.",
          "Optionally add a subject and a short message.",
          "Add your logo or colors in the Logo and Style tabs if you want.",
          "Wait for the scan check to pass, then download PNG or SVG.",
        ],
      },
      {
        heading: "Tips for a better email QR code",
        paragraphs: [
          "Keep the pre-filled subject and message short. Longer text makes the QR pattern denser and harder to scan at small sizes. A clear subject such as Quote request or Event question also helps you sort incoming mail.",
          "Use an address you will keep for years, because a printed static code cannot be edited. A shared role address is better than a personal one that may change.",
          "Be aware that printing an email address in a QR code makes it easy to collect. If you worry about spam, use a dedicated address and a spam filter.",
        ],
      },
      {
        heading: "Will it work on every phone?",
        paragraphs: [
          "Current iPhone and Android phones scan QR codes with the built-in camera and open the default mail app. If no mail app is set up on the phone, the scan may not complete, so a phone number or website link is a good backup on printed material.",
        ],
      },
    ],
    faqs: [
      {
        q: "How do I make a QR code that opens an email?",
        a: "Choose Email in QR Vibe, enter the address and optional subject and message, then download the code. Scanning it opens a new email with those details filled in.",
      },
      {
        q: "Can I pre-fill the subject and message?",
        a: "Yes. Add a subject and body and they will appear in the new email. Keep them short so the code stays easy to scan.",
      },
      {
        q: "Does an email QR code expire?",
        a: "No. It is a static code that stores the mailto link directly, so it keeps working as long as the email address does.",
      },
    ],
  },
  {
    slug: "how-to-make-a-qr-code-for-a-pdf",
    title: "How to Make a QR Code for a PDF (Free, Never Expires)",
    description:
      "Make a QR code that opens a PDF: upload the file online, copy its public link, and turn the link into a static QR code. Free, no sign-up, no expiry.",
    excerpt:
      "A QR code cannot hold a PDF itself. Here is the simple two-step way to link one, and how to keep it working.",
    published: "2026-10-28",
    updated: "2026-10-28",
    readMinutes: 5,
    tool: { href: "/", label: "Turn your PDF link into a QR code" },
    sections: [
      {
        heading: "How a PDF QR code really works",
        paragraphs: [
          "A QR code stores only a small amount of data, so it cannot contain a PDF file. Instead, the QR code stores the web address of a PDF that is already online. When someone scans it, their phone opens that address and shows the PDF.",
          "That means you need two things: the PDF uploaded somewhere with a public link, and a QR code that points to that link.",
        ],
      },
      {
        heading: "Step by step",
        paragraphs: ["Follow these steps:"],
        list: [
          "Upload your PDF to a place that gives it a public link, such as your own website, or a file-sharing service where you can set the file to Anyone with the link can view.",
          "Open the link in a private browser window to confirm it opens without signing in.",
          "Copy the link and paste it into the Website link box in QR Vibe.",
          "Add your logo or colors if you like, and wait for the scan check to pass.",
          "Download PNG or SVG, then scan the final design with a phone before you print.",
        ],
      },
      {
        heading: "Keep the link working",
        paragraphs: [
          "A static QR code never expires, but the page it points to can. If you move, rename or delete the PDF, or change its sharing settings, the printed code will open an error page. Choose a stable location and do not rename the file after printing.",
          "If you may need to replace the PDF later, upload the new version to the same link when your hosting allows it, so the printed code keeps working. Be careful with free file-hosting services that may remove files or change links over time.",
        ],
      },
      {
        heading: "Make the PDF easy to open on a phone",
        paragraphs: [
          "Most people will open it on a small screen, so keep the file size modest and use a readable font size. A short, single-column layout works better on mobile than a wide print layout. Put the most important information on the first page.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can a QR code contain a PDF file?",
        a: "No. A QR code stores a link to the PDF, not the file itself. Upload the PDF online and make a QR code from its public link.",
      },
      {
        q: "Will my PDF QR code expire?",
        a: "The static QR code itself never expires, but it only works as long as the PDF link stays online. Do not move, rename or delete the file.",
      },
      {
        q: "Can I change the PDF after printing?",
        a: "Only if you replace the file at the same link. A static QR code cannot be edited, so keep the link stable.",
      },
    ],
  },
  {
    slug: "how-to-share-wifi-with-a-qr-code",
    title: "How to Share Wi-Fi With a QR Code (iPhone and Android)",
    description:
      "Share your Wi-Fi password with a QR code: create the code, print it, and let guests join by scanning. Works on iPhone and Android, with safety tips.",
    excerpt:
      "Stop spelling out long Wi-Fi passwords. Make a QR code guests can scan to join in a second.",
    published: "2026-10-28",
    updated: "2026-10-28",
    readMinutes: 5,
    tool: { href: "/wifi-qr-code-generator", label: "Make a Wi-Fi QR code" },
    sections: [
      {
        heading: "What a Wi-Fi QR code does",
        paragraphs: [
          "A Wi-Fi QR code stores your network name (SSID), password and security type in a standard format. When a guest scans it with their phone camera, the phone offers to join the network without typing anything.",
          "It is ideal for homes, rental properties, cafes, waiting rooms and offices.",
        ],
      },
      {
        heading: "How to make one",
        paragraphs: ["Use these steps:"],
        list: [
          "Open the Wi-Fi QR code generator and choose Wi-Fi.",
          "Type your network name exactly as it appears, including capital letters and symbols.",
          "Enter the password and choose the security type. WPA or WPA2 is the usual choice for home routers.",
          "If your network is hidden, turn on the hidden network option.",
          "Download the code and print it, or display it on a stand or frame.",
        ],
      },
      {
        heading: "How guests scan it",
        paragraphs: [
          "On current iPhones (iOS 11 or newer) and Android phones (Android 10 or newer), guests open the camera app, point it at the code and tap the join prompt. Older Android versions may need a QR scanner app.",
        ],
      },
      {
        heading: "Safety tips",
        paragraphs: [
          "Anyone who can see the QR code can join the network, because the password is stored inside it. For public or semi-public places, create a separate guest network on your router and use that password for the QR code, so your main devices stay private.",
          "If you change your Wi-Fi password, the old printed code stops working and you must make and print a new one. QR Vibe creates the code in your browser, so your password is not uploaded to a server.",
        ],
      },
    ],
    faqs: [
      {
        q: "How do I share my Wi-Fi with a QR code?",
        a: "Create a Wi-Fi QR code with your network name, password and security type, then let guests scan it with their phone camera to join.",
      },
      {
        q: "Does a Wi-Fi QR code work on iPhone and Android?",
        a: "Yes. iPhones with iOS 11 or newer and Android phones with Android 10 or newer can join from the built-in camera.",
      },
      {
        q: "What happens if I change my Wi-Fi password?",
        a: "The old QR code stops working. Generate a new code with the new password and replace the printed copy.",
      },
    ],
  },
  {
    slug: "qr-code-vs-barcode",
    title: "QR Code vs Barcode: What Is the Difference?",
    description:
      "QR code vs barcode explained: how they store data, what each is used for, how much they hold, and which one to choose for products, menus and marketing.",
    excerpt:
      "Both are black and white patterns a scanner can read, but they work differently. Here is when to use which.",
    published: "2026-10-29",
    updated: "2026-10-29",
    readMinutes: 5,
    tool: { href: "/", label: "Create a free QR code" },
    sections: [
      {
        heading: "The short answer",
        paragraphs: [
          "A traditional barcode is a row of vertical lines (one-dimensional) that usually stores a short number, such as a product code. A QR code is a square grid of dots (two-dimensional) that can store much more, including web links, Wi-Fi details, contact cards and text.",
          "Use a barcode for retail product identification and stock systems. Use a QR code when you want a phone to open a link, join a network or save a contact.",
        ],
      },
      {
        heading: "How they store data",
        paragraphs: [
          "A one-dimensional barcode encodes data in the widths of its lines and spaces, and it is read along a single direction. A QR code encodes data across both the horizontal and vertical directions of its grid, which is why it can hold far more in a small area.",
          "QR codes also include error correction, so a code can still be read when part of it is dirty or covered. That is why a small logo in the center of a QR code can still scan.",
        ],
      },
      {
        heading: "Capacity",
        paragraphs: [
          "A standard QR code can hold thousands of characters depending on the content type and error correction level, while a typical retail barcode holds a short numeric code. In practice, most QR codes carry a short link, because shorter data makes a simpler code that scans faster.",
        ],
      },
      {
        heading: "How each one is scanned",
        paragraphs: [
          "Barcodes are traditionally read by dedicated laser or camera scanners at checkouts and in warehouses. QR codes are designed to be read by ordinary smartphone cameras, so people can scan them without installing anything on current iPhone and Android phones.",
        ],
      },
      {
        heading: "Which one should you use?",
        paragraphs: ["A quick guide:"],
        list: [
          "Selling physical products through retail stores: a barcode is required by most retailers.",
          "Linking to a website, menu, social profile or review page: use a QR code.",
          "Sharing Wi-Fi, a contact card or a calendar event: use a QR code.",
          "Tracking inventory internally: either can work, depending on your scanner.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is a QR code a type of barcode?",
        a: "A QR code is a two-dimensional barcode. People usually say barcode for the older one-dimensional line codes and QR code for the square dot pattern.",
      },
      {
        q: "Which holds more data, a QR code or a barcode?",
        a: "A QR code holds much more than a typical one-dimensional barcode because it stores data in two directions.",
      },
      {
        q: "Can a phone scan a barcode?",
        a: "Some scanner apps can, but the built-in camera of current phones is designed mainly for QR codes.",
      },
    ],
  },
  {
    slug: "how-to-make-a-qr-code-for-a-youtube-video",
    title: "How to Make a QR Code for a YouTube Video or Channel",
    description:
      "Create a free QR code that opens your YouTube video or channel: copy the link, make the code, add your logo, and test the scan before you print.",
    excerpt:
      "Send viewers straight to your video or channel from a flyer, product box or shop window.",
    published: "2026-10-29",
    updated: "2026-10-29",
    readMinutes: 4,
    tool: { href: "/social-media-qr-code-generator", label: "Make a YouTube QR code" },
    sections: [
      {
        heading: "What you need",
        paragraphs: [
          "A YouTube QR code is a normal QR code that stores a YouTube link. When someone scans it, their phone opens the video or channel in the YouTube app if it is installed, or in the browser if not.",
        ],
      },
      {
        heading: "Steps",
        paragraphs: ["Follow these steps:"],
        list: [
          "Open your video or channel on YouTube and copy the link from the Share button.",
          "Open QR Vibe and paste the link into the Website link box, or use the social media generator.",
          "Add your logo and brand colors in the Logo and Style tabs.",
          "Wait for the scan check to pass.",
          "Download PNG or SVG and test the final design on a phone.",
        ],
      },
      {
        heading: "Video link or channel link?",
        paragraphs: [
          "A single video link is good for a campaign, product demo or event. A channel link stays useful for longer, because you can keep adding videos and the printed code still leads to your latest content. For long-lived printed material, the channel link is usually the safer choice.",
        ],
      },
      {
        heading: "Tips to get more scans",
        paragraphs: [
          "Add a short call to action next to the code, such as Watch the demo. People scan more when they know what they will get. Print the code large enough to scan from where people will stand, and leave a clear blank margin around it.",
        ],
      },
    ],
    faqs: [
      {
        q: "How do I make a QR code for a YouTube video?",
        a: "Copy the video link from YouTube, paste it into QR Vibe, add your logo or colors, and download the code.",
      },
      {
        q: "Will the QR code stop working if I upload new videos?",
        a: "A channel QR code keeps working as you upload. A single-video code works as long as that video stays public.",
      },
      {
        q: "Is a YouTube QR code free?",
        a: "Yes. QR Vibe is free with no sign-up, and the codes are static, so they never expire.",
      },
    ],
  },
  {
    slug: "qr-code-ideas-for-small-business",
    title: "QR Code Ideas for Small Business: 10 Practical Uses",
    description:
      "10 practical QR code ideas for small business: menus, reviews, Wi-Fi, contact cards, WhatsApp orders, social profiles and more, with tips for each.",
    excerpt:
      "Ten simple ways a shop, cafe or service business can use QR codes without a subscription.",
    published: "2026-10-29",
    updated: "2026-10-29",
    readMinutes: 6,
    tool: { href: "/", label: "Create a QR code for your business" },
    sections: [
      {
        heading: "Why QR codes work for small business",
        paragraphs: [
          "A QR code connects a printed surface, such as a sign, menu or receipt, to something on a phone. It removes typing, which is where most people give up. Static codes cost nothing to keep running, which suits a small budget.",
        ],
      },
      {
        heading: "Ten ideas",
        paragraphs: ["Each of these can be made in QR Vibe:"],
        list: [
          "Menu: link a PDF or online menu on table cards and the door.",
          "Google reviews: link your review page on the counter and receipts.",
          "Wi-Fi: let customers join without asking staff for the password.",
          "WhatsApp ordering or enquiries: open a chat with a pre-filled message.",
          "Business card: a contact QR that saves your details in one tap.",
          "Social profiles: grow followers from shop windows and packaging.",
          "Location: open directions in Google Maps from flyers and ads.",
          "Events: add a sale or workshop to a customer's calendar.",
          "Call or text: open the dialer or messages app with your number ready.",
          "Product pages: link to a how-to video or manual from packaging.",
        ],
      },
      {
        heading: "Make them work well",
        paragraphs: [
          "Place the code where people wait or look, such as tables, counters and entrances. Add a short call to action next to it. Print it large enough and always test the printed copy on a phone before you print many.",
          "Use static codes for printed material so you are never dependent on a third party for the code to keep working.",
        ],
      },
      {
        heading: "Measure what works",
        paragraphs: [
          "Static QR codes do not count scans on their own. If you want to see results, link to a page where you can track visits, or use different pages for different placements and compare visits in your own analytics.",
        ],
      },
    ],
    faqs: [
      {
        q: "What can a small business use QR codes for?",
        a: "Menus, reviews, Wi-Fi, WhatsApp chats, contact cards, social profiles, locations, events and product information.",
      },
      {
        q: "Do I need to pay for a QR code?",
        a: "Not with QR Vibe. Static codes are free and never expire.",
      },
      {
        q: "Can I track scans with a static QR code?",
        a: "A static code does not count scans by itself. Track visits on the page it links to, using your own analytics.",
      },
    ],
  },
  {
    slug: "qr-code-for-wedding-invitations",
    title: "QR Codes for Wedding Invitations: Ideas and Print Tips",
    description:
      "Use QR codes on wedding invitations for RSVP links, maps, schedules and photo albums. Learn what to link and how to print the code so every guest can scan it.",
    excerpt:
      "A small QR code can replace a pile of inserts: RSVP, directions, schedule and photos.",
    published: "2026-10-29",
    updated: "2026-10-29",
    readMinutes: 5,
    tool: { href: "/custom-qr-code-generator", label: "Design a custom QR code" },
    sections: [
      {
        heading: "What to link from an invitation",
        paragraphs: [
          "A QR code lets you keep the invitation clean while giving guests the details they need. Common choices are an RSVP form, the venue location in a maps app, the day's schedule, a gift or registry page, and a shared photo album.",
        ],
      },
      {
        heading: "Pick links that will last",
        paragraphs: [
          "A printed QR code cannot be edited. Use links you control and will not change, and check that each one opens on a phone without needing a login. If you may update details later, link to a single page you can edit, such as a simple wedding website.",
        ],
      },
      {
        heading: "Style it to match",
        paragraphs: [
          "Pick a dark shade from your color scheme for the dots on a light background so the code stays easy to scan. Keep any logo or monogram small. Avoid pastel dots, and test a printed proof on more than one phone.",
        ],
      },
      {
        heading: "Printing tips",
        paragraphs: ["Before you print the full run:"],
        list: [
          "Print the code at least 2 x 2 cm and keep a blank margin around it.",
          "Avoid placing it over textures, foil or glitter that can reduce contrast.",
          "Scan a printed test copy with an iPhone and an Android phone.",
          "Add a short label such as RSVP here, so guests know what the code does.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can I put a QR code on a wedding invitation?",
        a: "Yes. Use it for an RSVP page, venue location, schedule or photo album, and add a short label so guests know what it opens.",
      },
      {
        q: "What size should the QR code be?",
        a: "Print it at least 2 x 2 cm with a blank margin, and test a printed copy before printing all invitations.",
      },
      {
        q: "Will older guests be able to scan it?",
        a: "Most current phones scan QR codes with the camera. Also print the web address in small text as a backup.",
      },
    ],
  },
];

export function getGuide(slug: string) {
  return GUIDES.find((g) => g.slug === slug);
}
