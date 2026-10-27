import { QRDesignConfig } from "@/types/qr";
import { socialUrl, socialsText } from "@/lib/social";
import { formatCryptoAmount } from "@/lib/cryptoAddress";

const digitsOnly = (v: string) => v.replace(/[^0-9+]/g, "");

/** iCalendar text values: escape backslash, comma, semicolon and newlines. */
const icsEscape = (v: string) =>
  v.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

/** "2026-10-27T14:30" -> "20261027T143000", "2026-10-27" -> "20261027" */
const icsDate = (v: string, allDay: boolean) => {
  const [d = "", t = ""] = v.split("T");
  const date = d.replace(/-/g, "");
  if (allDay) return date;
  return `${date}T${(t || "00:00").replace(/:/g, "").padEnd(6, "0").slice(0, 6)}`;
};

const addDay = (ymd: string) => {
  const d = new Date(`${ymd.slice(0, 10)}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
};

export function formatQRData(config: QRDesignConfig): string {
  switch (config.contentType) {
    case "url": {
      let url = config.url.trim();
      if (!url) return "https://example.com";
      if (!/^https?:\/\//i.test(url)) {
        url = `https://${url}`;
      }
      return url;
    }

    case "whatsapp": {
      const cc = config.whatsapp.countryCode.replace(/[^0-9]/g, "");
      let phone = config.whatsapp.phone.replace(/[^0-9]/g, "");

      // Automatically strip leading zero (e.g. 0300... -> 300...)
      phone = phone.replace(/^0+/, "");

      // Avoid duplicating country code if user typed country code in phone box
      let cleanPhone = phone;
      if (cc && !phone.startsWith(cc)) {
        cleanPhone = `${cc}${phone}`;
      }

      if (!cleanPhone) {
        cleanPhone = "15551234567";
      }

      const text = encodeURIComponent(config.whatsapp.message || "");

      // Direct App Intent scheme (launches WhatsApp app directly on Android scanners)
      if (config.whatsapp.linkStyle === "intent") {
        return text
          ? `whatsapp://send?phone=${cleanPhone}&text=${text}`
          : `whatsapp://send?phone=${cleanPhone}`;
      }

      // Short link (wa.me)
      if (config.whatsapp.linkStyle === "wame") {
        return text ? `https://wa.me/${cleanPhone}?text=${text}` : `https://wa.me/${cleanPhone}`;
      }

      // Default: Universal official WhatsApp URL that triggers the "Open in WhatsApp" OS prompt on all Android & iOS camera scanners
      return text
        ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${text}`
        : `https://api.whatsapp.com/send?phone=${cleanPhone}`;
    }

    case "wifi": {
      const { ssid, password, encryption, hidden } = config.wifi;
      const cleanSsid = ssid.replace(/([\\;,:"])/g, "\\$1");
      const cleanPass = password.replace(/([\\;,:"])/g, "\\$1");
      const hiddenStr = hidden ? "H:true;" : "";
      return `WIFI:T:${encryption};S:${cleanSsid};P:${cleanPass};${hiddenStr};`;
    }

    case "vcard": {
      const { firstName, lastName, phone, email, company, title, website, address } = config.vcard;
      const lines = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:${lastName || ""};${firstName || ""};;;`,
        `FN:${[firstName, lastName].filter(Boolean).join(" ") || "Contact"}`,
      ];
      if (company) lines.push(`ORG:${company}`);
      if (title) lines.push(`TITLE:${title}`);
      if (phone) lines.push(`TEL;TYPE=CELL:${phone}`);
      if (email) lines.push(`EMAIL:${email}`);
      if (website) lines.push(`URL:${website}`);
      if (address) lines.push(`ADR:;;${address};;;;`);
      lines.push("END:VCARD");
      return lines.join("\n");
    }

    case "email": {
      const { email, subject, body, format } = config.email;
      const cleanEmail = email.trim();

      // MATMSG format (widely recognized by Android cameras & QR scanners to auto-populate TO, SUB, and BODY)
      if (format === "matmsg") {
        const cleanSub = (subject || "").replace(/;/g, "\\;");
        const cleanBody = (body || "").replace(/;/g, "\\;");
        return `MATMSG:TO:${cleanEmail};SUB:${cleanSub};BODY:${cleanBody};;`;
      }

      // Default: RFC 6068 mailto URI with strict CRLF line-break encoding
      const params: string[] = [];
      if (subject) {
        params.push(`subject=${encodeURIComponent(subject)}`);
      }
      if (body) {
        const formattedBody = body.replace(/\r?\n/g, "\r\n");
        params.push(`body=${encodeURIComponent(formattedBody)}`);
      }
      const query = params.length > 0 ? `?${params.join("&")}` : "";
      return `mailto:${cleanEmail}${query}`;
    }

    case "sms": {
      const phone = digitsOnly(config.sms.phone) || "+15551234567";
      const body = config.sms.message.trim();
      return body ? `SMSTO:${phone}:${body}` : `SMSTO:${phone}`;
    }

    case "phone":
      return `tel:${digitsOnly(config.phone.phone) || "+15551234567"}`;

    case "geo": {
      const lat = parseFloat(config.geo.lat);
      const lng = parseFloat(config.geo.lng);
      const ok = Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
      const la = ok ? lat : 31.5204;
      const ln = ok ? lng : 74.3587;
      return config.geo.linkStyle === "maps"
        ? `https://www.google.com/maps/place/${la}%2C${ln}`
        : `geo:${la},${ln}`;
    }

    case "event": {
      const e = config.event;
      const start = e.start || (e.allDay ? "2026-12-01" : "2026-12-01T10:00");
      let end = e.end || start;
      // iCalendar and Google both treat an all-day end date as exclusive
      if (e.allDay) end = addDay(end);

      if (e.linkStyle !== "ics") {
        const params = [
          "action=TEMPLATE",
          `text=${encodeURIComponent(e.title || "Event")}`,
          `dates=${icsDate(start, e.allDay)}/${icsDate(end, e.allDay)}`,
        ];
        if (e.description) params.push(`details=${encodeURIComponent(e.description)}`);
        if (e.location) params.push(`location=${encodeURIComponent(e.location)}`);
        return `https://calendar.google.com/calendar/render?${params.join("&")}`;
      }

      const lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "BEGIN:VEVENT",
        `SUMMARY:${icsEscape(e.title || "Event")}`,
        e.allDay ? `DTSTART;VALUE=DATE:${icsDate(start, true)}` : `DTSTART:${icsDate(start, false)}`,
        e.allDay ? `DTEND;VALUE=DATE:${icsDate(end, true)}` : `DTEND:${icsDate(end, false)}`,
      ];
      if (e.location) lines.push(`LOCATION:${icsEscape(e.location)}`);
      if (e.description) lines.push(`DESCRIPTION:${icsEscape(e.description)}`);
      lines.push("END:VEVENT", "END:VCALENDAR");
      return lines.join("\n");
    }

    case "social": {
      const { platform, username, mode, name, tagline, links } = config.social;
      if (mode === "all") {
        return socialsText(name ?? "", tagline ?? "", links ?? {}) || "Add your usernames to build the list.";
      }
      return socialUrl(platform, username) ?? socialUrl(platform, "username") ?? "https://example.com";
    }

    case "crypto": {
      const c = config.crypto;
      const address = c.address.trim() || "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq";
      // BIP-21 style URI. Ethereum amounts are in wei (EIP-681), so only the address is encoded for it.
      const amount = c.coin === "ethereum" ? null : formatCryptoAmount(c.amount);
      return amount ? `${c.coin}:${address}?amount=${amount}` : `${c.coin}:${address}`;
    }

    case "text":
    default:
      return config.text || "Hello from QR Vibe (qrvibe.online)!";
  }
}

/**
 * qr-code-styling writes one byte per character (it drops the high byte of anything above U+00FF),
 * which corrupts characters like "•", "é" or non-Latin text. Passing the UTF-8 bytes as a byte-string
 * makes it store the right bytes, so phones decode the original text.
 */
export function toQRBytes(data: string): string {
  if (/^[\x00-\x7f]*$/.test(data)) return data;
  return Array.from(new TextEncoder().encode(data), (b) => String.fromCharCode(b)).join("");
}
