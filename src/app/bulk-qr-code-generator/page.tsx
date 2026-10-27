import type { Metadata } from "next";
import { Layers, FileArchive, Lock } from "lucide-react";
import { UseCasePage } from "@/components/UseCasePage";
import { pageMetadata } from "@/lib/seo";
import { BulkGenerator } from "@/components/BulkGenerator";

export const metadata: Metadata = pageMetadata({
  path: "/bulk-qr-code-generator",
  title: "Bulk QR Code Generator - Free, Download as ZIP",
  description: "Make up to 200 QR codes at once from a list or CSV file. Pick a style, add your logo and download everything as a ZIP of PNG or SVG files. Free, no sign-up.",
  socialTitle: "Free Bulk QR Code Generator | QR Vibe",
  socialDescription: "Turn a list of links or a CSV into hundreds of styled QR codes in one ZIP.",
});

export default function BulkQRPage() {
  return (
    <UseCasePage
      path="/bulk-qr-code-generator"
      tool={<BulkGenerator />}
      badgeIcon={Layers}
      badge="Up to 200 codes per ZIP"
      titleLead="Free Bulk"
      titleAccent="QR Code Generator"
      intro="Paste a list of links or upload a CSV, choose one style, and download every QR code in a single ZIP. Ideal for table numbers, product labels, tickets and staff badges."
      features={[
        { icon: Layers, title: "Hundreds in One Go", text: "Generate up to 200 QR codes per batch, all in the same style, with optional logo in the middle." },
        { icon: FileArchive, title: "Named Files in a ZIP", text: "Add a name column to control file names like table-1.png, or let us number them 001, 002, 003." },
        { icon: Lock, title: "Your List Stays Private", text: "Everything runs in your browser. Your links and CSV are never uploaded." },
      ]}
      howToName="How to make QR codes in bulk"
      stepsTitle="How to Make QR Codes in Bulk"
      steps={[
        "Paste one link or text per line, or tap Upload CSV / TXT.",
        "If your lines look like name,link, tick the file-name checkbox.",
        "Choose a style, size and file type. Add your logo if you want one.",
        "Check the sample, then tap Download to get a ZIP of all QR codes.",
      ]}
      tipsTitle="Tips for Bulk QR Codes"
      tips={[
        { label: "Test one first", text: "Scan the sample with a phone before you print hundreds." },
        { label: "Use SVG for print", text: "Vector files stay sharp at any size. Use PNG for screens." },
        { label: "Keep high contrast", text: "Dark dots on a light background scan most reliably in bulk." },
      ]}
      faqTitle="Bulk QR Code Generator FAQ"
      faqs={[
        { q: "How do I create many QR codes at once?", a: "Paste one link per line, or upload a CSV, pick a style, and download the ZIP. Every line becomes its own QR code file." },
        { q: "Is there a limit?", a: "Each batch can include up to 200 QR codes. For more, run several batches." },
        { q: "Can I name each file?", a: "Yes. Tick the file-name checkbox and write each line as name,content, for example table-5,https://example.com/menu?t=5." },
        { q: "Is the bulk generator really free?", a: "Yes. There is no sign-up, no watermark and no limit on how many batches you make." },
      ]}
    />
  );
}
