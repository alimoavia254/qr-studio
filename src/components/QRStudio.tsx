"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  Globe,
  MessageCircle,
  Wifi,
  Contact,
  Mail,
  FileText,
  Upload,
  Trash2,
  Download,
  Copy,
  Check,
  Sparkles,
  AlertTriangle,
  Eye,
  EyeOff,
  RefreshCw,
  Palette,
  Image as ImageIcon,
  ExternalLink,
  LayoutTemplate,
  Share2,
  X,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { QRDesignConfig, QRContentType, ThemeCategory, PosterTemplatePreset } from "@/types/qr";
import { formatQRData } from "@/lib/qrDataFormatters";
import { evaluateScannability } from "@/lib/colorUtils";
import { QR_PRESETS, SAMPLE_LOGOS } from "@/lib/qrPresets";
import { POSTER_TEMPLATES } from "@/lib/posterTemplates";
import type QRCodeStylingType from "qr-code-styling";
import type {
  DotType,
  CornerSquareType,
  CornerDotType,
  ErrorCorrectionLevel,
} from "qr-code-styling";

const INITIAL_CONFIG: QRDesignConfig = {
  contentType: "url",
  url: "https://crownixbet.com/",
  text: "Hello from QR Vibe (qrvibe.online)!",
  wifi: {
    ssid: "Office_5G",
    password: "SecurePassword123",
    encryption: "WPA",
    hidden: false,
  },
  whatsapp: {
    countryCode: "+92",
    phone: "3001234567",
    message: "Hello! I am interested in your products.",
    linkStyle: "api",
  },
  vcard: {
    firstName: "Alex",
    lastName: "Morgan",
    phone: "+1 555-0199",
    email: "alex@brand.com",
    company: "QR Vibe Media",
    title: "Creative Director",
    website: "https://qrvibe.online",
    address: "New York, USA",
  },
  email: {
    email: "contact@brand.com",
    subject: "Business Inquiry",
    body: "Hi team,\n\nI would like to discuss a project with you.",
    format: "mailto",
  },
  shape: "square",
  dotType: "rounded",
  cornerSquareType: "extra-rounded",
  cornerDotType: "dot",
  colorType: "gradient",
  dotsColor: "#f59e0b",
  gradientColor1: "#f59e0b",
  gradientColor2: "#ef4444",
  gradientType: "linear",
  gradientRotation: 45,
  customEyeColor: true,
  cornerSquareColor: "#fbbf24",
  cornerDotColor: "#ef4444",
  bgColor: "#090a16",
  isTransparentBg: false,
  logoUrl: SAMPLE_LOGOS[0].url,
  logoSize: 0.25,
  logoMargin: 6,
  hideBehindLogo: false,
  errorCorrectionLevel: "H",
  frame: {
    enabled: false,
    templateId: "viewfinder-minimal",
    text: "SCAN HERE",
    subtext: "Point your smartphone camera to open link",
    brandName: "OFFICIAL VERIFIED QR",
    footerNote: "No app required • Works with all smartphone cameras",
    showViewfinder: true,
    showStepsBadge: true,
    position: "bottom",
    theme: "match",
    bgColor: "#4f46e5",
    textColor: "#ffffff",
    accentColor: "#4f46e5",
    cardBgColor: "#ffffff",
    cardTextColor: "#0f172a",
    style: "poster",
    layout: "poster",
  },
};

type StudioTab = "content" | "logo" | "style" | "frame" | "presets";
type ExportFormat = "png" | "jpeg" | "svg";

const PREVIEW_SIZE = 300;
const STEPS_TEXT = "1. Open Camera   •   2. Point at QR   •   3. Tap Link";

const TABS: { id: StudioTab; label: string; icon: React.ElementType }[] = [
  { id: "content", label: "Content", icon: Globe },
  { id: "logo", label: "Logo", icon: ImageIcon },
  { id: "style", label: "Style", icon: Palette },
  { id: "frame", label: "Poster", icon: LayoutTemplate },
  { id: "presets", label: "Themes", icon: Sparkles },
];

const CONTENT_TYPES: { id: QRContentType; label: string; icon: React.ElementType }[] = [
  { id: "url", label: "Website", icon: Globe },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { id: "wifi", label: "Wi-Fi", icon: Wifi },
  { id: "vcard", label: "Contact", icon: Contact },
  { id: "email", label: "Email", icon: Mail },
  { id: "text", label: "Text", icon: FileText },
];

const THEME_CATEGORIES: { id: "all" | ThemeCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "vibrant", label: "Vibrant" },
  { id: "corporate", label: "Corporate" },
  { id: "social", label: "Social" },
  { id: "pastel", label: "Pastel" },
  { id: "dark", label: "Dark" },
];

const PALETTES = [
  { name: "Violet", c1: "#4f46e5", c2: "#9333ea", type: "gradient" as const, bg: "#ffffff" },
  { name: "Neon", c1: "#06b6d4", c2: "#a855f7", type: "gradient" as const, bg: "#090d16" },
  { name: "Emerald", c1: "#059669", c2: "#10b981", type: "gradient" as const, bg: "#ffffff" },
  { name: "Sunset", c1: "#f43f5e", c2: "#f59e0b", type: "gradient" as const, bg: "#ffffff" },
  { name: "Ocean", c1: "#2563eb", c2: "#06b6d4", type: "gradient" as const, bg: "#ffffff" },
  { name: "Gold", c1: "#f59e0b", c2: "#ef4444", type: "gradient" as const, bg: "#090a16" },
  { name: "Black", c1: "#0f172a", c2: "#0f172a", type: "single" as const, bg: "#ffffff" },
  { name: "Crimson", c1: "#e11d48", c2: "#be185d", type: "gradient" as const, bg: "#ffffff" },
];

const DOT_STYLES: { id: DotType; label: string; icon: React.ReactNode }[] = [
  {
    id: "square",
    label: "Square",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <rect x="4" y="4" width="7" height="7" />
        <rect x="13" y="4" width="7" height="7" />
        <rect x="4" y="13" width="7" height="7" />
        <rect x="13" y="13" width="7" height="7" />
      </svg>
    ),
  },
  {
    id: "rounded",
    label: "Rounded",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <rect x="4" y="4" width="7" height="7" rx="2.5" />
        <rect x="13" y="4" width="7" height="7" rx="2.5" />
        <rect x="4" y="13" width="7" height="7" rx="2.5" />
        <rect x="13" y="13" width="7" height="7" rx="2.5" />
      </svg>
    ),
  },
  {
    id: "dots",
    label: "Dots",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <circle cx="7.5" cy="7.5" r="3.5" />
        <circle cx="16.5" cy="7.5" r="3.5" />
        <circle cx="7.5" cy="16.5" r="3.5" />
        <circle cx="16.5" cy="16.5" r="3.5" />
      </svg>
    ),
  },
  {
    id: "classy",
    label: "Classy",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M4 4h7v4.5A2.5 2.5 0 0 1 8.5 11H4z" />
        <path d="M13 4h4.5A2.5 2.5 0 0 1 20 6.5V11h-7z" />
        <path d="M4 13h4.5a2.5 2.5 0 0 1 2.5 2.5V20H4z" />
        <path d="M13 13h7v7h-4.5a2.5 2.5 0 0 1-2.5-2.5z" />
      </svg>
    ),
  },
  {
    id: "classy-rounded",
    label: "Wave",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M4 7.5A3.5 3.5 0 0 1 7.5 4H11v7H4z" />
        <path d="M13 4h3.5A3.5 3.5 0 0 1 20 7.5V11h-7z" />
        <path d="M4 13h7v7H7.5A3.5 3.5 0 0 1 4 16.5z" />
        <path d="M13 13h7v3.5a3.5 3.5 0 0 1-3.5 3.5H13z" />
      </svg>
    ),
  },
  {
    id: "extra-rounded",
    label: "Smooth",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <rect x="4" y="4" width="7" height="7" rx="3.5" />
        <rect x="13" y="4" width="7" height="7" rx="3.5" />
        <rect x="4" y="13" width="16" height="7" rx="3.5" />
      </svg>
    ),
  },
];

const EYE_FRAMES: { id: CornerSquareType; label: string }[] = [
  { id: "extra-rounded", label: "Curved" },
  { id: "dot", label: "Circle" },
  { id: "square", label: "Square" },
];

const EYE_CENTERS: { id: CornerDotType; label: string }[] = [
  { id: "dot", label: "Dot" },
  { id: "square", label: "Square" },
];

const WHATSAPP_TEMPLATES = [
  { label: "Business inquiry", msg: "Hello! I am interested in your services and would like more details." },
  { label: "Order", msg: "Hi! I would like to inquire about product pricing and availability." },
  { label: "Price quote", msg: "Hello! Could you please share a price quotation for your services?" },
  { label: "Booking", msg: "Hi, I would like to schedule an appointment/meeting with your team." },
  { label: "Support", msg: "Hello Support, I need some assistance with my order/account." },
];

const EMAIL_TEMPLATES = [
  { label: "Business inquiry", sub: "Business & Project Inquiry", body: "Hi team,\n\nI would like to inquire about your services." },
  { label: "Support", sub: "Support Request - [Order / Account #]", body: "Hello Support,\n\nI need assistance with the following issue:\n" },
  { label: "Quote", sub: "Price Quote Request", body: "Hello,\n\nPlease provide a quote for the following requirements:\n" },
  { label: "Feedback", sub: "Customer Feedback & Review", body: "Hi there,\n\nI would love to share some feedback regarding:\n" },
];

const COUNTRY_CODES = ["+92", "+971", "+966", "+44", "+1", "+91"];

/* ------------------------------------------------------------------ */
/* Small shared UI pieces so every panel looks and behaves the same    */
/* ------------------------------------------------------------------ */

const inputCls =
  "w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-base sm:text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors";

function Section({
  title,
  hint,
  action,
  children,
}: {
  title: string;
  hint?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3 max-lg:p-4 max-lg:rounded-2xl max-lg:bg-slate-900/70 max-lg:border max-lg:border-slate-800/80">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-white">{title}</h3>
          {hint && <p className="text-xs text-slate-400 mt-0.5">{hint}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-slate-300 mb-1.5">{label}</span>
      {children}
    </label>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
        active
          ? "bg-indigo-600 border-indigo-500 text-white"
          : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function Segmented<T extends string | number>({
  options,
  value,
  onChange,
  size = "md",
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  size?: "sm" | "md";
}) {
  return (
    <div className="flex p-1 rounded-xl bg-slate-950 border border-slate-800">
      {options.map((o) => (
        <button
          key={String(o.value)}
          type="button"
          onClick={() => onChange(o.value)}
          className={`flex-1 rounded-lg font-semibold transition-colors ${
            size === "sm" ? "py-1.5 text-[11px]" : "py-2 text-xs"
          } ${value === o.value ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-white"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="w-full flex items-center justify-between gap-4 py-1 text-left"
    >
      <span>
        <span className="block text-sm font-semibold text-white">{label}</span>
        {hint && <span className="block text-xs text-slate-400 mt-0.5">{hint}</span>}
      </span>
      <span
        className={`relative shrink-0 w-11 h-6 rounded-full transition-colors ${
          checked ? "bg-indigo-600" : "bg-slate-700"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </span>
    </button>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <span className="block text-xs font-semibold text-slate-300 mb-1.5">{label}</span>
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-950 border border-slate-800 focus-within:border-indigo-500">
        <span className="relative w-8 h-8 rounded-lg overflow-hidden border border-slate-700 shrink-0">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute -inset-2 w-12 h-12 cursor-pointer"
            aria-label={label}
          />
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-w-0 bg-transparent text-base sm:text-sm font-mono text-white outline-none uppercase"
          spellCheck={false}
        />
      </div>
    </div>
  );
}

function OptionTile({
  active,
  onClick,
  children,
  className = "",
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-xl border transition-all active:scale-[0.97] ${
        active
          ? "bg-indigo-600/15 border-indigo-500 text-white ring-1 ring-indigo-500/40"
          : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-white"
      } ${className}`}
    >
      {children}
    </button>
  );
}

/* Shrinks the font until the text fits the given width (used for poster export). */
function fitText(
  ctx: CanvasRenderingContext2D,
  text: string,
  weight: string,
  startSize: number,
  maxWidth: number
) {
  let size = startSize;
  ctx.font = `${weight} ${size}px sans-serif`;
  while (size > 8 && ctx.measureText(text).width > maxWidth) {
    size -= 1;
    ctx.font = `${weight} ${size}px sans-serif`;
  }
  return size;
}

export interface QRStudioProps {
  initialContentType?: QRContentType;
  initialTab?: StudioTab;
  initialLogoUrl?: string | null;
}

export function QRStudio({
  initialContentType = "url",
  initialTab = "content",
  initialLogoUrl = null,
}: QRStudioProps = {}) {
  const [config, setConfig] = useState<QRDesignConfig>(() => ({
    ...INITIAL_CONFIG,
    contentType: initialContentType,
    logoUrl: initialLogoUrl,
  }));
  const [activeTab, setActiveTab] = useState<StudioTab>(initialTab);
  const [exportRes, setExportRes] = useState<number>(1024);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("png");
  const [busy, setBusy] = useState<null | "download" | "share" | "copy">(null);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [themeCategory, setThemeCategory] = useState<"all" | ThemeCategory>("all");
  const [wifiShowPass, setWifiShowPass] = useState(false);
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const [studioInView, setStudioInView] = useState(true);
  const [previewInView, setPreviewInView] = useState(true);
  const [thumb, setThumb] = useState<string | null>(null);
  // `design` changes identity on every edit; a result for an older design means "still checking"
  const design = useMemo(() => ({ config }), [config]);
  const [scanResult, setScanResult] = useState<{
    design: object | null;
    ok: boolean;
    reason?: string;
  }>({ design: null, ok: true });
  const decoder = { checking: scanResult.design !== design, ok: scanResult.ok, reason: scanResult.reason };

  const studioRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const qrContainerRef = useRef<HTMLDivElement>(null);
  const qrCodeInstanceRef = useRef<QRCodeStylingType | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const update = useCallback(
    <K extends keyof QRDesignConfig>(key: K, value: QRDesignConfig[K]) =>
      setConfig((prev) => ({ ...prev, [key]: value })),
    []
  );
  const updateFrame = useCallback(
    (patch: Partial<QRDesignConfig["frame"]>) =>
      setConfig((prev) => ({ ...prev, frame: { ...prev.frame, ...patch } })),
    []
  );

  const qrData = useMemo(() => formatQRData(config), [config]);
  const testableLink = /^(https?:|mailto:)/i.test(qrData) ? qrData : null;

  const scannability = useMemo(() => {
    const fg = config.colorType === "gradient" ? config.gradientColor1 : config.dotsColor;
    const bg = config.isTransparentBg ? "#ffffff" : config.bgColor;
    return evaluateScannability(fg, bg, Boolean(config.logoUrl), config.logoSize, config.errorCorrectionLevel);
  }, [config]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };

  // Track whether the studio / preview are on screen (drives the mobile action bar)
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const studioObs = new IntersectionObserver(([e]) => setStudioInView(e.isIntersecting), {
      rootMargin: "0px 0px -120px 0px",
    });
    const previewObs = new IntersectionObserver(([e]) => setPreviewInView(e.isIntersecting), {
      threshold: 0.35,
    });
    if (studioRef.current) studioObs.observe(studioRef.current);
    if (previewRef.current) previewObs.observe(previewRef.current);
    return () => {
      studioObs.disconnect();
      previewObs.disconnect();
    };
  }, []);

  const getQROptions = (size: number, type: "canvas" | "svg" = "canvas") => {
    const isGradient = config.colorType === "gradient";
    return {
      width: size,
      height: size,
      type,
      data: qrData,
      image: config.logoUrl || undefined,
      shape: config.shape,
      margin: Math.round(size * 0.05),
      qrOptions: {
        typeNumber: 0 as const,
        mode: "Byte" as const,
        errorCorrectionLevel: (config.logoUrl ? "H" : config.errorCorrectionLevel) as ErrorCorrectionLevel,
      },
      imageOptions: {
        hideBackgroundDots: config.hideBehindLogo,
        imageSize: config.logoSize,
        margin: config.logoMargin,
        crossOrigin: "anonymous",
      },
      dotsOptions: {
        type: config.dotType,
        color: !isGradient ? config.dotsColor : undefined,
        gradient: isGradient
          ? {
              type: config.gradientType,
              rotation: (config.gradientRotation * Math.PI) / 180,
              colorStops: [
                { offset: 0, color: config.gradientColor1 },
                { offset: 1, color: config.gradientColor2 },
              ],
            }
          : undefined,
      },
      cornersSquareOptions: {
        type: config.cornerSquareType,
        color: config.customEyeColor
          ? config.cornerSquareColor
          : !isGradient
          ? config.dotsColor
          : config.gradientColor1,
      },
      cornersDotOptions: {
        type: config.cornerDotType,
        color: config.customEyeColor
          ? config.cornerDotColor
          : !isGradient
          ? config.dotsColor
          : config.gradientColor2,
      },
      backgroundOptions: {
        color: config.isTransparentBg ? "transparent" : config.bgColor,
      },
    };
  };

  // Live preview render
  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (!qrContainerRef.current) return;
      const { default: QRCodeStyling } = await import("qr-code-styling");
      if (!isMounted || !qrContainerRef.current) return;
      const options = getQROptions(PREVIEW_SIZE);
      if (!qrCodeInstanceRef.current) {
        qrCodeInstanceRef.current = new QRCodeStyling(options);
      } else {
        qrCodeInstanceRef.current.update(options);
      }
      qrContainerRef.current.innerHTML = "";
      qrCodeInstanceRef.current.append(qrContainerRef.current);
    })();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, qrData]);

  // Real scan check: decode the rendered preview with jsQR
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const canvas = qrContainerRef.current?.querySelector("canvas");
        if (!canvas) return;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;
        const { default: jsQR } = await import("jsqr");
        if (cancelled) return;
        setThumb(canvas.toDataURL("image/png"));
        const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(img.data, img.width, img.height, { inversionAttempts: "attemptBoth" });
        if (cancelled) return;
        if (code?.data && code.data === qrData) {
          setScanResult({ design, ok: true });
        } else {
          let reason = "Phone cameras may struggle to read this design.";
          if (config.logoUrl && config.logoSize > 0.3) {
            reason = `Logo is too big (${Math.round(config.logoSize * 100)}%). Keep it under 30%.`;
          } else if (scannability.score < 55) {
            reason = `Contrast is too low (${scannability.contrastRatio}:1). Use darker dots or a lighter background.`;
          }
          setScanResult({ design, ok: false, reason });
        }
      } catch (err) {
        console.error("Decoder error:", err);
      }
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [design, config, qrData, scannability]);

  /* ---------------- Logo ---------------- */
  const readLogoFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      showToast("Please choose an image file (PNG, JPG, SVG or WebP).");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      showToast("Logo must be under 4 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setConfig((prev) => ({
        ...prev,
        logoUrl: event.target?.result as string,
        errorCorrectionLevel: "H",
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    update("logoUrl", null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ---------------- Presets ---------------- */
  const applyPreset = (preset: (typeof QR_PRESETS)[0]) => {
    setConfig((prev) => ({
      ...prev,
      dotType: preset.dotType,
      cornerSquareType: preset.cornerSquareType,
      cornerDotType: preset.cornerDotType,
      colorType: preset.colorType,
      dotsColor: preset.dotsColor,
      gradientColor1: preset.gradientColor1,
      gradientColor2: preset.gradientColor2,
      gradientType: preset.gradientType,
      bgColor: preset.bgColor,
      isTransparentBg: false,
      customEyeColor: preset.customEyeColor ?? false,
      cornerSquareColor: preset.cornerSquareColor ?? preset.dotsColor,
      cornerDotColor: preset.cornerDotColor ?? preset.dotsColor,
    }));
  };

  const isPresetActive = (p: (typeof QR_PRESETS)[0]) =>
    config.dotType === p.dotType &&
    config.colorType === p.colorType &&
    config.bgColor === p.bgColor &&
    (p.colorType === "single"
      ? config.dotsColor === p.dotsColor
      : config.gradientColor1 === p.gradientColor1 && config.gradientColor2 === p.gradientColor2);

  const applyPosterTemplate = (tpl: PosterTemplatePreset) => {
    setConfig((prev) => ({
      ...prev,
      frame: {
        ...prev.frame,
        enabled: true,
        templateId: tpl.id,
        text: tpl.title,
        subtext: tpl.subtitle,
        brandName: tpl.brandName,
        footerNote: tpl.footerNote,
        showViewfinder: tpl.showViewfinder,
        showStepsBadge: tpl.showStepsBadge,
        cardBgColor: tpl.cardBgColor,
        cardTextColor: tpl.cardTextColor,
        accentColor: tpl.accentColor,
        style: "poster",
      },
      dotsColor: tpl.dotsColor,
      colorType: tpl.gradientColor1 ? "gradient" : "single",
      gradientColor1: tpl.gradientColor1 || tpl.dotsColor,
      gradientColor2: tpl.gradientColor2 || tpl.dotsColor,
      bgColor: tpl.bgColor,
      isTransparentBg: false,
      customEyeColor: true,
      cornerSquareColor: tpl.cornerSquareColor,
      cornerDotColor: tpl.cornerDotColor,
      dotType: tpl.dotType,
      cornerSquareType: tpl.cornerSquareType,
      cornerDotType: tpl.cornerDotType,
    }));
  };

  const autoFixScannability = () => {
    setConfig((prev) => ({
      ...prev,
      logoSize: Math.min(prev.logoSize, 0.24),
      errorCorrectionLevel: "H",
      bgColor: "#ffffff",
      isTransparentBg: false,
      colorType: "single",
      dotsColor: "#0f172a",
      customEyeColor: false,
    }));
  };

  /* ---------------- Export ---------------- */
  // Produces the final image (plain QR or full poster) as a Blob.
  const renderBlob = async (format: ExportFormat, size: number): Promise<Blob | null> => {
    const { default: QRCodeStyling } = await import("qr-code-styling");

    if (format === "svg" || !config.frame.enabled) {
      const exporter = new QRCodeStyling(getQROptions(size, format === "svg" ? "svg" : "canvas"));
      return (await exporter.getRawData(format)) as Blob | null;
    }

    const exporter = new QRCodeStyling(getQROptions(size));
    const rawBlob = (await exporter.getRawData("png")) as Blob | null;
    if (!rawBlob) return null;

    const img = new Image();
    const imgUrl = URL.createObjectURL(rawBlob);
    await new Promise((res, rej) => {
      img.onload = res;
      img.onerror = rej;
      img.src = imgUrl;
    });

    const f = config.frame;
    const W = size;
    const H = Math.round(size * 1.42);
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const isDarkText = f.cardTextColor !== "#ffffff";
    const radius = Math.round(W * 0.04);
    const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x, y, w, h, r);
      else ctx.rect(x, y, w, h);
    };

    // JPEG has no transparency, so fill the corners
    if (format === "jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, W, H);
    }

    // Card
    ctx.fillStyle = f.cardBgColor || "#ffffff";
    roundRect(0, 0, W, H, radius);
    ctx.fill();
    ctx.strokeStyle = isDarkText ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.12)";
    ctx.lineWidth = Math.round(W * 0.005);
    roundRect(0, 0, W, H, radius);
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const maxText = W * 0.86;

    const topY = Math.round(H * 0.11);
    if (f.brandName) {
      ctx.fillStyle = f.accentColor || "#4f46e5";
      fitText(ctx, f.brandName.toUpperCase(), "bold", Math.round(W * 0.028), maxText);
      ctx.fillText(f.brandName.toUpperCase(), W / 2, topY);
    }

    const titleY = topY + Math.round(H * 0.07);
    const title = (f.text || "SCAN HERE").toUpperCase();
    ctx.fillStyle = f.cardTextColor || "#0f172a";
    fitText(ctx, title, "900", Math.round(W * 0.068), maxText);
    ctx.fillText(title, W / 2, titleY);

    let subY = titleY;
    if (f.subtext) {
      subY = titleY + Math.round(H * 0.045);
      ctx.fillStyle = isDarkText ? "rgba(15,23,42,0.65)" : "rgba(255,255,255,0.75)";
      fitText(ctx, f.subtext, "500", Math.round(W * 0.03), maxText);
      ctx.fillText(f.subtext, W / 2, subY);
    }

    const qrSize = Math.round(W * 0.58);
    const qrX = (W - qrSize) / 2;
    const qrY = subY + Math.round(H * 0.08);
    const pad = Math.round(qrSize * 0.05);

    ctx.fillStyle = "#ffffff";
    roundRect(qrX - pad, qrY - pad, qrSize + pad * 2, qrSize + pad * 2, Math.round(qrSize * 0.06));
    ctx.fill();

    if (f.showViewfinder) {
      const vfPad = Math.round(qrSize * 0.08);
      const x0 = qrX - vfPad;
      const y0 = qrY - vfPad;
      const x1 = qrX + qrSize + vfPad;
      const y1 = qrY + qrSize + vfPad;
      const arm = Math.round(qrSize * 0.16);
      ctx.strokeStyle = f.accentColor || "#4f46e5";
      ctx.lineWidth = Math.round(W * 0.012);
      ctx.lineCap = "round";
      const corner = (pts: [number, number][]) => {
        ctx.beginPath();
        ctx.moveTo(...pts[0]);
        ctx.lineTo(...pts[1]);
        ctx.lineTo(...pts[2]);
        ctx.stroke();
      };
      corner([[x0, y0 + arm], [x0, y0], [x0 + arm, y0]]);
      corner([[x1 - arm, y0], [x1, y0], [x1, y0 + arm]]);
      corner([[x0, y1 - arm], [x0, y1], [x0 + arm, y1]]);
      corner([[x1 - arm, y1], [x1, y1], [x1, y1 - arm]]);
    }

    ctx.drawImage(img, qrX, qrY, qrSize, qrSize);
    URL.revokeObjectURL(imgUrl);

    let footY = qrY + qrSize + pad + Math.round(H * 0.06);
    if (f.showStepsBadge) {
      const bw = Math.round(W * 0.82);
      const bh = Math.round(H * 0.048);
      ctx.fillStyle = f.accentColor || "#4f46e5";
      roundRect((W - bw) / 2, footY, bw, bh, Math.round(bh / 2));
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      fitText(ctx, STEPS_TEXT, "bold", Math.round(W * 0.026), bw * 0.92);
      ctx.fillText(STEPS_TEXT, W / 2, footY + bh / 2);
      footY += bh + Math.round(H * 0.04);
    }

    if (f.footerNote) {
      ctx.fillStyle = isDarkText ? "rgba(15,23,42,0.6)" : "rgba(255,255,255,0.7)";
      fitText(ctx, f.footerNote, "500", Math.round(W * 0.026), maxText);
      ctx.fillText(f.footerNote, W / 2, footY);
    }

    return await new Promise<Blob | null>((res) =>
      canvas.toBlob((b) => res(b), format === "jpeg" ? "image/jpeg" : "image/png", 0.95)
    );
  };

  const fileName = (format: ExportFormat) =>
    `qrvibe-${config.frame.enabled && format !== "svg" ? "poster-" : ""}${config.contentType}-${exportRes}px.${
      format === "jpeg" ? "jpg" : format
    }`;

  const downloadQR = async () => {
    setBusy("download");
    try {
      const blob = await renderBlob(exportFormat, exportRes);
      if (!blob) throw new Error("Empty export");
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = fileName(exportFormat);
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      void import("canvas-confetti").then(({ default: confetti }) => confetti({ particleCount: 80, spread: 60, origin: { y: 0.85 } }));
    } catch (err) {
      console.error("Export error:", err);
      showToast("Download failed. Please try again.");
    } finally {
      setBusy(null);
    }
  };

  const copyToClipboard = async () => {
    if (!navigator.clipboard || typeof window.ClipboardItem === "undefined") {
      showToast("Your browser can't copy images. Use Download instead.");
      return;
    }
    setBusy("copy");
    try {
      const blob = await renderBlob("png", 1024);
      if (!blob) throw new Error("Empty export");
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error("Copy failed:", err);
      showToast("Copy failed. Use Download instead.");
    } finally {
      setBusy(null);
    }
  };

  const canShareFiles = () => typeof navigator !== "undefined" && typeof navigator.share === "function";

  const shareQR = async () => {
    if (!canShareFiles()) {
      await downloadQR();
      return;
    }
    setBusy("share");
    try {
      const blob = await renderBlob("png", 1024);
      if (!blob) throw new Error("Empty export");
      const file = new File([blob], fileName("png"), { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "My QR Code" });
      } else {
        await navigator.share({ title: "My QR Code", url: window.location.href });
      }
    } catch (err) {
      // User closed the share sheet
      if ((err as Error)?.name !== "AbortError") console.error("Share failed:", err);
    } finally {
      setBusy(null);
    }
  };

  const scrollToPreview = () => {
    previewRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const selectTab = (id: StudioTab) => {
    setActiveTab(id);
    // If the panel's top is hidden under the sticky tab bar, bring it back into view
    requestAnimationFrame(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const isMobile = window.innerWidth < 1024;
      const bar = document.getElementById("studio-tabs");
      // Mobile: tabs live in the bottom nav, so align under the site header
      const limit = isMobile ? 64 : (bar?.getBoundingClientRect().bottom ?? 0) + 8;
      const gap = panel.getBoundingClientRect().top - limit;
      if (gap < 0) window.scrollBy({ top: gap, behavior: "smooth" });
    });
  };

  /* ================================================================ */
  /* Panels                                                           */
  /* ================================================================ */

  const contentPanel = (
    <div className="space-y-6">
      <Section title="What should the QR open?">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {CONTENT_TYPES.map((t) => {
            const Icon = t.icon;
            return (
              <OptionTile
                key={t.id}
                active={config.contentType === t.id}
                onClick={() => update("contentType", t.id)}
                className="flex flex-col items-center justify-center gap-1.5 py-3"
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-semibold">{t.label}</span>
              </OptionTile>
            );
          })}
        </div>
      </Section>

      <div className="h-px bg-slate-800" />

      {config.contentType === "url" && (
        <Section title="Website link" hint="Paste any link: website, Instagram, YouTube, Google Maps…">
          <div className="relative">
            <input
              type="url"
              inputMode="url"
              autoCapitalize="off"
              autoCorrect="off"
              value={config.url}
              onChange={(e) => update("url", e.target.value)}
              placeholder="https://example.com"
              className={`${inputCls} pr-10`}
            />
            {config.url && (
              <button
                type="button"
                onClick={() => update("url", "")}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                aria-label="Clear link"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
            {["https://", "https://instagram.com/", "https://wa.me/", "https://youtube.com/"].map((p) => (
              <Chip key={p} onClick={() => update("url", p)}>
                {p.replace("https://", "") || "https://"}
              </Chip>
            ))}
          </div>
        </Section>
      )}

      {config.contentType === "whatsapp" && (
        <Section title="WhatsApp chat" hint="People scan and a chat opens with your number and message.">
          <div className="grid grid-cols-[96px_1fr] gap-2">
            <Field label="Code">
              <input
                type="tel"
                value={config.whatsapp.countryCode}
                onChange={(e) => update("whatsapp", { ...config.whatsapp, countryCode: e.target.value })}
                placeholder="+92"
                className={`${inputCls} text-center`}
              />
            </Field>
            <Field label="Phone number">
              <input
                type="tel"
                inputMode="tel"
                value={config.whatsapp.phone}
                onChange={(e) => update("whatsapp", { ...config.whatsapp, phone: e.target.value })}
                placeholder="3001234567"
                className={inputCls}
              />
            </Field>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
            {COUNTRY_CODES.map((c) => (
              <Chip
                key={c}
                active={config.whatsapp.countryCode === c}
                onClick={() => update("whatsapp", { ...config.whatsapp, countryCode: c })}
              >
                {c}
              </Chip>
            ))}
          </div>
          <Field label="Message (optional)">
            <textarea
              rows={2}
              value={config.whatsapp.message}
              onChange={(e) => update("whatsapp", { ...config.whatsapp, message: e.target.value })}
              placeholder="Hello, I want to ask about…"
              className={inputCls}
            />
          </Field>
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
            {WHATSAPP_TEMPLATES.map((t) => (
              <Chip
                key={t.label}
                active={config.whatsapp.message === t.msg}
                onClick={() => update("whatsapp", { ...config.whatsapp, message: t.msg })}
              >
                {t.label}
              </Chip>
            ))}
          </div>
          <Field label="Link type">
            <Segmented
              value={config.whatsapp.linkStyle || "api"}
              onChange={(v) => update("whatsapp", { ...config.whatsapp, linkStyle: v })}
              options={[
                { value: "api", label: "Standard" },
                { value: "wame", label: "wa.me" },
                { value: "intent", label: "App link" },
              ]}
            />
          </Field>
        </Section>
      )}

      {config.contentType === "wifi" && (
        <Section title="Wi-Fi network" hint="Guests scan and join without typing the password.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Network name (SSID)">
              <input
                type="text"
                autoCapitalize="off"
                value={config.wifi.ssid}
                onChange={(e) => update("wifi", { ...config.wifi, ssid: e.target.value })}
                placeholder="Office_WiFi"
                className={inputCls}
              />
            </Field>
            <Field label="Security">
              <select
                value={config.wifi.encryption}
                onChange={(e) =>
                  update("wifi", { ...config.wifi, encryption: e.target.value as QRDesignConfig["wifi"]["encryption"] })
                }
                className={inputCls}
              >
                <option value="WPA">WPA / WPA2 / WPA3</option>
                <option value="WEP">WEP (old)</option>
                <option value="nopass">No password</option>
              </select>
            </Field>
          </div>
          {config.wifi.encryption !== "nopass" && (
            <Field label="Password">
              <div className="relative">
                <input
                  type={wifiShowPass ? "text" : "password"}
                  autoCapitalize="off"
                  value={config.wifi.password}
                  onChange={(e) => update("wifi", { ...config.wifi, password: e.target.value })}
                  placeholder="Network password"
                  className={`${inputCls} pr-11`}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setWifiShowPass((s) => !s);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-white"
                  aria-label={wifiShowPass ? "Hide password" : "Show password"}
                >
                  {wifiShowPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </Field>
          )}
          <Toggle
            checked={config.wifi.hidden}
            onChange={(v) => update("wifi", { ...config.wifi, hidden: v })}
            label="Hidden network"
            hint="Turn on only if your Wi-Fi name is hidden."
          />
        </Section>
      )}

      {config.contentType === "vcard" && (
        <Section title="Contact card" hint="People scan and save your contact in one tap.">
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                ["firstName", "First name", "text"],
                ["lastName", "Last name", "text"],
                ["phone", "Phone", "tel"],
                ["email", "Email", "email"],
                ["company", "Company", "text"],
                ["title", "Job title", "text"],
              ] as const
            ).map(([key, label, type]) => (
              <Field key={key} label={label}>
                <input
                  type={type}
                  value={config.vcard[key]}
                  onChange={(e) => update("vcard", { ...config.vcard, [key]: e.target.value })}
                  className={inputCls}
                />
              </Field>
            ))}
          </div>
          <Field label="Website">
            <input
              type="url"
              inputMode="url"
              autoCapitalize="off"
              value={config.vcard.website}
              onChange={(e) => update("vcard", { ...config.vcard, website: e.target.value })}
              className={inputCls}
            />
          </Field>
          <Field label="Address">
            <input
              type="text"
              value={config.vcard.address}
              onChange={(e) => update("vcard", { ...config.vcard, address: e.target.value })}
              className={inputCls}
            />
          </Field>
        </Section>
      )}

      {config.contentType === "email" && (
        <Section title="Email" hint="Opens a ready-to-send email in the scanner's mail app.">
          <Field label="Send to">
            <input
              type="email"
              inputMode="email"
              autoCapitalize="off"
              value={config.email.email}
              onChange={(e) => update("email", { ...config.email, email: e.target.value })}
              placeholder="hello@example.com"
              className={inputCls}
            />
          </Field>
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
            {EMAIL_TEMPLATES.map((t) => (
              <Chip
                key={t.label}
                active={config.email.subject === t.sub}
                onClick={() => update("email", { ...config.email, subject: t.sub, body: t.body })}
              >
                {t.label}
              </Chip>
            ))}
          </div>
          <Field label="Subject">
            <input
              type="text"
              value={config.email.subject}
              onChange={(e) => update("email", { ...config.email, subject: e.target.value })}
              className={inputCls}
            />
          </Field>
          <Field label="Message">
            <textarea
              rows={3}
              value={config.email.body}
              onChange={(e) => update("email", { ...config.email, body: e.target.value })}
              className={inputCls}
            />
          </Field>
          <Field label="Format">
            <Segmented
              value={config.email.format === "matmsg" ? "matmsg" : "mailto"}
              onChange={(v) => update("email", { ...config.email, format: v })}
              options={[
                { value: "mailto", label: "Standard (mailto)" },
                { value: "matmsg", label: "Android (MATMSG)" },
              ]}
            />
          </Field>
        </Section>
      )}

      {config.contentType === "text" && (
        <Section title="Plain text" hint="Shows this text when scanned.">
          <textarea
            rows={4}
            value={config.text}
            onChange={(e) => update("text", e.target.value)}
            placeholder="Write your message…"
            className={inputCls}
          />
          <p className="text-xs text-slate-500 text-right">{config.text.length} characters</p>
        </Section>
      )}
    </div>
  );

  const logoPanel = (
    <div className="space-y-6">
      <Section
        title="Logo in the middle"
        hint="PNG, JPG, SVG or WebP. Stays on your device, never uploaded."
        action={
          config.logoUrl ? (
            <button
              type="button"
              onClick={removeLogo}
              className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-300 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Remove
            </button>
          ) : undefined
        }
      >
        <div
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDraggingLogo(true);
          }}
          onDragLeave={() => setIsDraggingLogo(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDraggingLogo(false);
            const file = e.dataTransfer.files?.[0];
            if (file) readLogoFile(file);
          }}
          className={`flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed cursor-pointer transition-colors ${
            isDraggingLogo
              ? "border-indigo-400 bg-indigo-500/10"
              : "border-slate-700 hover:border-indigo-500 bg-slate-950/50"
          }`}
        >
          <div className="w-16 h-16 rounded-xl bg-white/95 border border-slate-700 flex items-center justify-center shrink-0 overflow-hidden p-1.5">
            {config.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={config.logoUrl} alt="Your logo" className="max-w-full max-h-full object-contain" />
            ) : (
              <Upload className="w-6 h-6 text-slate-500" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white">
              {config.logoUrl ? "Tap to change logo" : isDraggingLogo ? "Drop it here" : "Tap to upload your logo"}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">Square logos with a transparent background look best.</p>
          </div>
        </div>
      </Section>

      <Section title="Or use a sample icon">
        <div className="flex flex-wrap gap-2">
          {SAMPLE_LOGOS.map((s) => (
            <button
              key={s.name}
              type="button"
              onClick={() => setConfig((prev) => ({ ...prev, logoUrl: s.url, errorCorrectionLevel: "H" }))}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                config.logoUrl === s.url
                  ? "bg-indigo-600 border-indigo-500 text-white"
                  : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600"
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
              {s.name}
            </button>
          ))}
        </div>
      </Section>

      {config.logoUrl && (
        <Section title="Logo settings">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-300">Size</span>
              <span
                className={`font-bold ${
                  config.logoSize <= 0.28 ? "text-emerald-400" : config.logoSize <= 0.32 ? "text-amber-400" : "text-rose-400"
                }`}
              >
                {Math.round(config.logoSize * 100)}% ·{" "}
                {config.logoSize <= 0.28 ? "Safe" : config.logoSize <= 0.32 ? "Careful" : "Too big"}
              </span>
            </div>
            <input
              type="range"
              min={0.16}
              max={0.38}
              step={0.01}
              value={config.logoSize}
              onChange={(e) => update("logoSize", parseFloat(e.target.value))}
              className="w-full accent-indigo-500 h-2 cursor-pointer"
            />
          </div>
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-300">Space around logo</span>
              <span className="font-bold text-white">{config.logoMargin}px</span>
            </div>
            <input
              type="range"
              min={0}
              max={14}
              step={1}
              value={config.logoMargin}
              onChange={(e) => update("logoMargin", parseInt(e.target.value, 10))}
              className="w-full accent-indigo-500 h-2 cursor-pointer"
            />
          </div>
          <Toggle
            checked={config.hideBehindLogo}
            onChange={(v) => update("hideBehindLogo", v)}
            label="Clear dots behind logo"
            hint="Makes the logo cleaner and easier to see."
          />
        </Section>
      )}
    </div>
  );

  const stylePanel = (
    <div className="space-y-6">
      <Section title="Quick colors">
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {PALETTES.map((p) => {
            const active =
              config.colorType === p.type &&
              config.bgColor === p.bg &&
              (p.type === "single"
                ? config.dotsColor === p.c1
                : config.gradientColor1 === p.c1 && config.gradientColor2 === p.c2);
            return (
              <button
                key={p.name}
                type="button"
                onClick={() =>
                  setConfig((prev) => ({
                    ...prev,
                    colorType: p.type,
                    dotsColor: p.c1,
                    gradientColor1: p.c1,
                    gradientColor2: p.c2,
                    bgColor: p.bg,
                    isTransparentBg: false,
                    customEyeColor: true,
                    cornerSquareColor: p.c1,
                    cornerDotColor: p.c2,
                  }))
                }
                className="flex flex-col items-center gap-1.5"
                aria-pressed={active}
              >
                <span
                  className={`w-11 h-11 rounded-full grid place-items-center transition-all ${
                    active ? "ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-900" : "ring-1 ring-slate-700"
                  }`}
                  style={{ background: p.bg }}
                >
                  <span
                    className="w-7 h-7 rounded-full"
                    style={{ background: p.type === "gradient" ? `linear-gradient(135deg, ${p.c1}, ${p.c2})` : p.c1 }}
                  />
                </span>
                <span className={`text-[11px] font-semibold ${active ? "text-white" : "text-slate-400"}`}>{p.name}</span>
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="Dot pattern">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {DOT_STYLES.map((d) => (
            <OptionTile
              key={d.id}
              active={config.dotType === d.id}
              onClick={() => update("dotType", d.id)}
              className="flex flex-col items-center gap-1.5 py-3"
            >
              {d.icon}
              <span className="text-xs font-semibold">{d.label}</span>
            </OptionTile>
          ))}
        </div>
      </Section>

      <Section title="Corner eyes">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Outer frame">
            <Segmented
              value={config.cornerSquareType}
              onChange={(v) => update("cornerSquareType", v)}
              options={EYE_FRAMES.map((e) => ({ value: e.id, label: e.label }))}
            />
          </Field>
          <Field label="Inner dot">
            <Segmented
              value={config.cornerDotType}
              onChange={(v) => update("cornerDotType", v)}
              options={EYE_CENTERS.map((e) => ({ value: e.id, label: e.label }))}
            />
          </Field>
        </div>
      </Section>

      <Section title="Dot color">
        <Segmented
          value={config.colorType}
          onChange={(v) => update("colorType", v)}
          options={[
            { value: "single", label: "Solid" },
            { value: "gradient", label: "Gradient" },
          ]}
        />
        {config.colorType === "single" ? (
          <ColorField label="Color" value={config.dotsColor} onChange={(v) => update("dotsColor", v)} />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <ColorField label="Start" value={config.gradientColor1} onChange={(v) => update("gradientColor1", v)} />
              <ColorField label="End" value={config.gradientColor2} onChange={(v) => update("gradientColor2", v)} />
            </div>
            <Field label="Direction">
              <Segmented
                size="sm"
                value={config.gradientType === "radial" ? -1 : config.gradientRotation}
                onChange={(v) =>
                  setConfig((prev) =>
                    v === -1
                      ? { ...prev, gradientType: "radial" }
                      : { ...prev, gradientType: "linear", gradientRotation: v }
                  )
                }
                options={[
                  { value: 0, label: "→" },
                  { value: 45, label: "↘" },
                  { value: 90, label: "↓" },
                  { value: 135, label: "↙" },
                  { value: -1, label: "◎" },
                ]}
              />
            </Field>
          </>
        )}
      </Section>

      <Section title="Background">
        <Segmented
          value={config.isTransparentBg ? "transparent" : config.bgColor === "#ffffff" ? "white" : config.bgColor === "#090a16" ? "dark" : "custom"}
          onChange={(v) =>
            setConfig((prev) =>
              v === "transparent"
                ? { ...prev, isTransparentBg: true }
                : v === "white"
                ? { ...prev, isTransparentBg: false, bgColor: "#ffffff" }
                : v === "dark"
                ? { ...prev, isTransparentBg: false, bgColor: "#090a16" }
                : { ...prev, isTransparentBg: false }
            )
          }
          options={[
            { value: "white", label: "White" },
            { value: "dark", label: "Dark" },
            { value: "transparent", label: "None" },
            { value: "custom", label: "Custom" },
          ]}
        />
        {!config.isTransparentBg && (
          <ColorField label="Background color" value={config.bgColor} onChange={(v) => update("bgColor", v)} />
        )}
      </Section>

      <Section title="Eye colors">
        <Toggle
          checked={config.customEyeColor}
          onChange={(v) => update("customEyeColor", v)}
          label="Different color for corners"
          hint="Off = corners use the dot color."
        />
        {config.customEyeColor && (
          <div className="grid grid-cols-2 gap-3">
            <ColorField label="Outer" value={config.cornerSquareColor} onChange={(v) => update("cornerSquareColor", v)} />
            <ColorField label="Inner" value={config.cornerDotColor} onChange={(v) => update("cornerDotColor", v)} />
          </div>
        )}
      </Section>
    </div>
  );

  const posterPanel = (
    <div className="space-y-6">
      <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
        <Toggle
          checked={config.frame.enabled}
          onChange={(v) => updateFrame({ enabled: v })}
          label="Printable poster"
          hint="Adds a heading, scan guide and frame around your QR (PNG/JPG)."
        />
      </div>

      <Section title="Poster templates" hint="Tap one to apply its colors and text.">
        <div className="grid grid-cols-2 gap-2">
          {POSTER_TEMPLATES.map((tpl) => {
            const active = config.frame.enabled && config.frame.templateId === tpl.id;
            return (
              <OptionTile
                key={tpl.id}
                active={active}
                onClick={() => applyPosterTemplate(tpl)}
                className="flex items-center gap-3 p-2.5 text-left"
              >
                <span
                  className="w-10 h-14 rounded-lg shrink-0 flex flex-col items-center justify-center gap-1 border border-white/10"
                  style={{ background: tpl.cardBgColor }}
                >
                  <span className="w-6 h-1 rounded-full" style={{ background: tpl.accentColor }} />
                  <span className="w-6 h-6 rounded bg-white grid place-items-center">
                    <span className="w-4 h-4 rounded-sm" style={{ background: tpl.dotsColor }} />
                  </span>
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-bold text-white leading-snug line-clamp-2">{tpl.name}</span>
                  <span className="block text-[11px] text-slate-400 mt-0.5">{tpl.category}</span>
                </span>
              </OptionTile>
            );
          })}
        </div>
      </Section>

      {config.frame.enabled && (
        <>
          <Section title="Poster text">
            <Field label="Heading">
              <input
                type="text"
                value={config.frame.text}
                onChange={(e) => updateFrame({ text: e.target.value })}
                className={`${inputCls} font-bold`}
              />
            </Field>
            <Field label="Subheading">
              <input
                type="text"
                value={config.frame.subtext}
                onChange={(e) => updateFrame({ subtext: e.target.value })}
                className={inputCls}
              />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Top label">
                <input
                  type="text"
                  value={config.frame.brandName}
                  onChange={(e) => updateFrame({ brandName: e.target.value })}
                  className={inputCls}
                />
              </Field>
              <Field label="Footer note">
                <input
                  type="text"
                  value={config.frame.footerNote}
                  onChange={(e) => updateFrame({ footerNote: e.target.value })}
                  className={inputCls}
                />
              </Field>
            </div>
          </Section>

          <Section title="Poster extras">
            <Toggle
              checked={config.frame.showViewfinder}
              onChange={(v) => updateFrame({ showViewfinder: v })}
              label="Camera corner brackets"
            />
            <Toggle
              checked={config.frame.showStepsBadge}
              onChange={(v) => updateFrame({ showStepsBadge: v })}
              label="“How to scan” steps"
            />
          </Section>

          <Section title="Poster colors">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <ColorField label="Card" value={config.frame.cardBgColor} onChange={(v) => updateFrame({ cardBgColor: v })} />
              <ColorField label="Text" value={config.frame.cardTextColor} onChange={(v) => updateFrame({ cardTextColor: v })} />
              <ColorField label="Accent" value={config.frame.accentColor} onChange={(v) => updateFrame({ accentColor: v })} />
            </div>
          </Section>
        </>
      )}
    </div>
  );

  const presetsPanel = (
    <div className="space-y-4">
      <Section
        title="Ready-made themes"
        hint={`${QR_PRESETS.length} tested designs. Tap one to apply.`}
        action={
          <button
            type="button"
            onClick={() => applyPreset(QR_PRESETS.find((p) => p.id === "electric-violet") ?? QR_PRESETS[0])}
            className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 hover:text-white"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset
          </button>
        }
      >
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
          {THEME_CATEGORIES.map((c) => (
            <Chip key={c.id} active={themeCategory === c.id} onClick={() => setThemeCategory(c.id)}>
              {c.label}
            </Chip>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {QR_PRESETS.filter((p) => themeCategory === "all" || p.category === themeCategory).map((p) => {
            const active = isPresetActive(p);
            return (
              <OptionTile key={p.id} active={active} onClick={() => applyPreset(p)} className="flex items-center gap-2.5 p-2.5 text-left">
                <span
                  className="w-10 h-10 rounded-lg shrink-0 grid place-items-center border border-white/10"
                  style={{ background: p.bgColor }}
                >
                  <span
                    className="w-6 h-6 rounded-md"
                    style={{
                      background:
                        p.colorType === "gradient"
                          ? `linear-gradient(135deg, ${p.gradientColor1}, ${p.gradientColor2})`
                          : p.dotsColor,
                    }}
                  />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-bold text-white leading-snug line-clamp-2">{p.name}</span>
                  <span className="block text-[11px] text-slate-400 capitalize">{p.category}</span>
                </span>
                {active && <Check className="w-4 h-4 text-indigo-400 ml-auto shrink-0" />}
              </OptionTile>
            );
          })}
        </div>
      </Section>
    </div>
  );

  const panels: Record<StudioTab, React.ReactNode> = {
    content: contentPanel,
    logo: logoPanel,
    style: stylePanel,
    frame: posterPanel,
    presets: presetsPanel,
  };

  /* ================================================================ */
  /* Preview card                                                     */
  /* ================================================================ */

  const f = config.frame;
  const statusOk = decoder.ok && !decoder.checking;

  const previewCard = (
    <div className="rounded-3xl bg-slate-900/80 max-lg:bg-gradient-to-b max-lg:from-indigo-950/70 max-lg:via-slate-900/90 max-lg:to-slate-900/90 border border-slate-800 p-4 sm:p-6 shadow-2xl shadow-black/30">
      {/* QR / poster */}
      <div
        className={`mx-auto w-full max-w-[250px] sm:max-w-[320px] rounded-2xl flex flex-col items-center ${f.enabled ? "p-5 border" : "p-3 bg-slate-950 border border-slate-800"}`}
        style={
          f.enabled
            ? {
                background: f.cardBgColor,
                color: f.cardTextColor,
                borderColor: f.cardTextColor === "#ffffff" ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)",
              }
            : undefined
        }
      >
        {f.enabled && (
          <div className="w-full text-center mb-3">
            {f.brandName && (
              <p className="text-[10px] font-extrabold uppercase tracking-widest mb-1" style={{ color: f.accentColor }}>
                {f.brandName}
              </p>
            )}
            <h3 className="text-lg font-black uppercase tracking-wide leading-tight">{f.text || "SCAN HERE"}</h3>
            {f.subtext && <p className="text-[11px] opacity-75 font-medium mt-1">{f.subtext}</p>}
          </div>
        )}

        <div className={`relative w-full ${f.enabled ? "max-w-[170px] sm:max-w-[200px] p-2 rounded-xl bg-white" : ""}`}>
          {f.enabled && f.showViewfinder && (
            <>
              {["-top-2 -left-2 border-t-4 border-l-4 rounded-tl-lg", "-top-2 -right-2 border-t-4 border-r-4 rounded-tr-lg", "-bottom-2 -left-2 border-b-4 border-l-4 rounded-bl-lg", "-bottom-2 -right-2 border-b-4 border-r-4 rounded-br-lg"].map((pos) => (
                <span key={pos} className={`absolute w-6 h-6 pointer-events-none ${pos}`} style={{ borderColor: f.accentColor }} />
              ))}
            </>
          )}
          <div
            ref={qrContainerRef}
            className="aspect-square w-full flex items-center justify-center [&_canvas]:!w-full [&_canvas]:!h-auto [&_canvas]:rounded-lg"
          />
        </div>

        {f.enabled && (
          <div className="w-full text-center mt-3 space-y-2">
            {f.showStepsBadge && (
              <div className="py-1.5 px-3 rounded-full text-[10px] font-bold text-white" style={{ background: f.accentColor }}>
                1. Open Camera • 2. Point • 3. Tap
              </div>
            )}
            {f.footerNote && <p className="text-[10px] opacity-70 font-medium">{f.footerNote}</p>}
          </div>
        )}
      </div>

      {/* Scan check */}
      <div
        className={`mt-4 p-3 rounded-xl border text-left ${
          decoder.checking
            ? "bg-slate-950/60 border-slate-800"
            : decoder.ok
            ? "bg-emerald-500/10 border-emerald-500/30"
            : "bg-rose-500/10 border-rose-500/40"
        }`}
        aria-live="polite"
      >
        <div className="flex items-center gap-2">
          {decoder.checking ? (
            <Loader2 className="w-4 h-4 text-slate-400 animate-spin shrink-0" />
          ) : decoder.ok ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span className={`text-sm font-bold ${decoder.checking ? "text-slate-300" : decoder.ok ? "text-emerald-300" : "text-rose-300"}`}>
            {decoder.checking ? "Checking scan…" : decoder.ok ? "Scan tested: works" : "May not scan"}
          </span>
          {testableLink && (
            <a
              href={testableLink}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto shrink-0 flex items-center gap-1 text-xs font-semibold text-indigo-300 hover:text-white"
            >
              Open link
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
        {!decoder.checking && !decoder.ok && (
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-rose-200/90">{decoder.reason}</p>
            <button
              type="button"
              onClick={autoFixScannability}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
            >
              Fix it for me
            </button>
          </div>
        )}
        {statusOk && scannability.recommendations.length > 0 && (
          <p className="mt-1.5 text-xs text-amber-300/90">Print tip: {scannability.recommendations[0]}</p>
        )}
      </div>

      {/* Export options */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Segmented
          size="sm"
          value={exportFormat}
          onChange={setExportFormat}
          options={[
            { value: "png", label: "PNG" },
            { value: "jpeg", label: "JPG" },
            { value: "svg", label: "SVG" },
          ]}
        />
        <Segmented
          size="sm"
          value={exportRes}
          onChange={setExportRes}
          options={[
            { value: 512, label: "S" },
            { value: 1024, label: "HD" },
            { value: 2048, label: "Print" },
          ]}
        />
      </div>
      {f.enabled && exportFormat === "svg" && (
        <p className="mt-2 text-[11px] text-amber-300/90">SVG saves the QR only. Choose PNG or JPG to get the full poster.</p>
      )}

      {/* Actions */}
      <div className="mt-4 flex lg:block gap-2 lg:space-y-2">
        <button
          type="button"
          onClick={shareQR}
          disabled={busy !== null}
          className="lg:hidden w-12 h-12 shrink-0 rounded-xl bg-slate-800 border border-slate-700 text-white grid place-items-center disabled:opacity-60"
          aria-label="Share QR code"
        >
          {busy === "share" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
        </button>
        <button
          type="button"
          onClick={downloadQR}
          disabled={busy !== null}
          className="flex-1 w-full h-12 lg:h-auto lg:py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:brightness-110 text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition disabled:opacity-60"
        >
          {busy === "download" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          Download {exportFormat === "jpeg" ? "JPG" : exportFormat.toUpperCase()}
        </button>
        <div className="hidden lg:grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={copyToClipboard}
            disabled={busy !== null}
            className="py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 flex items-center justify-center gap-1.5 disabled:opacity-60"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied" : "Copy image"}
          </button>
          <button
            type="button"
            onClick={shareQR}
            disabled={busy !== null}
            className="py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 flex items-center justify-center gap-1.5 disabled:opacity-60"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>
    </div>
  );

  /* ================================================================ */
  /* Layout: one responsive layout for every screen size              */
  /* ================================================================ */

  return (
    <div
      id="generator"
      ref={studioRef}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-24 lg:pb-12 scroll-mt-16"
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) readLogoFile(file);
        }}
        accept="image/png,image/jpeg,image/svg+xml,image/webp"
        className="hidden"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start">
        {/* Preview: below the content panel on mobile, right column on desktop */}
        <div ref={previewRef} className="order-2 lg:col-span-5 lg:order-2 lg:sticky lg:top-20">
          {previewCard}
        </div>

        {/* Controls */}
        <div className="order-1 lg:col-span-7 lg:order-1 min-w-0">
          <div id="studio-tabs" className="hidden lg:block sticky top-16 z-20 py-2 bg-slate-950/90 backdrop-blur-xl">
            <div role="tablist" className="grid grid-cols-5 gap-1 p-1 rounded-2xl bg-slate-900 border border-slate-800">
              {TABS.map((t) => {
                const Icon = t.icon;
                const active = activeTab === t.id;
                const dot =
                  (t.id === "logo" && Boolean(config.logoUrl)) || (t.id === "frame" && config.frame.enabled);
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => selectTab(t.id)}
                    className={`relative flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                      active ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {t.label}
                    {dot && !active && <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div
            ref={panelRef}
            className="lg:mt-3 lg:p-6 lg:rounded-3xl lg:bg-slate-900/60 lg:border lg:border-slate-800 scroll-mt-16"
          >
            <div className="lg:hidden flex items-center gap-2 mb-3 px-1">
              {(() => {
                const t = TABS.find((x) => x.id === activeTab)!;
                const Icon = t.icon;
                return (
                  <>
                    <span className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-300 grid place-items-center">
                      <Icon className="w-4 h-4" />
                    </span>
                    <h2 className="text-lg font-black text-white">{t.label}</h2>
                  </>
                );
              })()}
            </div>
            {panels[activeTab]}
          </div>
        </div>
      </div>

      {/* Mobile: floating live mini preview while the big preview is off screen */}
      {thumb && (
        <button
          type="button"
          onClick={scrollToPreview}
          aria-label="Show QR preview"
          className={`lg:hidden fixed right-4 z-40 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] w-[72px] h-[72px] p-1.5 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl shadow-black/60 transition-all duration-300 ${
            !previewInView && studioInView ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={thumb} alt="" className="w-full h-full rounded-lg" />
          <span
            className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
              decoder.checking ? "bg-slate-500" : decoder.ok ? "bg-emerald-400" : "bg-rose-400"
            }`}
          />
        </button>
      )}

      {/* Mobile: app-style bottom tab bar */}
      <nav
        role="tablist"
        aria-label="QR settings"
        className={`lg:hidden fixed inset-x-0 bottom-0 z-40 bg-slate-950 border-t border-slate-800 pb-[env(safe-area-inset-bottom)] transition-transform duration-300 ${
          studioInView ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="max-w-md mx-auto grid grid-cols-5">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            const dot = (t.id === "logo" && Boolean(config.logoUrl)) || (t.id === "frame" && config.frame.enabled);
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => selectTab(t.id)}
                className={`relative flex flex-col items-center gap-1 pt-2.5 pb-2 text-[11px] font-semibold transition-colors ${
                  active ? "text-white" : "text-slate-400"
                }`}
              >
                <span
                  className={`w-12 h-7 rounded-full grid place-items-center transition-colors ${
                    active ? "bg-indigo-600 shadow-md shadow-indigo-600/40" : ""
                  }`}
                >
                  <Icon className="w-[18px] h-[18px]" />
                </span>
                {t.label}
                {dot && <span className="absolute top-2 right-[22%] w-1.5 h-1.5 rounded-full bg-emerald-400" />}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Toast */}
      {toast && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-24 lg:bottom-8 z-50 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white shadow-xl animate-fadeIn">
          {toast}
        </div>
      )}
    </div>
  );
}

export default QRStudio;
