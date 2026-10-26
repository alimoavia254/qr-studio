import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://qr-studio-rouge-six.vercel.app"),
  title: {
    default: "QR Studio PRO - Free Custom Brand QR Code Generator With Logo",
    template: "%s | QR Studio PRO",
  },
  description:
    "Generate branded, scannable QR codes with custom logo, gradient patterns, and error-correction protection. 100% free, no sign-up, ultra-HD PNG and SVG export.",
  keywords: [
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
  authors: [{ name: "QR Studio Team" }],
  openGraph: {
    title: "QR Studio PRO - Branded QR Code Generator With Logo",
    description:
      "Design scannable brand QR codes with logo embedding, custom colors, and verified scannability score.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "QR Studio PRO - Custom Brand QR Code Generator",
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
