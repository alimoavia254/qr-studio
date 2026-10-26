import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://qrvibe.online"),
  title: {
    default: "QR Vibe - Free Brand QR Code Generator With Logo",
    template: "%s | QR Vibe",
  },
  description:
    "Free QR code generator with logo. Design scan-tested QR codes with custom colors and gradients. No sign-up, no watermark, HD PNG and SVG downloads.",
  keywords: [
    "QR Vibe",
    "qrvibe",
    "QR code generator",
    "QR code with logo",
    "custom QR code",
    "brand QR code",
    "free QR generator",
    "vector QR code SVG",
    "Wi-Fi QR code",
    "WhatsApp QR code",
    "vCard QR generator",
  ],
  authors: [{ name: "QR Vibe Team" }],
  verification: {
    other: { "msvalidate.01": "3F863F7A3269B3F3D408BC3E2FBBE96F" },
  },
  openGraph: {
    title: "QR Vibe - Branded QR Code Generator With Logo",
    description:
      "Design scannable brand QR codes with logo embedding, custom colors, and verified scannability score.",
    type: "website",
    locale: "en_US",
    siteName: "QR Vibe",
  },
  twitter: {
    card: "summary_large_image",
    title: "QR Vibe - Custom Brand QR Code Generator",
    description:
      "Generate guaranteed-scannable QR codes with your brand logo, custom styles, and high-res vector downloads.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth antialiased dark`}>
      <head>
        <meta name="theme-color" content="#090d16" />
      </head>
      <body className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col">
        {children}
      </body>
    </html>
  );
}
