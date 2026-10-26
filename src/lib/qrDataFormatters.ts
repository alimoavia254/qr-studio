import { QRDesignConfig } from "@/types/qr";

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
      const cleanPhone = (config.whatsapp.countryCode + config.whatsapp.phone).replace(/[^0-9]/g, "");
      if (!cleanPhone) return "https://wa.me/";
      const text = encodeURIComponent(config.whatsapp.message || "");
      return text ? `https://wa.me/${cleanPhone}?text=${text}` : `https://wa.me/${cleanPhone}`;
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
      const { email, subject, body } = config.email;
      const params: string[] = [];
      if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
      if (body) params.push(`body=${encodeURIComponent(body)}`);
      const query = params.length > 0 ? `?${params.join("&")}` : "";
      return `mailto:${email.trim()}${query}`;
    }

    case "text":
    default:
      return config.text || "Hello from QR Studio!";
  }
}
