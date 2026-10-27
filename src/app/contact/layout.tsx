import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/contact",
  title: "Contact Us - Support & Feedback",
  description:
    "Questions, feedback or feature requests for QR Vibe, the free QR code generator with logo? Get in touch with the QR Vibe team.",
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
