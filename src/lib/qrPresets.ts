import { QRPreset } from "@/types/qr";

export const QR_PRESETS: QRPreset[] = [
  {
    id: "midnight-neon",
    name: "Midnight Neon",
    description: "Cyberpunk cyan and purple gradient",
    dotType: "rounded",
    cornerSquareType: "extra-rounded",
    cornerDotType: "dot",
    colorType: "gradient",
    dotsColor: "#06b6d4",
    gradientColor1: "#06b6d4",
    gradientColor2: "#a855f7",
    gradientType: "linear",
    bgColor: "#090d16",
    customEyeColor: true,
    cornerSquareColor: "#22d3ee",
    cornerDotColor: "#c084fc",
  },
  {
    id: "emerald-luxury",
    name: "Emerald Luxury",
    description: "Deep emerald with gold accents",
    dotType: "classy-rounded",
    cornerSquareType: "extra-rounded",
    cornerDotType: "dot",
    colorType: "gradient",
    dotsColor: "#059669",
    gradientColor1: "#059669",
    gradientColor2: "#10b981",
    gradientType: "linear",
    bgColor: "#ffffff",
    customEyeColor: true,
    cornerSquareColor: "#047857",
    cornerDotColor: "#059669",
  },
  {
    id: "royal-indigo",
    name: "Royal Indigo",
    description: "Vibrant indigo to violet gradient",
    dotType: "dots",
    cornerSquareType: "extra-rounded",
    cornerDotType: "dot",
    colorType: "gradient",
    dotsColor: "#4f46e5",
    gradientColor1: "#4f46e5",
    gradientColor2: "#7c3aed",
    gradientType: "linear",
    bgColor: "#ffffff",
    customEyeColor: true,
    cornerSquareColor: "#4338ca",
    cornerDotColor: "#6d28d9",
  },
  {
    id: "sunset-glow",
    name: "Sunset Glow",
    description: "Warm gradient from rose to amber",
    dotType: "extra-rounded",
    cornerSquareType: "extra-rounded",
    cornerDotType: "dot",
    colorType: "gradient",
    dotsColor: "#f43f5e",
    gradientColor1: "#f43f5e",
    gradientColor2: "#f59e0b",
    gradientType: "linear",
    bgColor: "#ffffff",
    customEyeColor: true,
    cornerSquareColor: "#e11d48",
    cornerDotColor: "#d97706",
  },
  {
    id: "modern-mono",
    name: "Monochrome Pro",
    description: "Clean pitch black with soft rounded dots",
    dotType: "rounded",
    cornerSquareType: "extra-rounded",
    cornerDotType: "dot",
    colorType: "single",
    dotsColor: "#0f172a",
    gradientColor1: "#0f172a",
    gradientColor2: "#1e293b",
    gradientType: "linear",
    bgColor: "#ffffff",
    customEyeColor: false,
    cornerSquareColor: "#0f172a",
    cornerDotColor: "#0f172a",
  },
  {
    id: "classic-square",
    name: "Classic High-Speed",
    description: "Standard industrial square pattern",
    dotType: "square",
    cornerSquareType: "square",
    cornerDotType: "square",
    colorType: "single",
    dotsColor: "#000000",
    gradientColor1: "#000000",
    gradientColor2: "#000000",
    gradientType: "linear",
    bgColor: "#ffffff",
    customEyeColor: false,
    cornerSquareColor: "#000000",
    cornerDotColor: "#000000",
  },
];

// Curated sample SVG logos encoded for quick 1-click user testing
export const SAMPLE_LOGOS = [
  {
    name: "WhatsApp",
    icon: "wa",
    color: "#25D366",
    url: "data:image/svg+xml;utf8," + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="96" height="96" fill="#25D366">
        <circle cx="12" cy="12" r="12" fill="#25D366"/>
        <path fill="#ffffff" d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.276-.101-.477-.15-.678.15-.201.301-.778.979-.954 1.18-.176.201-.352.226-.653.075-1.848-.925-3.055-1.996-4.275-4.093-.324-.557.324-.517.928-1.724.101-.201.05-.377-.025-.527-.075-.151-.678-1.633-.929-2.235-.245-.586-.494-.506-.678-.515-.176-.008-.377-.01-.578-.01s-.527.075-.804.377c-.276.301-1.055 1.03-1.055 2.511 0 1.482 1.08 2.913 1.231 3.114.15.201 2.124 3.243 5.146 4.549 2.511 1.086 2.511.724 2.963.684.452-.04 1.456-.595 1.662-1.171.206-.576.206-1.07.145-1.171-.06-.101-.261-.161-.562-.311z"/>
      </svg>
    `),
  },
  {
    name: "Website / Globe",
    icon: "globe",
    color: "#3b82f6",
    url: "data:image/svg+xml;utf8," + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="96" height="96">
        <circle cx="12" cy="12" r="12" fill="#3b82f6"/>
        <path fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 0c-2.5 3-4 6.5-4 10s1.5 7 4 10m0-20c2.5 3 4 6.5 4 10s-1.5 7-4 10M2 12h20"/>
      </svg>
    `),
  },
  {
    name: "Instagram",
    icon: "insta",
    color: "#e1306c",
    url: "data:image/svg+xml;utf8," + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="96" height="96">
        <defs>
          <radialGradient id="ig-grad" cx="0.2" cy="1" r="1">
            <stop offset="0%" stop-color="#ffd521"/>
            <stop offset="25%" stop-color="#f50000"/>
            <stop offset="70%" stop-color="#b900b4"/>
            <stop offset="100%" stop-color="#4e00c2"/>
          </radialGradient>
        </defs>
        <rect width="24" height="24" rx="6" fill="url(#ig-grad)"/>
        <rect x="5.5" y="5.5" width="13" height="13" rx="3.5" fill="none" stroke="#ffffff" stroke-width="1.8"/>
        <circle cx="12" cy="12" r="3.2" fill="none" stroke="#ffffff" stroke-width="1.8"/>
        <circle cx="15.8" cy="8.2" r="0.9" fill="#ffffff"/>
      </svg>
    `),
  },
  {
    name: "Wi-Fi",
    icon: "wifi",
    color: "#6366f1",
    url: "data:image/svg+xml;utf8," + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="96" height="96">
        <circle cx="12" cy="12" r="12" fill="#6366f1"/>
        <path fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" d="M5 9c4.2-3.8 9.8-3.8 14 0M8 13c2.4-2.2 5.6-2.2 8 0M11 17a1.5 1.5 0 1 1 2 0"/>
      </svg>
    `),
  },
  {
    name: "Store / Cart",
    icon: "cart",
    color: "#f59e0b",
    url: "data:image/svg+xml;utf8," + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="96" height="96">
        <circle cx="12" cy="12" r="12" fill="#f59e0b"/>
        <path fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M6 6h15l-1.5 9h-12zM6 6l-1-3H2m7 18a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
      </svg>
    `),
  },
];
