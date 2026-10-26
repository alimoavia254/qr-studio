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
} from "lucide-react";
import { QRDesignConfig, QRContentType } from "@/types/qr";
import { formatQRData } from "@/lib/qrDataFormatters";
import { evaluateScannability } from "@/lib/colorUtils";
import { QR_PRESETS, SAMPLE_LOGOS } from "@/lib/qrPresets";
import type {
  DotType,
  CornerSquareType,
  CornerDotType,
  ErrorCorrectionLevel,
} from "qr-code-styling";

const INITIAL_CONFIG: QRDesignConfig = {
  contentType: "url",
  url: "https://mybrand.com",
  text: "Hello from QR Studio!",
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
    company: "Apex Studio",
    title: "Creative Director",
    website: "https://apexstudio.com",
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
};

export function QRStudio() {
  const [config, setConfig] = useState<QRDesignConfig>(INITIAL_CONFIG);
  const [exportRes, setExportRes] = useState<number>(1024);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"content" | "logo" | "style" | "presets">("content");
  const [showScanModal, setShowScanModal] = useState<boolean>(false);
  const [wifiShowPass, setWifiShowPass] = useState<boolean>(false);

  const qrContainerRef = useRef<HTMLDivElement>(null);
  const qrCodeInstanceRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // High-Resolution Export
  const downloadQR = async (format: "png" | "svg" | "jpeg") => {
    if (typeof window === "undefined") return;
    setIsDownloading(true);

    try {
      const { default: QRCodeStyling } = await import("qr-code-styling");
      const highResOptions = getQROptions(exportRes);
      const exporter = new QRCodeStyling(highResOptions);

      await exporter.download({
        name: `qr-studio-${config.contentType}-${exportRes}px`,
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

  const contentTypes: { id: QRContentType; label: string; icon: React.ElementType }[] = [
    { id: "url", label: "Website URL", icon: Globe },
    { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
    { id: "wifi", label: "Wi-Fi", icon: Wifi },
    { id: "vcard", label: "vCard Card", icon: Contact },
    { id: "email", label: "Email", icon: Mail },
    { id: "text", label: "Plain Text", icon: FileText },
  ];

  return (
    <div id="generator" className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Studio Top Hero Subtitle */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold mb-3 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Interactive Brand QR Studio</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Create Beautiful,{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Scannable Brand QR Codes
          </span>
        </h1>
        <p className="mt-3 text-slate-400 text-sm sm:text-base">
          Embed your logo, style dots and gradients, and verify instant scannability before downloading in ultra-high resolution.
        </p>
      </div>

      {/* Main Grid: Left Controls / Right Sticky Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Studio Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Navigation Tabs */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl">
            <button
              type="button"
              onClick={() => setActiveTab("content")}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
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
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 relative ${
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
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
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
              onClick={() => setActiveTab("presets")}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "presets"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Themes</span>
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

              {/* Upload Drop Area */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/svg+xml, image/webp"
                onChange={handleLogoUpload}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-950/40 hover:bg-slate-950/80 group"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-white">Click to browse your brand logo</p>
                <p className="text-xs text-slate-400 mt-1">
                  Supports PNG, SVG, JPG or WebP (Recommended: Square with transparent background)
                </p>
              </div>

              {/* Instant Sample Logos */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Or Test Instantly With Brand Icons
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
                    <div className="flex justify-between text-xs font-medium text-slate-300 mb-1.5">
                      <span>Logo Scale</span>
                      <span>{Math.round(config.logoSize * 100)}%</span>
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
                    <p className="text-[11px] text-slate-400 mt-1">
                      Max 35% recommended to keep error correction comfortable.
                    </p>
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
                    <span>Clean badge: clear dots behind the logo</span>
                  </label>
                </div>
              )}

              {/* Error correction reassurance */}
              <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">High Scannability Protection</span>
                  <p className="text-slate-300 mt-0.5">
                    When a logo is present, QR Studio automatically activates Level-H error correction
                    (30% redundancy), ensuring your code scans flawlessly even with a centered emblem.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STYLING & COLORS */}
          {activeTab === "style" && (
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-6">
              {/* Dot Patterns */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
                  Dot Pattern Style
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[
                    { id: "rounded", label: "Rounded" },
                    { id: "dots", label: "Circular" },
                    { id: "classy", label: "Classy" },
                    { id: "classy-rounded", label: "Classy Curve" },
                    { id: "square", label: "Square" },
                    { id: "extra-rounded", label: "Smooth" },
                  ].map((dot) => (
                    <button
                      key={dot.id}
                      type="button"
                      onClick={() =>
                        setConfig((prev) => ({ ...prev, dotType: dot.id as DotType }))
                      }
                      className={`p-2.5 rounded-xl border text-center text-xs font-medium transition-all ${
                        config.dotType === dot.id
                          ? "bg-indigo-600/20 border-indigo-500 text-white font-bold"
                          : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {dot.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Corner Styles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Corner Frame (Outer Eye)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "extra-rounded", label: "Curved" },
                      { id: "dot", label: "Pill" },
                      { id: "square", label: "Square" },
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
                        className={`p-2 rounded-lg border text-center text-xs transition-colors ${
                          config.cornerSquareType === c.id
                            ? "bg-indigo-600/20 border-indigo-500 text-white font-bold"
                            : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Corner Dot (Inner Eye)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "dot", label: "Dot" },
                      { id: "square", label: "Square" },
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
                        className={`p-2 rounded-lg border text-center text-xs transition-colors ${
                          config.cornerDotType === c.id
                            ? "bg-indigo-600/20 border-indigo-500 text-white font-bold"
                            : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Color Controls */}
              <div className="pt-4 border-t border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    QR Color Palette
                  </label>
                  <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
                    <button
                      type="button"
                      onClick={() => setConfig((prev) => ({ ...prev, colorType: "single" }))}
                      className={`px-2.5 py-1 rounded ${
                        config.colorType === "single"
                          ? "bg-indigo-600 text-white font-semibold"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Solid
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfig((prev) => ({ ...prev, colorType: "gradient" }))}
                      className={`px-2.5 py-1 rounded ${
                        config.colorType === "gradient"
                          ? "bg-indigo-600 text-white font-semibold"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Gradient
                    </button>
                  </div>
                </div>

                {config.colorType === "single" ? (
                  <div className="flex items-center gap-3">
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
                      className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono w-28 uppercase"
                    />
                    <span className="text-xs text-slate-400">Dot and frame color</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="block text-[11px] text-slate-400 mb-1">Color 1 (Start)</span>
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
                            className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-mono w-full uppercase"
                          />
                        </div>
                      </div>

                      <div>
                        <span className="block text-[11px] text-slate-400 mb-1">Color 2 (End)</span>
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
                            className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-mono w-full uppercase"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Gradient Angle */}
                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1">
                        <span>Gradient Angle</span>
                        <span>{config.gradientRotation}°</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={360}
                        step={15}
                        value={config.gradientRotation}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            gradientRotation: parseInt(e.target.value, 10),
                          }))
                        }
                        className="w-full accent-indigo-500 cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Background Color */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Background
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      disabled={config.isTransparentBg}
                      value={config.bgColor}
                      onChange={(e) =>
                        setConfig((prev) => ({ ...prev, bgColor: e.target.value }))
                      }
                      className="w-9 h-9 rounded-lg cursor-pointer disabled:opacity-30"
                    />
                    <input
                      type="text"
                      disabled={config.isTransparentBg}
                      value={config.bgColor}
                      onChange={(e) =>
                        setConfig((prev) => ({ ...prev, bgColor: e.target.value }))
                      }
                      className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-mono w-28 uppercase disabled:opacity-30"
                    />
                  </div>

                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
                    <input
                      type="checkbox"
                      checked={config.isTransparentBg}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          isTransparentBg: e.target.checked,
                        }))
                      }
                      className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-0"
                    />
                    <span>Transparent Background (PNG/SVG)</span>
                  </label>
                </div>
              </div>

              {/* Custom Eye Colors */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider cursor-pointer">
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
                  <span>Independent Eye Colors</span>
                </label>

                {config.customEyeColor && (
                  <div className="grid grid-cols-2 gap-4 pt-1">
                    <div>
                      <span className="block text-[11px] text-slate-400 mb-1">Outer Eye Frame</span>
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
                          className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-white text-xs font-mono w-full uppercase"
                        />
                      </div>
                    </div>

                    <div>
                      <span className="block text-[11px] text-slate-400 mb-1">Inner Eye Center</span>
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
                          className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-white text-xs font-mono w-full uppercase"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: THEMES & PRESETS */}
          {activeTab === "presets" && (
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white">Curated Aesthetic Presets</h3>
                <p className="text-xs text-slate-400">
                  Instant harmonious color palettes designed for maximum scan success.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {QR_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 hover:border-indigo-500 hover:bg-slate-900/90 transition-all text-left group flex items-start gap-3"
                  >
                    <div
                      className="w-10 h-10 rounded-lg shrink-0 border border-white/20 shadow-inner flex items-center justify-center font-bold text-xs"
                      style={{
                        background:
                          preset.colorType === "gradient"
                            ? `linear-gradient(135deg, ${preset.gradientColor1}, ${preset.gradientColor2})`
                            : preset.dotsColor,
                        color: preset.bgColor === "#ffffff" ? "#000" : "#fff",
                      }}
                    >
                      QR
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">
                        {preset.name}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {preset.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (5 cols): Sticky Live Preview & Download Studio */}
        <div className="lg:col-span-5 sticky top-24 space-y-5">
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

            {/* QR Canvas Render Container */}
            <div className="relative mx-auto flex items-center justify-center p-5 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800 shadow-inner group">
              <div
                ref={qrContainerRef}
                className="flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </div>

            {/* Scannability Health Bar */}
            <div className="mt-5 p-3.5 rounded-xl border bg-slate-950/70 border-slate-800 text-left">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck
                    className={`w-4 h-4 ${
                      scannability.rating === "Excellent" || scannability.rating === "Good"
                        ? "text-emerald-400"
                        : "text-amber-400"
                    }`}
                  />
                  <span className="text-xs font-bold text-white">Scannability Health:</span>
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
