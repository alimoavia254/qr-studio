import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "QR Vibe - Free QR Code Generator",
    short_name: "QR Vibe",
    description: "Free QR code generator with logo, bulk export and a built-in scanner. Works offline once installed.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#090d16",
    theme_color: "#090d16",
    categories: ["utilities", "productivity"],
    icons: [
      { src: "/pwa-icon/192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/pwa-icon/512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/pwa-icon/512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Bulk QR codes", url: "/bulk-qr-code-generator" },
      { name: "Scan a QR code", url: "/qr-code-scanner" },
    ],
  };
}
