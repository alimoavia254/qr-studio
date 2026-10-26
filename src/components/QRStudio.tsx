"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import confetti from "canvas-confetti";
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
  ShieldCheck,
  AlertTriangle,
  Eye,
  RefreshCw,
  Palette,
  Sliders,
  Image as ImageIcon,
  ExternalLink,
  Lock,
  Layers,
  LayoutTemplate,
  Tag,
  Type,
  Scan,
  Shield,
  Printer,
  Share2,
  Zap,
} from "lucide-react";
import { QRDesignConfig, QRContentType, ThemeCategory, PosterTemplatePreset } from "@/types/qr";
import { formatQRData } from "@/lib/qrDataFormatters";
import { evaluateScannability } from "@/lib/colorUtils";
import { QR_PRESETS, SAMPLE_LOGOS } from "@/lib/qrPresets";
import { POSTER_TEMPLATES } from "@/lib/posterTemplates";
import type {
  DotType,
  CornerSquareType,
  CornerDotType,
  ErrorCorrectionLevel,
} from "qr-code-styling";

const INITIAL_CONFIG: QRDesignConfig = {
  contentType: "url",
  url: "https://mybrand.com",
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
  dotsColor: "#4f46e5",
  gradientColor1: "#4f46e5",
  gradientColor2: "#9333ea",
  gradientType: "linear",
  gradientRotation: 45,
  customEyeColor: true,
  cornerSquareColor: "#4338ca",
  cornerDotColor: "#7e22ce",
  bgColor: "#ffffff",
  isTransparentBg: false,
  logoUrl: null,
  logoSize: 0.28,
  logoMargin: 6,
  hideBehindLogo: true,
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

export interface QRStudioProps {
  initialContentType?: QRContentType;
  initialTab?: "content" | "logo" | "style" | "frame" | "presets";
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
  const [exportRes, setExportRes] = useState<number>(1024);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"content" | "logo" | "style" | "frame" | "presets">(initialTab);
  const [selectedCategory, setSelectedCategory] = useState<"all" | ThemeCategory>("all");
  const [showScanModal, setShowScanModal] = useState<boolean>(false);
  const [wifiShowPass, setWifiShowPass] = useState<boolean>(false);
  const [isDraggingLogo, setIsDraggingLogo] = useState<boolean>(false);
  const [decoderResult, setDecoderResult] = useState<{
    isVerifying: boolean;
    isScannable: boolean;
    decodedData: string | null;
    match: boolean;
    latencyMs: number;
    reason?: string;
  }>({
    isVerifying: true,
    isScannable: true,
    decodedData: null,
    match: true,
    latencyMs: 0,
  });

  const qrContainerRef = useRef<HTMLDivElement>(null);
  const qrCodeInstanceRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewSectionRef = useRef<HTMLDivElement>(null);

  // Formatted data payload string
  const qrData = useMemo(() => formatQRData(config), [config]);

  // Scannability score
  const scannability = useMemo(() => {
    const fg = config.colorType === "gradient" ? config.gradientColor1 : config.dotsColor;
    const bg = config.isTransparentBg ? "#ffffff" : config.bgColor;
    return evaluateScannability(
      fg,
      bg,
      Boolean(config.logoUrl),
      config.logoSize,
      config.errorCorrectionLevel
    );
  }, [config]);

  // Build qr-code-styling options object
  const getQROptions = (size: number) => {
    const isGradient = config.colorType === "gradient";
    const bg = config.isTransparentBg ? "transparent" : config.bgColor;

    return {
      width: size,
      height: size,
      type: "canvas" as const,
      data: qrData,
      image: config.logoUrl || undefined,
      shape: config.shape,
      margin: 16,
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
        color: bg,
      },
    };
  };

  // Initialize and update QR code
  useEffect(() => {
    let isMounted = true;

    async function initQR() {
      if (typeof window === "undefined" || !qrContainerRef.current) return;

      const { default: QRCodeStyling } = await import("qr-code-styling");

      if (!isMounted) return;

      const options = getQROptions(320);

      if (!qrCodeInstanceRef.current) {
        qrCodeInstanceRef.current = new QRCodeStyling(options);
        qrContainerRef.current.innerHTML = "";
        qrCodeInstanceRef.current.append(qrContainerRef.current);
      } else {
        qrCodeInstanceRef.current.update(options);
      }
    }

    initQR();

    return () => {
      isMounted = false;
    };
  }, [config, qrData]);

  // Real Hardware QR Decoder Engine Test (jsQR)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let isCancelled = false;

    async function runDecoderTest() {
      if (typeof window === "undefined" || !qrContainerRef.current) return;

      timer = setTimeout(async () => {
        try {
          const canvas = qrContainerRef.current?.querySelector("canvas");
          if (!canvas) return;

          const ctx = canvas.getContext("2d", { willReadFrequently: true });
          if (!ctx) return;

          const { default: jsQR } = await import("jsqr");
          if (isCancelled) return;

          const startTime = performance.now();
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "attemptBoth",
          });
          const latency = Math.round(performance.now() - startTime);

          if (isCancelled) return;

          if (code && code.data) {
            setDecoderResult({
              isVerifying: false,
              isScannable: true,
              decodedData: code.data,
              match: code.data === qrData,
              latencyMs: latency,
            });
          } else {
            let reason = "QR modules could not be parsed by camera decoder.";
            if (config.logoUrl && config.logoSize > 0.30) {
              reason = `Logo size (${Math.round(config.logoSize * 100)}%) is too large, covering error-correction parity modules. Reduce logo scale below 30%.`;
            } else if (scannability.score < 55) {
              reason = `Color contrast ratio (${scannability.contrastRatio}:1) is too low for standard camera sensors. Use darker dots or white background.`;
            }
            setDecoderResult({
              isVerifying: false,
              isScannable: false,
              decodedData: null,
              match: false,
              latencyMs: latency,
              reason,
            });
          }
        } catch (err) {
          console.error("Decoder error:", err);
        }
      }, 140);
    }

    runDecoderTest();

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [config, qrData, scannability]);

  // Handle Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      alert("Please upload a logo file under 4MB for optimal performance.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setConfig((prev) => ({
        ...prev,
        logoUrl: result,
        errorCorrectionLevel: "H", // Auto ensure highest fault tolerance
      }));
    };
    reader.readAsDataURL(file);
  };

  // Remove Logo
  const removeLogo = () => {
    setConfig((prev) => ({ ...prev, logoUrl: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Apply Preset
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

  // Apply Poster Template Preset
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
      // Apply recommended styling for maximum aesthetic harmony
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

  // High-Resolution Export
  const downloadQR = async (format: "png" | "svg" | "jpeg") => {
    if (typeof window === "undefined") return;
    setIsDownloading(true);

    try {
      const { default: QRCodeStyling } = await import("qr-code-styling");
      const highResOptions = getQROptions(exportRes);
      const exporter = new QRCodeStyling(highResOptions);

      if (config.frame.enabled && (format === "png" || format === "jpeg")) {
        const rawBlob = await exporter.getRawData("png");
        if (rawBlob) {
          const img = new Image();
          const imgUrl = URL.createObjectURL(rawBlob as Blob);
          await new Promise((res, rej) => {
            img.onload = () => res(true);
            img.onerror = rej;
            img.src = imgUrl;
          });

          // Proportions: 1 : 1.42 printable poster ratio
          const posterW = exportRes;
          const posterH = Math.round(exportRes * 1.42);
          const canvas = document.createElement("canvas");
          canvas.width = posterW;
          canvas.height = posterH;
          const ctx = canvas.getContext("2d");

          if (ctx) {
            // 1. Draw Card Background
            ctx.fillStyle = config.frame.cardBgColor || "#ffffff";
            if (ctx.roundRect) {
              ctx.beginPath();
              ctx.roundRect(0, 0, posterW, posterH, Math.round(posterW * 0.04));
              ctx.fill();
            } else {
              ctx.fillRect(0, 0, posterW, posterH);
            }

            // 2. Draw Card Border
            ctx.strokeStyle = config.frame.cardTextColor === "#ffffff" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)";
            ctx.lineWidth = Math.round(posterW * 0.005);
            if (ctx.roundRect) {
              ctx.beginPath();
              ctx.roundRect(0, 0, posterW, posterH, Math.round(posterW * 0.04));
              ctx.stroke();
            }

            // 3. Top Brand Tag
            const topY = Math.round(posterH * 0.08);
            if (config.frame.brandName) {
              ctx.fillStyle = config.frame.accentColor || "#4f46e5";
              ctx.font = `bold ${Math.round(posterW * 0.028)}px sans-serif`;
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillText(config.frame.brandName.toUpperCase(), posterW / 2, topY);
            }

            // 4. Main Headline
            const titleY = topY + Math.round(posterH * 0.065);
            ctx.fillStyle = config.frame.cardTextColor || "#0f172a";
            ctx.font = `900 ${Math.round(posterW * 0.068)}px sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(config.frame.text.toUpperCase(), posterW / 2, titleY);

            // 5. Subtitle
            let subY = titleY;
            if (config.frame.subtext) {
              subY = titleY + Math.round(posterH * 0.04);
              ctx.fillStyle = config.frame.cardTextColor === "#ffffff" ? "rgba(255,255,255,0.75)" : "rgba(15,23,42,0.65)";
              ctx.font = `500 ${Math.round(posterW * 0.03)}px sans-serif`;
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillText(config.frame.subtext, posterW / 2, subY);
            }

            // 6. QR Code Area Centered
            const qrSize = Math.round(posterW * 0.58);
            const qrX = (posterW - qrSize) / 2;
            const qrY = subY + Math.round(posterH * 0.05);

            // White backing pad
            const pad = Math.round(qrSize * 0.05);
            ctx.fillStyle = "#ffffff";
            if (ctx.roundRect) {
              ctx.beginPath();
              ctx.roundRect(qrX - pad, qrY - pad, qrSize + pad * 2, qrSize + pad * 2, Math.round(qrSize * 0.06));
              ctx.fill();
            } else {
              ctx.fillRect(qrX - pad, qrY - pad, qrSize + pad * 2, qrSize + pad * 2);
            }

            // 7. Viewfinder Corner Brackets [   ]
            if (config.frame.showViewfinder) {
              const vfPad = Math.round(qrSize * 0.08);
              const vfX = qrX - vfPad;
              const vfY = qrY - vfPad;
              const vfW = qrSize + vfPad * 2;
              const vfH = qrSize + vfPad * 2;
              const arm = Math.round(qrSize * 0.16);
              const lw = Math.round(posterW * 0.012);

              ctx.strokeStyle = config.frame.accentColor || "#4f46e5";
              ctx.lineWidth = lw;
              ctx.lineCap = "round";

              // Top-Left
              ctx.beginPath();
              ctx.moveTo(vfX, vfY + arm);
              ctx.lineTo(vfX, vfY);
              ctx.lineTo(vfX + arm, vfY);
              ctx.stroke();

              // Top-Right
              ctx.beginPath();
              ctx.moveTo(vfX + vfW - arm, vfY);
              ctx.lineTo(vfX + vfW, vfY);
              ctx.lineTo(vfX + vfW, vfY + arm);
              ctx.stroke();

              // Bottom-Left
              ctx.beginPath();
              ctx.moveTo(vfX, vfY + vfH - arm);
              ctx.lineTo(vfX, vfY + vfH);
              ctx.lineTo(vfX + arm, vfY + vfH);
              ctx.stroke();

              // Bottom-Right
              ctx.beginPath();
              ctx.moveTo(vfX + vfW - arm, vfY + vfH);
              ctx.lineTo(vfX + vfW, vfY + vfH);
              ctx.lineTo(vfX + vfW, vfY + vfH - arm);
              ctx.stroke();
            }

            // Draw QR image
            ctx.drawImage(img, qrX, qrY, qrSize, qrSize);

            // 8. Steps Badge
            let footerAreaY = qrY + qrSize + pad + Math.round(posterH * 0.04);
            if (config.frame.showStepsBadge) {
              const badgeText = "1. Open Camera   •   2. Point at QR   •   3. Tap Link";
              const bw = Math.round(posterW * 0.82);
              const bh = Math.round(posterH * 0.048);
              const bx = (posterW - bw) / 2;

              ctx.fillStyle = config.frame.accentColor || "#4f46e5";
              if (ctx.roundRect) {
                ctx.beginPath();
                ctx.roundRect(bx, footerAreaY, bw, bh, Math.round(bh / 2));
                ctx.fill();
              } else {
                ctx.fillRect(bx, footerAreaY, bw, bh);
              }

              ctx.fillStyle = "#ffffff";
              ctx.font = `bold ${Math.round(posterW * 0.026)}px sans-serif`;
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillText(badgeText, posterW / 2, footerAreaY + bh / 2);

              footerAreaY += bh + Math.round(posterH * 0.03);
            }

            // 9. Footer Note
            if (config.frame.footerNote) {
              ctx.fillStyle = config.frame.cardTextColor === "#ffffff" ? "rgba(255,255,255,0.7)" : "rgba(15,23,42,0.6)";
              ctx.font = `500 ${Math.round(posterW * 0.026)}px sans-serif`;
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillText(config.frame.footerNote, posterW / 2, footerAreaY);
            }

            URL.revokeObjectURL(imgUrl);

            canvas.toBlob((blob) => {
              if (blob) {
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = `qrvibe-poster-${config.contentType}-${exportRes}px.${format}`;
                a.click();
              }
            }, `image/${format}`);

            confetti({ particleCount: 90, spread: 70, origin: { y: 0.8 } });
            setIsDownloading(false);
            return;
          }
        }
      }

      await exporter.download({
        name: `qrvibe-${config.contentType}-${exportRes}px`,
        extension: format,
      });

      // Confetti burst
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Copy PNG to Clipboard
  const copyToClipboard = async () => {
    if (typeof window === "undefined") return;
    try {
      const { default: QRCodeStyling } = await import("qr-code-styling");
      const tempOptions = getQROptions(1024);
      const exporter = new QRCodeStyling(tempOptions);
      const rawBlob = await exporter.getRawData("png");

      if (rawBlob && navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": rawBlob as Blob }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } else {
        alert("Clipboard copying is not supported on this browser.");
      }
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  // Native Mobile Web Share (Direct to WhatsApp / Photos / AirDrop)
  const shareQR = async () => {
    if (typeof window === "undefined") return;
    try {
      const { default: QRCodeStyling } = await import("qr-code-styling");
      const tempOptions = getQROptions(1024);
      const exporter = new QRCodeStyling(tempOptions);
      const rawBlob = await exporter.getRawData("png");
      if (rawBlob && navigator.share) {
        const file = new File([rawBlob as Blob], `qrvibe-${config.contentType}.png`, {
          type: "image/png",
        });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: "My Custom QR Code",
            text: "Generated with QR Vibe (qrvibe.online)",
          });
          return;
        } else {
          await navigator.share({
            title: "My Custom QR Code",
            text: "Scan my custom brand QR code",
            url: window.location.href,
          });
          return;
        }
      }
      // Fallback: direct download
      await downloadQR("png");
    } catch (err) {
      console.log("Share dismissed or not supported", err);
    }
  };

  const quickMobileStyles = [
    {
      id: "violet-flow",
      name: "Violet",
      dotType: "rounded" as DotType,
      cornerSquareType: "extra-rounded" as CornerSquareType,
      cornerDotType: "dot" as CornerDotType,
      colorType: "gradient" as const,
      gradientColor1: "#6366f1",
      gradientColor2: "#a855f7",
      dotsColor: "#6366f1",
      cornerSquareColor: "#4f46e5",
      cornerDotColor: "#9333ea",
      bgColor: "#ffffff",
      dotColor: "#6366f1",
    },
    {
      id: "emerald-chat",
      name: "WhatsApp",
      dotType: "dots" as DotType,
      cornerSquareType: "extra-rounded" as CornerSquareType,
      cornerDotType: "dot" as CornerDotType,
      colorType: "gradient" as const,
      gradientColor1: "#059669",
      gradientColor2: "#10b981",
      dotsColor: "#059669",
      cornerSquareColor: "#047857",
      cornerDotColor: "#059669",
      bgColor: "#ffffff",
      dotColor: "#059669",
    },
    {
      id: "ocean-breeze",
      name: "Ocean",
      dotType: "classy-rounded" as DotType,
      cornerSquareType: "extra-rounded" as CornerSquareType,
      cornerDotType: "dot" as CornerDotType,
      colorType: "gradient" as const,
      gradientColor1: "#0284c7",
      gradientColor2: "#06b6d4",
      dotsColor: "#0284c7",
      cornerSquareColor: "#0369a1",
      cornerDotColor: "#0891b2",
      bgColor: "#ffffff",
      dotColor: "#0284c7",
    },
    {
      id: "sunset-glow",
      name: "Amber",
      dotType: "classy" as DotType,
      cornerSquareType: "extra-rounded" as CornerSquareType,
      cornerDotType: "dot" as CornerDotType,
      colorType: "gradient" as const,
      gradientColor1: "#d97706",
      gradientColor2: "#ea580c",
      dotsColor: "#d97706",
      cornerSquareColor: "#b45309",
      cornerDotColor: "#c2410c",
      bgColor: "#ffffff",
      dotColor: "#d97706",
    },
    {
      id: "midnight-cyber",
      name: "Dark",
      dotType: "rounded" as DotType,
      cornerSquareType: "square" as CornerSquareType,
      cornerDotType: "dot" as CornerDotType,
      colorType: "gradient" as const,
      gradientColor1: "#818cf8",
      gradientColor2: "#c084fc",
      dotsColor: "#818cf8",
      cornerSquareColor: "#6366f1",
      cornerDotColor: "#a855f7",
      bgColor: "#090d16",
      dotColor: "#818cf8",
    },
  ];

  const contentTypes: { id: QRContentType; label: string; icon: React.ElementType }[] = [
    { id: "url", label: "Website URL", icon: Globe },
    { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
    { id: "wifi", label: "Wi-Fi", icon: Wifi },
    { id: "vcard", label: "vCard Card", icon: Contact },
    { id: "email", label: "Email", icon: Mail },
    { id: "text", label: "Plain Text", icon: FileText },
  ];

  return (
    <div id="generator" className="py-6 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 lg:pb-10">
      {/* Studio Top Hero Subtitle */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold mb-3 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Interactive QR Vibe Studio</span>
        </div>
        <h1 className="text-2xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Create Beautiful,{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Scannable Brand QR Codes
          </span>
        </h1>
        <p className="mt-2 sm:mt-3 text-slate-400 text-xs sm:text-base">
          Embed your logo, style dots and gradients, and verify instant scannability before downloading in ultra-high resolution.
        </p>
      </div>

      {/* Main Grid: Left Controls (order-2 on mobile) / Right Sticky Preview (order-1 on mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column (7 cols): Studio Controls */}
        <div className="order-2 lg:order-1 lg:col-span-7 space-y-6">
          {/* Main Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl overflow-x-auto no-scrollbar scroll-smooth">
            <button
              type="button"
              onClick={() => setActiveTab("content")}
              className={`shrink-0 sm:flex-1 py-2 sm:py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                activeTab === "content"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>1. Content</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("logo")}
              className={`shrink-0 sm:flex-1 py-2 sm:py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 relative whitespace-nowrap ${
                activeTab === "logo"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>2. Brand Logo</span>
              {config.logoUrl && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 absolute top-2 right-2 animate-pulse" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("style")}
              className={`shrink-0 sm:flex-1 py-2 sm:py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                activeTab === "style"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>3. Styling</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("frame")}
              className={`shrink-0 sm:flex-1 py-2 sm:py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 relative whitespace-nowrap ${
                activeTab === "frame"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <LayoutTemplate className="w-3.5 h-3.5" />
              <span>4. Posters</span>
              {config.frame.enabled && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 absolute top-2 right-2" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("presets")}
              className={`shrink-0 sm:flex-1 py-2 sm:py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                activeTab === "presets"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>5. Themes (35)</span>
            </button>
          </div>

          {/* TAB 1: CONTENT TYPE & INPUTS */}
          {activeTab === "content" && (
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  Choose QR Type
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {contentTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = config.contentType === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setConfig((prev) => ({ ...prev, contentType: type.id }))}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                          isSelected
                            ? "bg-indigo-600/20 border-indigo-500 text-white shadow-sm shadow-indigo-500/20 scale-[1.02]"
                            : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                        }`}
                      >
                        <Icon className={`w-5 h-5 mb-1.5 ${isSelected ? "text-indigo-400" : ""}`} />
                        <span className="text-[11px] font-semibold">{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Inputs */}
              <div className="pt-2 border-t border-slate-800/80">
                {/* 1. URL Input */}
                {config.contentType === "url" && (
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold text-slate-200">
                      Destination Website URL
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        value={config.url}
                        onChange={(e) => setConfig((prev) => ({ ...prev, url: e.target.value }))}
                        placeholder="https://example.com"
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                      />
                    </div>
                    {/* Quick prefixes */}
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[11px] text-slate-400">Quick suggestions:</span>
                      {["https://", "https://instagram.com/", "https://wa.me/"].map((prefix) => (
                        <button
                          key={prefix}
                          type="button"
                          onClick={() => setConfig((prev) => ({ ...prev, url: prefix }))}
                          className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                        >
                          {prefix}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. WhatsApp Input */}
                {/* 2. WhatsApp Input */}
                {config.contentType === "whatsapp" && (
                  <div className="space-y-4">
                    {/* Link Style Selector */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                        Scan Action Link Format
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setConfig((prev) => ({
                              ...prev,
                              whatsapp: { ...prev.whatsapp, linkStyle: "api" },
                            }))
                          }
                          className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                            config.whatsapp.linkStyle === "api" || !config.whatsapp.linkStyle
                              ? "bg-indigo-600/20 border-indigo-500 text-white"
                              : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white"
                          }`}
                        >
                          <div className="font-bold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            <span>Direct Link (api.whatsapp.com)</span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Triggers &quot;Open in WhatsApp&quot; on Camera Scan
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setConfig((prev) => ({
                              ...prev,
                              whatsapp: { ...prev.whatsapp, linkStyle: "intent" },
                            }))
                          }
                          className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                            config.whatsapp.linkStyle === "intent"
                              ? "bg-indigo-600/20 border-indigo-500 text-white"
                              : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white"
                          }`}
                        >
                          <div className="font-bold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-indigo-400" />
                            <span>App Scheme (whatsapp://)</span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Direct app trigger on Android scanners
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setConfig((prev) => ({
                              ...prev,
                              whatsapp: { ...prev.whatsapp, linkStyle: "wame" },
                            }))
                          }
                          className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                            config.whatsapp.linkStyle === "wame"
                              ? "bg-indigo-600/20 border-indigo-500 text-white"
                              : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white"
                          }`}
                        >
                          <div className="font-bold">Short Link (wa.me)</div>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Compact short-link format
                          </p>
                        </button>
                      </div>
                    </div>

                    {/* Quick WhatsApp Message Templates */}
                    <div>
                      <span className="block text-[11px] text-slate-400 mb-1.5">
                        Quick Message Templates (Auto-fill chat):
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {[
                          {
                            label: "💼 Business Inquiry",
                            msg: "Hello! I am interested in your services and would like more details.",
                          },
                          {
                            label: "🛍️ Product & Order",
                            msg: "Hi! I would like to inquire about product pricing and availability.",
                          },
                          {
                            label: "💰 Price Quotation",
                            msg: "Hello! Could you please share a price quotation for your services?",
                          },
                          {
                            label: "📅 Book Consultation",
                            msg: "Hi, I would like to schedule an appointment/meeting with your team.",
                          },
                          {
                            label: "🛠️ Customer Support",
                            msg: "Hello Support, I need some assistance with my order/account.",
                          },
                        ].map((tmpl) => (
                          <button
                            key={tmpl.label}
                            type="button"
                            onClick={() =>
                              setConfig((prev) => ({
                                ...prev,
                                whatsapp: { ...prev.whatsapp, message: tmpl.msg },
                              }))
                            }
                            className="px-2.5 py-1 rounded-lg text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                          >
                            {tmpl.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                          Country Code
                        </label>
                        <input
                          type="text"
                          value={config.whatsapp.countryCode}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              whatsapp: { ...prev.whatsapp, countryCode: e.target.value },
                            }))
                          }
                          placeholder="+92"
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                          WhatsApp Phone Number
                        </label>
                        <input
                          type="tel"
                          value={config.whatsapp.phone}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              whatsapp: { ...prev.whatsapp, phone: e.target.value },
                            }))
                          }
                          placeholder="3001234567"
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Quick country codes */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      <span className="text-[11px] text-slate-400">Popular:</span>
                      {[
                        { code: "+92", label: "🇵🇰 +92" },
                        { code: "+971", label: "🇦🇪 +971" },
                        { code: "+966", label: "🇸🇦 +966" },
                        { code: "+44", label: "🇬🇧 +44" },
                        { code: "+1", label: "🇺🇸 +1" },
                        { code: "+91", label: "🇮🇳 +91" },
                      ].map((item) => (
                        <button
                          key={item.code}
                          type="button"
                          onClick={() =>
                            setConfig((prev) => ({
                              ...prev,
                              whatsapp: { ...prev.whatsapp, countryCode: item.code },
                            }))
                          }
                          className="px-2 py-0.5 rounded text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                        Pre-filled WhatsApp Message
                      </label>
                      <textarea
                        rows={2}
                        value={config.whatsapp.message}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            whatsapp: { ...prev.whatsapp, message: e.target.value },
                          }))
                        }
                        placeholder="Hello, I want to inquire about your services..."
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    {/* Live WhatsApp Auto-Fill Draft & Test */}
                    <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                          Auto-Filled WhatsApp Chat Preview:
                        </span>
                        <a
                          href={qrData.startsWith("http") ? qrData : `https://api.whatsapp.com/send?phone=${config.whatsapp.phone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Test Chat</span>
                        </a>
                      </div>
                      <div className="text-[11px] font-mono text-slate-300 space-y-0.5">
                        <p>
                          <span className="text-slate-500">Phone:</span>{" "}
                          <span className="text-emerald-400">{config.whatsapp.countryCode} {config.whatsapp.phone || "(empty)"}</span>
                        </p>
                        <p className="truncate">
                          <span className="text-slate-500">Auto Message:</span>{" "}
                          <span className="text-white">{config.whatsapp.message || "(No pre-filled message)"}</span>
                        </p>
                        <p className="text-[10px] text-slate-500 truncate pt-1 border-t border-slate-800/60">
                          Target Payload: {qrData}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Wi-Fi Input */}
                {config.contentType === "wifi" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                          Network Name (SSID)
                        </label>
                        <input
                          type="text"
                          value={config.wifi.ssid}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              wifi: { ...prev.wifi, ssid: e.target.value },
                            }))
                          }
                          placeholder="Office_Wi-Fi"
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                          Security Type
                        </label>
                        <select
                          value={config.wifi.encryption}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              wifi: { ...prev.wifi, encryption: e.target.value as any },
                            }))
                          }
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none"
                        >
                          <option value="WPA">WPA/WPA2/WPA3 (Standard)</option>
                          <option value="WEP">WEP (Legacy)</option>
                          <option value="nopass">None (Open Network)</option>
                        </select>
                      </div>
                    </div>
                    {config.wifi.encryption !== "nopass" && (
                      <div>
                        <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                          Wi-Fi Password
                        </label>
                        <div className="relative">
                          <input
                            type={wifiShowPass ? "text" : "password"}
                            value={config.wifi.password}
                            onChange={(e) =>
                              setConfig((prev) => ({
                                ...prev,
                                wifi: { ...prev.wifi, password: e.target.value },
                              }))
                            }
                            placeholder="Network password"
                            className="w-full px-4 py-2.5 pr-10 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setWifiShowPass(!wifiShowPass)}
                            className="absolute right-3 top-3 text-slate-400 hover:text-white"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                    <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={config.wifi.hidden}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            wifi: { ...prev.wifi, hidden: e.target.checked },
                          }))
                        }
                        className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-0"
                      />
                      <span>Hidden SSID Network</span>
                    </label>
                  </div>
                )}

                {/* 4. vCard Input */}
                {config.contentType === "vcard" && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-200 mb-1">First Name</label>
                        <input
                          type="text"
                          value={config.vcard.firstName}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              vcard: { ...prev.vcard, firstName: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-200 mb-1">Last Name</label>
                        <input
                          type="text"
                          value={config.vcard.lastName}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              vcard: { ...prev.vcard, lastName: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-200 mb-1">Phone</label>
                        <input
                          type="tel"
                          value={config.vcard.phone}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              vcard: { ...prev.vcard, phone: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-200 mb-1">Email</label>
                        <input
                          type="email"
                          value={config.vcard.email}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              vcard: { ...prev.vcard, email: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-200 mb-1">Company</label>
                        <input
                          type="text"
                          value={config.vcard.company}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              vcard: { ...prev.vcard, company: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-200 mb-1">Job Title</label>
                        <input
                          type="text"
                          value={config.vcard.title}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              vcard: { ...prev.vcard, title: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. Email Input */}
                {config.contentType === "email" && (
                  <div className="space-y-4">
                    {/* Format Selector */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                        Scan Auto-Fill Format
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setConfig((prev) => ({
                              ...prev,
                              email: { ...prev.email, format: "mailto" },
                            }))
                          }
                          className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                            config.email.format !== "matmsg"
                              ? "bg-indigo-600/20 border-indigo-500 text-white"
                              : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white"
                          }`}
                        >
                          <div className="font-bold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-indigo-400" />
                            <span>Standard URI (mailto:)</span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Standard RFC format for iOS Camera, Mac &amp; Webmail
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setConfig((prev) => ({
                              ...prev,
                              email: { ...prev.email, format: "matmsg" },
                            }))
                          }
                          className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                            config.email.format === "matmsg"
                              ? "bg-indigo-600/20 border-indigo-500 text-white"
                              : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white"
                          }`}
                        >
                          <div className="font-bold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            <span>Phone Scanner (MATMSG)</span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Forces Android camera/scanners to auto-fill Subject &amp; Body
                          </p>
                        </button>
                      </div>
                    </div>

                    {/* Quick Subject & Body Templates */}
                    <div>
                      <span className="block text-[11px] text-slate-400 mb-1.5">
                        Quick Templates (Auto-fill all fields):
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {[
                          {
                            label: "💼 Business Inquiry",
                            sub: "Business & Project Inquiry",
                            body: "Hi team,\n\nI would like to inquire about your services.",
                          },
                          {
                            label: "🛠️ Customer Support",
                            sub: "Support Request - [Order / Account #]",
                            body: "Hello Support,\n\nI need assistance with the following issue:\n",
                          },
                          {
                            label: "💰 Request a Quote",
                            sub: "Price Quote Request",
                            body: "Hello,\n\nPlease provide a quote for the following requirements:\n",
                          },
                          {
                            label: "⭐ Feedback",
                            sub: "Customer Feedback & Review",
                            body: "Hi there,\n\nI would love to share some feedback regarding:\n",
                          },
                        ].map((tmpl) => (
                          <button
                            key={tmpl.label}
                            type="button"
                            onClick={() =>
                              setConfig((prev) => ({
                                ...prev,
                                email: {
                                  ...prev.email,
                                  subject: tmpl.sub,
                                  body: tmpl.body,
                                },
                              }))
                            }
                            className="px-2.5 py-1 rounded-lg text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                          >
                            {tmpl.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-200 mb-1">
                        Recipient Email (TO:)
                      </label>
                      <input
                        type="email"
                        value={config.email.email}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            email: { ...prev.email, email: e.target.value },
                          }))
                        }
                        placeholder="hello@example.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-200 mb-1">
                        Subject Line
                      </label>
                      <input
                        type="text"
                        value={config.email.subject}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            email: { ...prev.email, subject: e.target.value },
                          }))
                        }
                        placeholder="Project Inquiry"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-200 mb-1">
                        Email Body (Message Text)
                      </label>
                      <textarea
                        rows={3}
                        value={config.email.body}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            email: { ...prev.email, body: e.target.value },
                          }))
                        }
                        placeholder="Type your pre-filled email message here..."
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500"
                      />
                    </div>

                    {/* Live Auto-fill Preview and Test Button */}
                    <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                          Auto-Filled Draft Preview:
                        </span>
                        <a
                          href={`mailto:${config.email.email}?subject=${encodeURIComponent(
                            config.email.subject
                          )}&body=${encodeURIComponent(config.email.body)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold flex items-center gap-1 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Test in Mail App</span>
                        </a>
                      </div>
                      <div className="text-[11px] font-mono text-slate-300 space-y-0.5">
                        <p>
                          <span className="text-slate-500">TO:</span>{" "}
                          <span className="text-indigo-400">{config.email.email || "(empty)"}</span>
                        </p>
                        <p>
                          <span className="text-slate-500">Subject:</span>{" "}
                          <span className="text-white">{config.email.subject || "(empty)"}</span>
                        </p>
                        <p className="truncate">
                          <span className="text-slate-500">Body:</span>{" "}
                          <span className="text-slate-400">{config.email.body || "(empty)"}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. Plain Text Input */}
                {config.contentType === "text" && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                      Plain Text Note
                    </label>
                    <textarea
                      rows={4}
                      value={config.text}
                      onChange={(e) => setConfig((prev) => ({ ...prev, text: e.target.value }))}
                      placeholder="Write your message here..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: BRAND LOGO */}
          {activeTab === "logo" && (
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Brand Logo Centerpiece</h3>
                  <p className="text-xs text-slate-400">
                    Upload your high-res logo or pick a popular brand icon.
                  </p>
                </div>
                {config.logoUrl && (
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove Logo</span>
                  </button>
                )}
              </div>

              {/* Upload Drop Area & Live Centerpiece Preview */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/svg+xml, image/webp"
                onChange={handleLogoUpload}
                className="hidden"
              />

              {config.logoUrl ? (
                /* Active Logo Card */
                <div className="p-4 rounded-2xl bg-slate-950/90 border border-indigo-500/40 ring-1 ring-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-16 h-16 rounded-xl bg-white p-2 shadow-inner border border-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={config.logoUrl}
                        alt="Brand Logo"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">Active Logo Embedded</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Level-H Active
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Positioned in QR dead-center with 30% error correction tolerance.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                    >
                      Change Logo
                    </button>
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                /* Drag-and-Drop Zone */
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingLogo(true);
                  }}
                  onDragLeave={() => setIsDraggingLogo(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingLogo(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        setConfig((prev) => ({
                          ...prev,
                          logoUrl: ev.target?.result as string,
                          errorCorrectionLevel: "H",
                        }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                    isDraggingLogo
                      ? "border-indigo-400 bg-indigo-950/40 scale-[1.01]"
                      : "border-slate-700 hover:border-indigo-500 bg-slate-950/40 hover:bg-slate-950/80"
                  } group`}
                >
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-white">
                    {isDraggingLogo ? "Drop your logo here now!" : "Click to browse or Drag & Drop brand logo"}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Supports PNG, SVG, JPG or WebP (Square with transparent background works best)
                  </p>
                  <span className="inline-block mt-2.5 text-[10px] font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">
                    🔒 Client-Side Only: Never uploaded to servers
                  </span>
                </div>
              )}

              {/* Instant Sample Logos */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Or Test Instantly With Popular Brand Icons
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {SAMPLE_LOGOS.map((sample) => (
                    <button
                      key={sample.name}
                      type="button"
                      onClick={() =>
                        setConfig((prev) => ({
                          ...prev,
                          logoUrl: sample.url,
                          errorCorrectionLevel: "H",
                        }))
                      }
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block"
                        style={{ backgroundColor: sample.color }}
                      />
                      <span>{sample.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Logo Sizing & Padding Sliders (Shown when logo exists) */}
              {config.logoUrl && (
                <div className="space-y-4 pt-4 border-t border-slate-800">
                  <div>
                    <div className="flex justify-between items-center text-xs font-medium text-slate-300 mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <span>Logo Scale</span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            config.logoSize <= 0.28
                              ? "bg-emerald-500/20 text-emerald-400"
                              : config.logoSize <= 0.32
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-rose-500/20 text-rose-400"
                          }`}
                        >
                          {config.logoSize <= 0.28
                            ? "Safe Scan Zone"
                            : config.logoSize <= 0.32
                            ? "Moderate Caution"
                            : "Risk: May Block Modules"}
                        </span>
                      </span>
                      <span className="font-mono font-bold text-white">
                        {Math.round(config.logoSize * 100)}%
                      </span>
                    </div>

                    <input
                      type="range"
                      min={0.16}
                      max={0.38}
                      step={0.02}
                      value={config.logoSize}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          logoSize: parseFloat(e.target.value),
                        }))
                      }
                      className="w-full accent-indigo-500 cursor-pointer"
                    />

                    {/* Visual Scannability Zone Indicator */}
                    <div className="flex justify-between text-[9px] font-mono text-slate-400 mt-1">
                      <span className="text-emerald-400">16% - 28% (Best Scannability)</span>
                      <span className="text-amber-400">30% (Max Recommended)</span>
                      <span className="text-rose-400">38% (High Risk)</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-300 mb-1.5">
                      <span>Logo Safe Padding / Margin</span>
                      <span>{config.logoMargin}px</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={14}
                      step={1}
                      value={config.logoMargin}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          logoMargin: parseInt(e.target.value, 10),
                        }))
                      }
                      className="w-full accent-indigo-500 cursor-pointer"
                    />
                  </div>

                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={config.hideBehindLogo}
                      onChange={(e) =>
                        setConfig((prev) => ({ ...prev, hideBehindLogo: e.target.checked }))
                      }
                      className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-0"
                    />
                    <span>Clear background dots behind logo for maximum emblem clarity</span>
                  </label>
                </div>
              )}

              {/* Error correction reassurance */}
              <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">High Scannability Protection</span>
                  <p className="text-slate-300 mt-0.5">
                    When a logo is present, QR Vibe automatically activates Level-H error correction
                    (30% redundancy), ensuring your code scans flawlessly even with a centered emblem.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STYLING & COLORS */}
          {activeTab === "style" && (
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-6">
              {/* SECTION 1: 1-CLICK DESIGNER PALETTES */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Instant Designer Color Palettes</span>
                  </label>
                  <span className="text-[11px] text-indigo-400 font-medium">1-Click Auto-Style</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    {
                      name: "Electric Violet",
                      c1: "#4f46e5",
                      c2: "#9333ea",
                      type: "gradient" as const,
                      bg: "#ffffff",
                    },
                    {
                      name: "Cyber Neon",
                      c1: "#06b6d4",
                      c2: "#a855f7",
                      type: "gradient" as const,
                      bg: "#090d16",
                    },
                    {
                      name: "Emerald Luxury",
                      c1: "#059669",
                      c2: "#10b981",
                      type: "gradient" as const,
                      bg: "#ffffff",
                    },
                    {
                      name: "Sunset Flame",
                      c1: "#f43f5e",
                      c2: "#f59e0b",
                      type: "gradient" as const,
                      bg: "#ffffff",
                    },
                    {
                      name: "Ocean Breeze",
                      c1: "#2563eb",
                      c2: "#06b6d4",
                      type: "gradient" as const,
                      bg: "#ffffff",
                    },
                    {
                      name: "Royal Amber",
                      c1: "#b45309",
                      c2: "#f59e0b",
                      type: "gradient" as const,
                      bg: "#ffffff",
                    },
                    {
                      name: "Pitch Black",
                      c1: "#0f172a",
                      c2: "#0f172a",
                      type: "single" as const,
                      bg: "#ffffff",
                    },
                    {
                      name: "Crimson Rose",
                      c1: "#e11d48",
                      c2: "#be185d",
                      type: "gradient" as const,
                      bg: "#ffffff",
                    },
                  ].map((pal) => {
                    const isSelected =
                      config.colorType === pal.type &&
                      (pal.type === "single"
                        ? config.dotsColor === pal.c1
                        : config.gradientColor1 === pal.c1 && config.gradientColor2 === pal.c2);

                    return (
                      <button
                        key={pal.name}
                        type="button"
                        onClick={() =>
                          setConfig((prev) => ({
                            ...prev,
                            colorType: pal.type,
                            dotsColor: pal.c1,
                            gradientColor1: pal.c1,
                            gradientColor2: pal.c2,
                            bgColor: pal.bg,
                            isTransparentBg: false,
                            customEyeColor: true,
                            cornerSquareColor: pal.c1,
                            cornerDotColor: pal.c2,
                          }))
                        }
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                          isSelected
                            ? "bg-indigo-600/25 border-indigo-500 shadow-md shadow-indigo-500/20 scale-[1.02]"
                            : "bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                        }`}
                      >
                        <div
                          className="w-7 h-7 rounded-lg shrink-0 border border-white/20 shadow-sm"
                          style={{
                            background:
                              pal.type === "gradient"
                                ? `linear-gradient(135deg, ${pal.c1}, ${pal.c2})`
                                : pal.c1,
                          }}
                        />
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-white truncate">{pal.name}</p>
                          <p className="text-[10px] text-slate-400 capitalize">
                            {pal.type === "gradient" ? "Gradient" : "Solid"}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 2: DOT PATTERN STYLE (With Visual SVG previews) */}
              <div className="pt-4 border-t border-slate-800">
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2.5">
                  1. Body Dot Pattern
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    {
                      id: "rounded",
                      label: "Rounded Pill",
                      sub: "Smooth modern pills",
                      svg: (
                        <svg className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
                          <rect x="4" y="4" width="6" height="6" rx="2" />
                          <rect x="14" y="4" width="6" height="6" rx="2" />
                          <rect x="4" y="14" width="6" height="6" rx="2" />
                          <rect x="14" y="14" width="6" height="6" rx="2" />
                        </svg>
                      ),
                    },
                    {
                      id: "dots",
                      label: "Circular Dots",
                      sub: "Minimalist circles",
                      svg: (
                        <svg className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
                          <circle cx="7" cy="7" r="3.2" />
                          <circle cx="17" cy="7" r="3.2" />
                          <circle cx="7" cy="17" r="3.2" />
                          <circle cx="17" cy="17" r="3.2" />
                        </svg>
                      ),
                    },
                    {
                      id: "classy",
                      label: "Classy Diamond",
                      sub: "Faceted diamond corners",
                      svg: (
                        <svg className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="7,3 11,7 7,11 3,7" />
                          <polygon points="17,3 21,7 17,11 13,7" />
                          <polygon points="7,13 11,17 7,21 3,17" />
                          <polygon points="17,13 21,17 17,21 13,17" />
                        </svg>
                      ),
                    },
                    {
                      id: "classy-rounded",
                      label: "Classy Wave",
                      sub: "Organic leaf curve",
                      svg: (
                        <svg className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M4 4h4a3 3 0 0 1 3 3v4H7a3 3 0 0 1-3-3V4z" />
                          <path d="M14 4h4a3 3 0 0 1 3 3v4h-4a3 3 0 0 1-3-3V4z" />
                          <path d="M4 14h4a3 3 0 0 1 3 3v4H7a3 3 0 0 1-3-3v-4z" />
                          <path d="M14 14h4a3 3 0 0 1 3 3v4h-4a3 3 0 0 1-3-3v-4z" />
                        </svg>
                      ),
                    },
                    {
                      id: "extra-rounded",
                      label: "Extra Smooth",
                      sub: "Ultra soft squircles",
                      svg: (
                        <svg className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
                          <rect x="4" y="4" width="6" height="6" rx="3" />
                          <rect x="14" y="4" width="6" height="6" rx="3" />
                          <rect x="4" y="14" width="6" height="6" rx="3" />
                          <rect x="14" y="14" width="6" height="6" rx="3" />
                        </svg>
                      ),
                    },
                    {
                      id: "square",
                      label: "Classic Square",
                      sub: "Standard industrial",
                      svg: (
                        <svg className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
                          <rect x="4" y="4" width="6" height="6" />
                          <rect x="14" y="4" width="6" height="6" />
                          <rect x="4" y="14" width="6" height="6" />
                          <rect x="14" y="14" width="6" height="6" />
                        </svg>
                      ),
                    },
                  ].map((dot) => {
                    const isSelected = config.dotType === dot.id;
                    return (
                      <button
                        key={dot.id}
                        type="button"
                        onClick={() =>
                          setConfig((prev) => ({ ...prev, dotType: dot.id as DotType }))
                        }
                        className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                          isSelected
                            ? "bg-indigo-600/20 border-indigo-500 shadow-md shadow-indigo-500/20"
                            : "bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                        }`}
                      >
                        <div
                          className={`p-1.5 rounded-lg border ${
                            isSelected
                              ? "bg-indigo-600/30 border-indigo-500/50"
                              : "bg-slate-900 border-slate-800"
                          }`}
                        >
                          {dot.svg}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{dot.label}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{dot.sub}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 3: CORNER EYES STYLING */}
              <div className="pt-4 border-t border-slate-800 space-y-4">
                <label className="block text-xs font-bold text-white uppercase tracking-wider">
                  2. Corner Eyes (Finder Patterns)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Outer Eye Frame */}
                  <div>
                    <span className="block text-[11px] font-semibold text-slate-300 mb-2">
                      Outer Frame Shape
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        {
                          id: "extra-rounded",
                          label: "Curved",
                          svg: (
                            <svg className="w-5 h-5 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="3" width="18" height="18" rx="6" />
                            </svg>
                          ),
                        },
                        {
                          id: "dot",
                          label: "Circle",
                          svg: (
                            <svg className="w-5 h-5 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="9" />
                            </svg>
                          ),
                        },
                        {
                          id: "square",
                          label: "Square",
                          svg: (
                            <svg className="w-5 h-5 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="3" width="18" height="18" />
                            </svg>
                          ),
                        },
                      ].map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() =>
                            setConfig((prev) => ({
                              ...prev,
                              cornerSquareType: c.id as CornerSquareType,
                            }))
                          }
                          className={`p-2.5 rounded-xl border text-center transition-all ${
                            config.cornerSquareType === c.id
                              ? "bg-indigo-600/25 border-indigo-500 text-white font-bold"
                              : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white"
                          }`}
                        >
                          <div className="mb-1 text-indigo-400">{c.svg}</div>
                          <span className="text-xs">{c.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Inner Eye Center */}
                  <div>
                    <span className="block text-[11px] font-semibold text-slate-300 mb-2">
                      Inner Center Dot
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        {
                          id: "dot",
                          label: "Round Dot",
                          svg: (
                            <svg className="w-5 h-5 mx-auto text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
                              <circle cx="12" cy="12" r="6" />
                            </svg>
                          ),
                        },
                        {
                          id: "square",
                          label: "Sharp Square",
                          svg: (
                            <svg className="w-5 h-5 mx-auto text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
                              <rect x="6" y="6" width="12" height="12" />
                            </svg>
                          ),
                        },
                      ].map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() =>
                            setConfig((prev) => ({
                              ...prev,
                              cornerDotType: c.id as CornerDotType,
                            }))
                          }
                          className={`p-2.5 rounded-xl border text-center transition-all ${
                            config.cornerDotType === c.id
                              ? "bg-indigo-600/25 border-indigo-500 text-white font-bold"
                              : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white"
                          }`}
                        >
                          <div className="mb-1">{c.svg}</div>
                          <span className="text-xs">{c.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 4: COLOR ENGINE (Single vs Gradient + Angle) */}
              <div className="pt-4 border-t border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white uppercase tracking-wider">
                    3. Custom Color Engine
                  </label>
                  <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                    <button
                      type="button"
                      onClick={() => setConfig((prev) => ({ ...prev, colorType: "gradient" }))}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        config.colorType === "gradient"
                          ? "bg-indigo-600 text-white font-bold shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Gradient
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfig((prev) => ({ ...prev, colorType: "single" }))}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        config.colorType === "single"
                          ? "bg-indigo-600 text-white font-bold shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Solid Color
                    </button>
                  </div>
                </div>

                {config.colorType === "single" ? (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-slate-700 shrink-0">
                      <input
                        type="color"
                        value={config.dotsColor}
                        onChange={(e) =>
                          setConfig((prev) => ({ ...prev, dotsColor: e.target.value }))
                        }
                        className="absolute -top-2 -left-2 w-14 h-14 cursor-pointer"
                      />
                    </div>
                    <input
                      type="text"
                      value={config.dotsColor}
                      onChange={(e) =>
                        setConfig((prev) => ({ ...prev, dotsColor: e.target.value }))
                      }
                      className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono w-28 uppercase"
                    />
                    <span className="text-xs text-slate-400">All dots &amp; elements color</span>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Gradient Color 1 (Start)
                        </span>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={config.gradientColor1}
                            onChange={(e) =>
                              setConfig((prev) => ({
                                ...prev,
                                gradientColor1: e.target.value,
                              }))
                            }
                            className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0"
                          />
                          <input
                            type="text"
                            value={config.gradientColor1}
                            onChange={(e) =>
                              setConfig((prev) => ({
                                ...prev,
                                gradientColor1: e.target.value,
                              }))
                            }
                            className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs font-mono w-full uppercase"
                          />
                        </div>
                      </div>

                      <div>
                        <span className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Gradient Color 2 (End)
                        </span>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={config.gradientColor2}
                            onChange={(e) =>
                              setConfig((prev) => ({
                                ...prev,
                                gradientColor2: e.target.value,
                              }))
                            }
                            className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0"
                          />
                          <input
                            type="text"
                            value={config.gradientColor2}
                            onChange={(e) =>
                              setConfig((prev) => ({
                                ...prev,
                                gradientColor2: e.target.value,
                              }))
                            }
                            className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs font-mono w-full uppercase"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Quick Angle Buttons */}
                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                        <span>Gradient Direction</span>
                        <span className="font-mono text-indigo-400 font-bold">
                          {config.gradientRotation}°
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { deg: 45, label: "↗ 45° (Diagonal)" },
                          { deg: 90, label: "➔ 90° (Vertical)" },
                          { deg: 135, label: "↘ 135° (Reverse)" },
                          { deg: 180, label: "↓ 180° (Horizontal)" },
                        ].map((ang) => (
                          <button
                            key={ang.deg}
                            type="button"
                            onClick={() =>
                              setConfig((prev) => ({
                                ...prev,
                                gradientRotation: ang.deg,
                              }))
                            }
                            className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold border transition-all ${
                              config.gradientRotation === ang.deg
                                ? "bg-indigo-600 text-white border-indigo-500"
                                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                            }`}
                          >
                            {ang.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 5: BACKGROUND & CONTRAST */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <label className="block text-xs font-bold text-white uppercase tracking-wider">
                  4. Background Style
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    {
                      label: "Pure White",
                      bg: "#ffffff",
                      trans: false,
                      desc: "Maximum Contrast",
                    },
                    {
                      label: "Dark Obsidian",
                      bg: "#090d16",
                      trans: false,
                      desc: "Dark Mode Style",
                    },
                    {
                      label: "Transparent",
                      bg: "#ffffff",
                      trans: true,
                      desc: "Lossless PNG/SVG",
                    },
                    {
                      label: "Custom Color",
                      bg: config.bgColor,
                      trans: false,
                      desc: "Custom Hex",
                    },
                  ].map((b, i) => {
                    const isSelected =
                      b.trans === config.isTransparentBg &&
                      (b.trans || (b.label === "Custom Color" ? true : config.bgColor === b.bg));

                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() =>
                          setConfig((prev) => ({
                            ...prev,
                            bgColor: b.bg,
                            isTransparentBg: b.trans,
                          }))
                        }
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? "bg-indigo-600/20 border-indigo-500 text-white"
                            : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        <p className="text-xs font-bold text-white">{b.label}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{b.desc}</p>
                      </button>
                    );
                  })}
                </div>

                {!config.isTransparentBg && (
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[11px] text-slate-400">Custom background color:</span>
                    <input
                      type="color"
                      value={config.bgColor}
                      onChange={(e) =>
                        setConfig((prev) => ({ ...prev, bgColor: e.target.value }))
                      }
                      className="w-7 h-7 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.bgColor}
                      onChange={(e) =>
                        setConfig((prev) => ({ ...prev, bgColor: e.target.value }))
                      }
                      className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-white text-xs font-mono w-24 uppercase"
                    />
                  </div>
                )}
              </div>

              {/* SECTION 6: INDEPENDENT EYE COLORS (Optional Accent) */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.customEyeColor}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          customEyeColor: e.target.checked,
                        }))
                      }
                      className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-0"
                    />
                    <span>Independent Eye Accent Colors</span>
                  </label>
                  <span className="text-[11px] text-slate-400">Contrast Eyes</span>
                </div>

                {config.customEyeColor && (
                  <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div>
                      <span className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Outer Eye Frame Color
                      </span>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={config.cornerSquareColor}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              cornerSquareColor: e.target.value,
                            }))
                          }
                          className="w-8 h-8 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={config.cornerSquareColor}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              cornerSquareColor: e.target.value,
                            }))
                          }
                          className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-white text-xs font-mono w-full uppercase"
                        />
                      </div>
                    </div>

                    <div>
                      <span className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Inner Eye Center Color
                      </span>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={config.cornerDotColor}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              cornerDotColor: e.target.value,
                            }))
                          }
                          className="w-8 h-8 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={config.cornerDotColor}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              cornerDotColor: e.target.value,
                            }))
                          }
                          className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-white text-xs font-mono w-full uppercase"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: PRINTABLE POSTER & STAND CARD TEMPLATES */}
          {activeTab === "frame" && (
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <LayoutTemplate className="w-4 h-4 text-indigo-400" />
                    Printable Poster & Table-Stand Templates
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Choose from Canva-style printable card templates (viewfinder, payment stands, cafe menus, Wi-Fi signs) and customize all text and colors.
                  </p>
                </div>
              </div>

              {/* Mode Selector: Clean Code vs Framed Card */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setConfig((prev) => ({
                      ...prev,
                      frame: { ...prev.frame, enabled: false },
                    }))
                  }
                  className={`p-4 rounded-xl border text-left transition-all ${
                    !config.frame.enabled
                      ? "bg-indigo-600/15 border-indigo-500 text-white shadow-lg shadow-indigo-600/10"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      Clean QR Code Only
                    </span>
                    {!config.frame.enabled && (
                      <Check className="w-4 h-4 text-indigo-400" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Sirf pure standalone QR code download karein, bina kisi poster frame ya text ke.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setConfig((prev) => ({
                      ...prev,
                      frame: { ...prev.frame, enabled: true },
                    }))
                  }
                  className={`p-4 rounded-xl border text-left transition-all ${
                    config.frame.enabled
                      ? "bg-indigo-600/15 border-indigo-500 text-white shadow-lg shadow-indigo-600/10"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold flex items-center gap-1.5">
                      <LayoutTemplate className="w-3.5 h-3.5 text-indigo-400" />
                      Printable Poster / Stand Template
                    </span>
                    {config.frame.enabled && (
                      <Check className="w-4 h-4 text-indigo-400" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Canva-style printable poster, table tent ya cashier card banayein aur customize karein.
                  </p>
                </button>
              </div>

              {/* Template Customizer (when enabled) */}
              {config.frame.enabled && (
                <div className="space-y-6 pt-3 border-t border-slate-800/80">
                  {/* Ready-to-use Template Gallery */}
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                        <Printer className="w-3.5 h-3.5 text-indigo-400" />
                        Choose a Template Style
                      </label>
                      <span className="text-[10px] text-slate-400">
                        Click any to apply &amp; edit details
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {POSTER_TEMPLATES.map((tpl) => {
                        const isSelected = config.frame.templateId === tpl.id;
                        return (
                          <button
                            key={tpl.id}
                            type="button"
                            onClick={() => applyPosterTemplate(tpl)}
                            className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 relative ${
                              isSelected
                                ? "bg-indigo-950/40 border-indigo-500 ring-1 ring-indigo-500/50"
                                : "bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90"
                            }`}
                          >
                            {/* Visual Thumbnail */}
                            <div
                              className="w-12 h-16 rounded-lg shrink-0 border border-white/20 shadow-md flex flex-col items-center justify-between p-1 text-[8px] font-black"
                              style={{
                                background: tpl.cardBgColor,
                                color: tpl.cardTextColor,
                              }}
                            >
                              <div
                                className="w-full text-center truncate px-0.5 rounded text-[6px]"
                                style={{ background: tpl.accentColor, color: "#fff" }}
                              >
                                {tpl.title.slice(0, 8)}
                              </div>
                              <div className="w-6 h-6 rounded bg-white flex items-center justify-center text-slate-900 font-mono text-[7px] shadow-sm">
                                QR
                              </div>
                              <div className="w-full h-1 rounded-full bg-slate-400/40" />
                            </div>

                            <div className="overflow-hidden flex-1">
                              <div className="flex items-center gap-1.5">
                                <p className="text-xs font-bold text-white truncate">
                                  {tpl.name}
                                </p>
                                <span className="text-[8px] uppercase tracking-wider px-1 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700 shrink-0">
                                  {tpl.category}
                                </span>
                              </div>
                              <p className="text-[11px] text-indigo-300 font-medium truncate mt-0.5">
                                {tpl.title}
                              </p>
                              <p className="text-[10px] text-slate-400 truncate mt-0.5">
                                {tpl.tagline}
                              </p>
                            </div>

                            {isSelected && (
                              <div className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                                <Check className="w-2.5 h-2.5" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Editable Fields Section */}
                  <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Type className="w-3.5 h-3.5 text-indigo-400" />
                        Customize Template Text
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Live preview updates automatically
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Poster Main Headline
                        </label>
                        <input
                          type="text"
                          value={config.frame.text}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              frame: { ...prev.frame, text: e.target.value },
                            }))
                          }
                          placeholder="e.g. SCAN HERE"
                          maxLength={36}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs font-bold focus:outline-none focus:border-indigo-500 uppercase tracking-wider"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Subtitle / Call to Action
                        </label>
                        <input
                          type="text"
                          value={config.frame.subtext}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              frame: { ...prev.frame, subtext: e.target.value },
                            }))
                          }
                          placeholder="e.g. Point your smartphone camera"
                          maxLength={55}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Business / Brand Name Tag
                        </label>
                        <input
                          type="text"
                          value={config.frame.brandName}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              frame: { ...prev.frame, brandName: e.target.value },
                            }))
                          }
                          placeholder="e.g. APEX CAFE &amp; LOUNGE"
                          maxLength={32}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs uppercase tracking-wider focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Footer Note / Instructions
                        </label>
                        <input
                          type="text"
                          value={config.frame.footerNote}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              frame: { ...prev.frame, footerNote: e.target.value },
                            }))
                          }
                          placeholder="e.g. Table #12 • Free Wi-Fi"
                          maxLength={65}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    {/* Interactive Feature Toggles */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() =>
                          setConfig((prev) => ({
                            ...prev,
                            frame: {
                              ...prev.frame,
                              showViewfinder: !prev.frame.showViewfinder,
                            },
                          }))
                        }
                        className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                          config.frame.showViewfinder
                            ? "bg-indigo-950/40 border-indigo-500 text-white"
                            : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Scan className="w-4 h-4 text-indigo-400" />
                          <div>
                            <p className="text-xs font-bold">Viewfinder Brackets [ ]</p>
                            <p className="text-[10px] text-slate-400">Camera scan corners around QR</p>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${config.frame.showViewfinder ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"}`}>
                          {config.frame.showViewfinder ? "ON" : "OFF"}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setConfig((prev) => ({
                            ...prev,
                            frame: {
                              ...prev.frame,
                              showStepsBadge: !prev.frame.showStepsBadge,
                            },
                          }))
                        }
                        className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                          config.frame.showStepsBadge
                            ? "bg-indigo-950/40 border-indigo-500 text-white"
                            : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-indigo-400" />
                          <div>
                            <p className="text-xs font-bold">Scan Steps Guide</p>
                            <p className="text-[10px] text-slate-400">1. Open • 2. Point • 3. Tap</p>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${config.frame.showStepsBadge ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"}`}>
                          {config.frame.showStepsBadge ? "ON" : "OFF"}
                        </span>
                      </button>
                    </div>

                    {/* Poster Color Customization */}
                    <div className="pt-2">
                      <label className="block text-xs font-semibold text-slate-300 mb-2">
                        Poster Card Background Color
                      </label>
                      <div className="flex flex-wrap gap-2 items-center">
                        {[
                          { id: "#ffffff", label: "Clean White" },
                          { id: "#09152b", label: "Deep Navy" },
                          { id: "#042f2e", label: "Cafe Spruce" },
                          { id: "#1e1b4b", label: "Dark Indigo" },
                          { id: "#fff7ed", label: "Warm Peach" },
                          { id: "#18181b", label: "Obsidian" },
                        ].map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() =>
                              setConfig((prev) => ({
                                ...prev,
                                frame: {
                                  ...prev.frame,
                                  cardBgColor: c.id,
                                  cardTextColor: c.id === "#ffffff" || c.id === "#fff7ed" ? "#0f172a" : "#ffffff",
                                },
                              }))
                            }
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                              config.frame.cardBgColor === c.id
                                ? "border-indigo-500 bg-slate-900 text-white"
                                : "border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
                            }`}
                          >
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-white/20"
                              style={{ background: c.id }}
                            />
                            <span>{c.label}</span>
                          </button>
                        ))}

                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-950">
                          <input
                            type="color"
                            value={config.frame.cardBgColor}
                            onChange={(e) =>
                              setConfig((prev) => ({
                                ...prev,
                                frame: { ...prev.frame, cardBgColor: e.target.value },
                              }))
                            }
                            className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
                          />
                          <span className="text-[11px] font-mono text-slate-300">
                            Custom
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Accent Color */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">
                        Accent &amp; Viewfinder Brackets Color
                      </label>
                      <div className="flex flex-wrap gap-2 items-center">
                        {[
                          { id: "#4f46e5", label: "Indigo" },
                          { id: "#0ea5e9", label: "Sky" },
                          { id: "#14b8a6", label: "Teal" },
                          { id: "#e11d48", label: "Rose" },
                          { id: "#d97706", label: "Amber" },
                          { id: "#8b5cf6", label: "Purple" },
                        ].map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() =>
                              setConfig((prev) => ({
                                ...prev,
                                frame: { ...prev.frame, accentColor: c.id },
                              }))
                            }
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                              config.frame.accentColor === c.id
                                ? "border-indigo-500 bg-slate-900 text-white"
                                : "border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
                            }`}
                          >
                            <span
                              className="w-3.5 h-3.5 rounded-full"
                              style={{ background: c.id }}
                            />
                            <span>{c.label}</span>
                          </button>
                        ))}

                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-950">
                          <input
                            type="color"
                            value={config.frame.accentColor}
                            onChange={(e) =>
                              setConfig((prev) => ({
                                ...prev,
                                frame: { ...prev.frame, accentColor: e.target.value },
                              }))
                            }
                            className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
                          />
                          <span className="text-[11px] font-mono text-slate-300">
                            Custom
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: THEMES & PRESETS (35 Presets: 7 per Category) */}
          {activeTab === "presets" && (
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    35 Curated Designer Themes
                  </h3>
                  <p className="text-xs text-slate-400">
                    5 distinct categories with 7 high-contrast, scan-guaranteed presets each.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setConfig((prev) => ({
                      ...prev,
                      dotType: "rounded",
                      cornerSquareType: "extra-rounded",
                      cornerDotType: "dot",
                      colorType: "gradient",
                      dotsColor: "#4f46e5",
                      gradientColor1: "#4f46e5",
                      gradientColor2: "#9333ea",
                      gradientType: "linear",
                      bgColor: "#ffffff",
                      isTransparentBg: false,
                      customEyeColor: true,
                      cornerSquareColor: "#4338ca",
                      cornerDotColor: "#7e22ce",
                    }))
                  }
                  className="self-start sm:self-auto text-[11px] font-semibold text-slate-400 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-800 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  Reset to Default
                </button>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-slate-950/80 border border-slate-800">
                {[
                  { id: "all", label: "All Themes (35)" },
                  { id: "vibrant", label: "🌟 Vibrant (7)" },
                  { id: "corporate", label: "💼 Corporate (7)" },
                  { id: "social", label: "🏷️ Social (7)" },
                  { id: "pastel", label: "🌿 Soft Pastel (7)" },
                  { id: "dark", label: "🕶️ Dark & Cyber (7)" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id as any)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                      selectedCategory === cat.id
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Filtered Presets Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {QR_PRESETS.filter(
                  (p) => selectedCategory === "all" || p.category === selectedCategory
                ).map((preset) => {
                  const isCurrent =
                    config.colorType === preset.colorType &&
                    (preset.colorType === "gradient"
                      ? config.gradientColor1 === preset.gradientColor1 &&
                        config.gradientColor2 === preset.gradientColor2
                      : config.dotsColor === preset.dotsColor) &&
                    config.bgColor === preset.bgColor;

                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => applyPreset(preset)}
                      className={`p-3.5 rounded-xl border transition-all text-left group flex items-start gap-3 relative ${
                        isCurrent
                          ? "border-indigo-500 bg-indigo-950/30 ring-1 ring-indigo-500/40"
                          : "border-slate-800 bg-slate-950/70 hover:border-slate-700 hover:bg-slate-900/90"
                      }`}
                    >
                      <div
                        className="w-12 h-12 rounded-xl shrink-0 border border-white/20 shadow-md flex items-center justify-center font-black text-xs transition-transform group-hover:scale-105"
                        style={{
                          background:
                            preset.colorType === "gradient"
                              ? `linear-gradient(135deg, ${preset.gradientColor1}, ${preset.gradientColor2})`
                              : preset.dotsColor,
                          color: preset.bgColor === "#ffffff" ? "#ffffff" : "#ffffff",
                          textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                        }}
                      >
                        QR
                      </div>
                      <div className="overflow-hidden flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors truncate">
                            {preset.name}
                          </p>
                          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-slate-800/80 text-slate-400 border border-slate-700 shrink-0">
                            {preset.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-1">
                          {preset.description}
                        </p>
                      </div>
                      {isCurrent && (
                        <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Preview & Download Studio (order-1 on mobile so it's always seen first, order-2 on desktop) */}
        <div id="preview-section" className="order-1 lg:order-2 lg:col-span-5 lg:sticky lg:top-24 space-y-4">
          {/* Main Card */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-2xl shadow-2xl shadow-indigo-950/20 text-center">
            {/* Header / Badges */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Live Scanner Preview
              </span>
              <button
                type="button"
                onClick={() => setShowScanModal(true)}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Simulate Phone Scan</span>
              </button>
            </div>

            {/* QR Canvas Render Container (with Full Poster Preview when enabled) */}
            <div
              className={`relative mx-auto rounded-3xl transition-all duration-300 shadow-2xl flex flex-col items-center border ${
                config.frame.enabled
                  ? "p-6"
                  : "p-5 bg-gradient-to-b from-slate-950 to-slate-900 border-slate-800 shadow-inner group"
              }`}
              style={
                config.frame.enabled
                  ? {
                      background: config.frame.cardBgColor,
                      color: config.frame.cardTextColor,
                      borderColor:
                        config.frame.cardTextColor === "#ffffff"
                          ? "rgba(255,255,255,0.15)"
                          : "rgba(0,0,0,0.12)",
                    }
                  : undefined
              }
            >
              {/* Poster Header (Brand Tag, Headline, Subtitle) */}
              {config.frame.enabled && (
                <div className="w-full text-center mb-3">
                  {config.frame.brandName && (
                    <p
                      className="text-[10px] font-extrabold uppercase tracking-widest mb-1"
                      style={{ color: config.frame.accentColor }}
                    >
                      {config.frame.brandName}
                    </p>
                  )}
                  <h3 className="text-lg font-black uppercase tracking-wider leading-tight mb-1">
                    {config.frame.text || "SCAN HERE"}
                  </h3>
                  {config.frame.subtext && (
                    <p className="text-[11px] opacity-80 font-medium max-w-[280px] mx-auto">
                      {config.frame.subtext}
                    </p>
                  )}
                </div>
              )}

              {/* QR Code Container with Camera Viewfinder Brackets */}
              <div
                className={`relative transition-all ${
                  config.frame.enabled
                    ? "p-3 rounded-2xl bg-white shadow-lg my-1"
                    : ""
                }`}
              >
                {config.frame.enabled && config.frame.showViewfinder && (
                  <>
                    {/* Top-Left Viewfinder Bracket */}
                    <div
                      className="absolute -top-2.5 -left-2.5 w-6 h-6 border-t-[4px] border-l-[4px] rounded-tl-lg pointer-events-none"
                      style={{ borderColor: config.frame.accentColor }}
                    />
                    {/* Top-Right Viewfinder Bracket */}
                    <div
                      className="absolute -top-2.5 -right-2.5 w-6 h-6 border-t-[4px] border-r-[4px] rounded-tr-lg pointer-events-none"
                      style={{ borderColor: config.frame.accentColor }}
                    />
                    {/* Bottom-Left Viewfinder Bracket */}
                    <div
                      className="absolute -bottom-2.5 -left-2.5 w-6 h-6 border-b-[4px] border-l-[4px] rounded-bl-lg pointer-events-none"
                      style={{ borderColor: config.frame.accentColor }}
                    />
                    {/* Bottom-Right Viewfinder Bracket */}
                    <div
                      className="absolute -bottom-2.5 -right-2.5 w-6 h-6 border-b-[4px] border-r-[4px] rounded-br-lg pointer-events-none"
                      style={{ borderColor: config.frame.accentColor }}
                    />
                  </>
                )}

                <div
                  ref={qrContainerRef}
                  className="flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>

              {/* Poster Footer (Steps Guide & Footer Note) */}
              {config.frame.enabled && (
                <div className="w-full text-center mt-3">
                  {config.frame.showStepsBadge && (
                    <div
                      className="py-1.5 px-3 rounded-full text-[10px] font-bold text-white shadow-md flex items-center justify-center gap-1.5 max-w-[280px] mx-auto"
                      style={{ background: config.frame.accentColor }}
                    >
                      <span>1. Open Camera</span>
                      <span>•</span>
                      <span>2. Point at QR</span>
                      <span>•</span>
                      <span>3. Tap Link</span>
                    </div>
                  )}

                  {config.frame.footerNote && (
                    <p className="mt-2 text-[10px] opacity-75 font-medium max-w-[280px] mx-auto">
                      {config.frame.footerNote}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Quick Action Buttons & 1-Tap Styles (lg:hidden) */}
            <div className="lg:hidden w-full mt-4 space-y-3 pt-3 border-t border-slate-800/80">
              {/* 1-Tap Download & Native Share */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => downloadQR("png")}
                  className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PNG</span>
                </button>
                <button
                  type="button"
                  onClick={shareQR}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs border border-slate-700 flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                >
                  <Share2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Share QR</span>
                </button>
              </div>

              {/* Instant 1-Tap Quick Themes Strip (Mobile) */}
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80 text-left">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    Instant 1-Tap Styles:
                  </span>
                  <span className="text-[9px] text-slate-500">Fast transform</span>
                </div>
                <div className="flex items-center justify-between gap-1.5">
                  {quickMobileStyles.map((qs) => (
                    <button
                      key={qs.id}
                      type="button"
                      onClick={() =>
                        setConfig((prev) => ({
                          ...prev,
                          dotType: qs.dotType,
                          cornerSquareType: qs.cornerSquareType,
                          cornerDotType: qs.cornerDotType,
                          colorType: qs.colorType,
                          gradientColor1: qs.gradientColor1,
                          gradientColor2: qs.gradientColor2,
                          dotsColor: qs.dotsColor,
                          cornerSquareColor: qs.cornerSquareColor,
                          cornerDotColor: qs.cornerDotColor,
                          bgColor: qs.bgColor,
                          isTransparentBg: false,
                        }))
                      }
                      className="flex-1 flex flex-col items-center gap-1 py-1.5 px-1 rounded-lg bg-slate-900/60 hover:bg-slate-800 border border-slate-800/60 active:scale-95 transition-transform"
                    >
                      <div
                        className="w-5 h-5 rounded-full shadow-md border border-white/20"
                        style={{
                          background: `linear-gradient(135deg, ${qs.gradientColor1}, ${qs.gradientColor2})`,
                        }}
                      />
                      <span className="text-[9px] font-semibold text-slate-300 truncate max-w-[50px]">
                        {qs.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Real Hardware In-Browser QR Decoder Verification */}
            <div
              className={`mt-5 p-3.5 rounded-2xl border text-left transition-all ${
                decoderResult.isScannable && decoderResult.match
                  ? "bg-emerald-950/40 border-emerald-500/40"
                  : "bg-rose-950/40 border-rose-500/50"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      decoderResult.isScannable ? "bg-emerald-400 animate-pulse" : "bg-rose-400 animate-ping"
                    }`}
                  />
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Scan className="w-3.5 h-3.5 text-emerald-400" />
                    Computer-Vision Scan Verification:
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  {decoderResult.latencyMs}ms latency
                </span>
              </div>

              {decoderResult.isScannable ? (
                <div className="space-y-1">
                  <p className="text-[11px] font-medium text-emerald-300">
                    ✅ 100% Genuine Read Verified. Tested via client-side computer-vision decoder. Scannable on all iOS &amp; Android cameras.
                  </p>
                  {decoderResult.decodedData && (
                    <div className="p-1.5 rounded-lg bg-slate-950/90 border border-emerald-900/40 text-[10px] font-mono text-slate-300 truncate">
                      <span className="text-emerald-400 font-bold">Decoded:</span> {decoderResult.decodedData}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-1.5">
                  <p className="text-[11px] font-bold text-rose-300 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>Scan Warning: Decoder could not parse QR bitmap.</span>
                  </p>
                  <p className="text-[10px] text-rose-200/90 leading-relaxed">
                    {decoderResult.reason}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      setConfig((prev) => ({
                        ...prev,
                        logoSize: 0.25,
                        errorCorrectionLevel: "H",
                        bgColor: "#ffffff",
                        isTransparentBg: false,
                        dotsColor: "#0f172a",
                        colorType: "single",
                      }))
                    }
                    className="mt-1 px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold transition-colors"
                  >
                    Auto-Optimize For 100% Scannability
                  </button>
                </div>
              )}

              {/* 100% Client-Side Privacy Verification Stamp */}
              <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                <span className="flex items-center gap-1 text-slate-300">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  Client-Side Private Memory (0 bytes uploaded)
                </span>
                <span className="text-[9px] font-mono text-emerald-400 font-bold">
                  VERIFIED LOCAL
                </span>
              </div>
            </div>

            {/* Scannability Health Bar */}
            <div className="mt-3 p-3.5 rounded-xl border bg-slate-950/70 border-slate-800 text-left">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck
                    className={`w-4 h-4 ${
                      scannability.rating === "Excellent" || scannability.rating === "Good"
                        ? "text-emerald-400"
                        : "text-amber-400"
                    }`}
                  />
                  <span className="text-xs font-bold text-white">Optical Contrast Ratio:</span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded border ${scannability.colorClass}`}
                  >
                    {scannability.rating} ({scannability.score}/100)
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  {scannability.contrastRatio}:1
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden mb-2">
                <div
                  className={`h-full transition-all duration-500 ${
                    scannability.score >= 80
                      ? "bg-emerald-500"
                      : scannability.score >= 60
                      ? "bg-blue-500"
                      : scannability.score >= 40
                      ? "bg-amber-500"
                      : "bg-rose-500"
                  }`}
                  style={{ width: `${scannability.score}%` }}
                />
              </div>

              {scannability.recommendations.length > 0 ? (
                <div className="space-y-1">
                  {scannability.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px] text-amber-300">
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-slate-400">
                  Contrast ratio and error-correction meet top optical scanning standards.
                </p>
              )}
            </div>

            {/* Resolution Selector */}
            <div className="mt-5 flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <span className="text-slate-300 font-medium">Export Resolution:</span>
              <div className="flex items-center gap-1">
                {[
                  { res: 512, label: "512px Web" },
                  { res: 1024, label: "1024px HD" },
                  { res: 2048, label: "2048px Print" },
                ].map((item) => (
                  <button
                    key={item.res}
                    type="button"
                    onClick={() => setExportRes(item.res)}
                    className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                      exportRes === item.res
                        ? "bg-indigo-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 space-y-2.5">
              <button
                type="button"
                onClick={() => downloadQR("png")}
                disabled={isDownloading}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:from-indigo-600 hover:via-purple-700 hover:to-pink-700 text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{isDownloading ? "Generating High-Res..." : "Download High-Res PNG"}</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => downloadQR("svg")}
                  disabled={isDownloading}
                  className="py-2.5 px-3 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Download SVG</span>
                </button>

                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="py-2.5 px-3 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied Image!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy to Clipboard</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* APP-LIKE MOBILE STICKY BOTTOM BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 px-4 py-2.5 shadow-[0_-10px_30px_rgba(0,0,0,0.7)]">
        <div className="max-w-md mx-auto flex items-center justify-between gap-2.5">
          {/* Quick status & Jump to preview */}
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("preview-section");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-left active:scale-95 transition-transform shrink-0"
          >
            <div
              className={`w-2 h-2 rounded-full ${
                decoderResult.isScannable ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
              }`}
            />
            <div>
              <div className="text-[10px] font-bold text-white leading-tight">
                {decoderResult.isScannable ? "100% Scannable" : "Adjust Contrast"}
              </div>
              <div className="text-[9px] text-indigo-400 leading-tight">Tap to view QR</div>
            </div>
          </button>

          {/* Quick Share & Download actions */}
          <div className="flex items-center gap-2 flex-1 justify-end">
            <button
              type="button"
              onClick={shareQR}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 active:scale-95 transition-transform flex items-center justify-center shrink-0"
              title="Share QR code"
              aria-label="Share QR code"
            >
              <Share2 className="w-4 h-4 text-slate-300" />
            </button>

            <button
              type="button"
              onClick={() => downloadQR("png")}
              className="flex-1 py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>

      {/* SCAN SIMULATOR MODAL */}
      {showScanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-center space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Eye className="w-4 h-4 text-indigo-400" />
                <span>Phone Camera Viewfinder Simulation</span>
              </div>
              <button
                type="button"
                onClick={() => setShowScanModal(false)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            {/* Camera Viewfinder graphics */}
            <div className="relative w-56 h-56 mx-auto rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden shadow-inner">
              {/* Corner brackets */}
              <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-indigo-400" />
              <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-indigo-400" />
              <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-indigo-400" />
              <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-indigo-400" />

              {/* Scanning Laser Line */}
              <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] animate-pulse" />

              <div className="text-center p-4">
                <Check className="w-8 h-8 text-emerald-400 mx-auto mb-1 animate-bounce" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Target Detected
                </span>
              </div>
            </div>

            {/* Decoded content payload banner */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-left">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Decoded Action & Payload
              </span>
              <p className="text-xs font-mono text-indigo-300 break-all bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                {qrData}
              </p>
            </div>

            <div className="flex gap-2">
              {config.contentType === "url" && (
                <a
                  href={qrData}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open URL in New Tab</span>
                </a>
              )}
              <button
                type="button"
                onClick={() => setShowScanModal(false)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
              >
                Close Simulator
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QRStudio;
