import type {
  DotType,
  CornerSquareType,
  CornerDotType,
  ErrorCorrectionLevel,
  GradientType,
  ShapeType,
} from "qr-code-styling";

export type QRContentType =
  | "url"
  | "whatsapp"
  | "wifi"
  | "vcard"
  | "email"
  | "text"
  | "sms"
  | "phone"
  | "geo"
  | "event"
  | "social"
  | "crypto";

export interface SmsData {
  phone: string;
  message: string;
}

export interface PhoneData {
  phone: string;
}

export interface GeoData {
  lat: string;
  lng: string;
  linkStyle: "geo" | "maps";
}

export interface EventData {
  title: string;
  location: string;
  description: string;
  allDay: boolean;
  /** "gcal" = Google Calendar link (opens everywhere), "ics" = raw calendar data */
  linkStyle: "gcal" | "ics";
  /** "YYYY-MM-DDTHH:mm" (or "YYYY-MM-DD" when allDay) */
  start: string;
  end: string;
}

export type SocialPlatform =
  | "instagram"
  | "facebook"
  | "tiktok"
  | "youtube"
  | "telegram"
  | "x"
  | "linkedin"
  | "snapchat";

export interface SocialData {
  platform: SocialPlatform;
  /** Username, or a full profile link */
  username: string;
}

export type CryptoCoin = "bitcoin" | "litecoin" | "dogecoin" | "ethereum";

export interface CryptoData {
  coin: CryptoCoin;
  address: string;
  amount: string;
}

export interface WifiData {
  ssid: string;
  password: string;
  encryption: "WPA" | "WEP" | "nopass";
  hidden: boolean;
}

export interface WhatsappData {
  countryCode: string;
  phone: string;
  message: string;
  linkStyle?: "api" | "wame" | "intent";
}

export interface VCardData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  company: string;
  title: string;
  website: string;
  address: string;
}

export interface EmailData {
  email: string;
  subject: string;
  body: string;
  format?: "mailto" | "matmsg";
}

export type PosterTemplateId =
  | "none"
  | "viewfinder-minimal"
  | "payment-merchant"
  | "cafe-menu"
  | "wifi-stand"
  | "vibrant-retro"
  | "luxury-event"
  | "social-creator"
  | "modern-cyber";

export interface QRCardFrameConfig {
  enabled: boolean;
  templateId: PosterTemplateId;
  text: string;
  subtext: string;
  brandName: string;
  footerNote: string;
  showViewfinder: boolean;
  showStepsBadge: boolean;
  position: "bottom" | "top";
  theme: "match" | "dark" | "blue" | "emerald" | "amber" | "custom";
  bgColor: string;
  textColor: string;
  accentColor: string;
  cardBgColor: string;
  cardTextColor: string;
  style: "badge" | "card" | "banner" | "poster";
  layout: "poster" | "compact" | "badge";
}

export interface PosterTemplatePreset {
  id: PosterTemplateId;
  name: string;
  category: "Business" | "Dining & Cafe" | "Events" | "Tech & Wi-Fi" | "Creative";
  tagline: string;
  title: string;
  subtitle: string;
  brandName: string;
  footerNote: string;
  showViewfinder: boolean;
  showStepsBadge: boolean;
  cardBgColor: string;
  cardTextColor: string;
  accentColor: string;
  dotsColor: string;
  gradientColor1?: string;
  gradientColor2?: string;
  bgColor: string;
  cornerSquareColor: string;
  cornerDotColor: string;
  dotType: DotType;
  cornerSquareType: CornerSquareType;
  cornerDotType: CornerDotType;
}

export interface QRDesignConfig {
  contentType: QRContentType;
  // Content values
  url: string;
  text: string;
  wifi: WifiData;
  whatsapp: WhatsappData;
  vcard: VCardData;
  email: EmailData;
  sms: SmsData;
  phone: PhoneData;
  geo: GeoData;
  event: EventData;
  social: SocialData;
  crypto: CryptoData;

  // Visual Styles
  shape: ShapeType;
  dotType: DotType;
  cornerSquareType: CornerSquareType;
  cornerDotType: CornerDotType;

  // Colors
  colorType: "single" | "gradient";
  dotsColor: string;
  gradientColor1: string;
  gradientColor2: string;
  gradientType: GradientType;
  gradientRotation: number;

  // Eye custom colors
  customEyeColor: boolean;
  cornerSquareColor: string;
  cornerDotColor: string;

  // Background
  bgColor: string;
  isTransparentBg: boolean;

  // Logo
  logoUrl: string | null;
  logoSize: number; // 0.15 - 0.45
  logoMargin: number; // 0 - 20
  hideBehindLogo: boolean;

  // Error Correction
  errorCorrectionLevel: ErrorCorrectionLevel;

  // Card Frame / Text Banner
  frame: QRCardFrameConfig;
}

export type ThemeCategory = "vibrant" | "corporate" | "social" | "pastel" | "dark";

export interface QRPreset {
  id: string;
  name: string;
  description: string;
  category: ThemeCategory;
  dotType: DotType;
  cornerSquareType: CornerSquareType;
  cornerDotType: CornerDotType;
  colorType: "single" | "gradient";
  dotsColor: string;
  gradientColor1: string;
  gradientColor2: string;
  gradientType: GradientType;
  bgColor: string;
  customEyeColor?: boolean;
  cornerSquareColor?: string;
  cornerDotColor?: string;
}
