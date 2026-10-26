import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - Support & Feedback",
  description: "Questions, feedback or feature requests for QR Vibe, the free QR code generator with logo? Get in touch with the QR Vibe team.",
  alternates: {
    canonical: "https://qrvibe.online/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
