import type {
  DotType,
  CornerSquareType,
  CornerDotType,
  ErrorCorrectionLevel,
  GradientType,
  ShapeType,
} from "qr-code-styling";

export type QRContentType = "url" | "whatsapp" | "wifi" | "vcard" | "email" | "text";

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

export interface QRCardFrameConfig {
  enabled: boolean;
  text: string;
  subtext: string;
  position: "bottom" | "top";
  theme: "match" | "dark" | "blue" | "emerald" | "amber" | "custom";
  bgColor: string;
  textColor: string;
  style: "badge" | "card" | "banner";
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
