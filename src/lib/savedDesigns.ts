import type { QRDesignConfig } from "@/types/qr";

const KEY = "qrvibe.savedDesigns.v1";
const MAX_SAVED = 30;

export interface SavedDesign {
  id: string;
  name: string;
  savedAt: number;
  thumb: string | null;
  config: QRDesignConfig;
}

export function loadSavedDesigns(): SavedDesign[] {
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? (JSON.parse(raw) as SavedDesign[]) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

/** Returns false when storage is full or blocked. */
export function persistSavedDesigns(list: SavedDesign[]): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX_SAVED)));
    return true;
  } catch {
    return false;
  }
}

/* ---------------- Share links ---------------- */

const toB64Url = (s: string) => {
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

const fromB64Url = (s: string) => {
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
};

/** Encodes the design into a URL hash. Uploaded logos (data: URLs) are too big for a link, so they are left out. */
export function encodeDesign(config: QRDesignConfig): { hash: string; logoDropped: boolean } {
  const logoDropped = Boolean(config.logoUrl?.startsWith("data:"));
  const slim = logoDropped ? { ...config, logoUrl: null } : config;
  return { hash: `#d=${toB64Url(JSON.stringify(slim))}`, logoDropped };
}

export function decodeDesign(hash: string): Partial<QRDesignConfig> | null {
  const m = /^#d=([A-Za-z0-9_-]+)$/.exec(hash);
  if (!m) return null;
  try {
    const parsed = JSON.parse(fromB64Url(m[1]));
    return parsed && typeof parsed === "object" ? (parsed as Partial<QRDesignConfig>) : null;
  } catch {
    return null;
  }
}
