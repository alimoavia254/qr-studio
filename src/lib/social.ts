import type { SocialPlatform } from "@/types/qr";

export const SOCIAL_PLATFORMS: { id: SocialPlatform; label: string; hint: string }[] = [
  { id: "instagram", label: "Instagram", hint: "instagram.com/" },
  { id: "tiktok", label: "TikTok", hint: "tiktok.com/@" },
  { id: "facebook", label: "Facebook", hint: "facebook.com/" },
  { id: "youtube", label: "YouTube", hint: "youtube.com/@" },
  { id: "whatsapp", label: "WhatsApp", hint: "wa.me/ (phone number)" },
  { id: "telegram", label: "Telegram", hint: "t.me/" },
  { id: "x", label: "X (Twitter)", hint: "x.com/" },
  { id: "snapchat", label: "Snapchat", hint: "snapchat.com/add/" },
  { id: "linkedin", label: "LinkedIn", hint: "linkedin.com/in/" },
];

/** Username or full link -> profile URL. Returns null when the value is empty. */
export function socialUrl(platform: SocialPlatform, value: string, message = ""): string | null {
  const v = value.trim();
  if (!v) return null;
  if (/^https?:\/\//i.test(v)) return v;
  const h = v.replace(/^@+/, "").replace(/^\/+|\/+$/g, "");
  if (!h) return null;
  if (platform === "whatsapp") {
    const digits = h.replace(/\D/g, "");
    const text = message.trim();
    return digits ? `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}` : null;
  }
  const e = encodeURIComponent(h);
  switch (platform) {
    case "instagram": return `https://instagram.com/${e}`;
    case "facebook": return `https://facebook.com/${e}`;
    case "tiktok": return `https://www.tiktok.com/@${e}`;
    case "youtube": return `https://youtube.com/@${e}`;
    case "telegram": return `https://t.me/${e}`;
    case "x": return `https://x.com/${e}`;
    case "linkedin": return `https://linkedin.com/in/${e}`;
    case "snapchat": return `https://snapchat.com/add/${e}`;
  }
}

/**
 * All profiles in one QR as plain text. Every link sits on its own line with a blank line around it,
 * so phones show them as separate tappable links and any single one is easy to select and copy.
 */
export function socialsText(name: string, tagline: string, links: Partial<Record<SocialPlatform, string>>): string {
  const blocks: string[] = [];
  const head = [name.trim(), tagline.trim()].filter(Boolean).join("\n");
  if (head) blocks.push(head);
  for (const p of SOCIAL_PLATFORMS) {
    const url = socialUrl(p.id, links[p.id] ?? "");
    if (url) blocks.push(`${p.label}\n${url}`);
  }
  return blocks.join("\n\n");
}
