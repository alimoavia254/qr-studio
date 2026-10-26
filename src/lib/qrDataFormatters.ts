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
      let cc = config.whatsapp.countryCode.replace(/[^0-9]/g, "");
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
      const isWame = config.whatsapp.linkStyle === "wame";

      if (isWame) {
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
