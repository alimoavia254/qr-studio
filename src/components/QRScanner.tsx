"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Camera, CameraOff, Download, Copy, Check, ExternalLink, ImageUp, AlertTriangle, X } from "lucide-react";

/** Everything stays in the browser: frames are decoded locally with jsQR and never uploaded. */

interface Described {
  kind: string;
  /** Web link: shown with a scam warning */
  link: string | null;
  host: string | null;
  /** Opens a phone app (dialer, messages, maps, mail) */
  action: { label: string; href: string } | null;
  /** Saves the content as a file (calendar event, contact card) */
  file: { label: string; name: string; mime: string } | null;
}

function describe(data: string): Described {
  const t = data.trim();
  const base: Described = { kind: "Text", link: null, host: null, action: null, file: null };
  if (/^https?:\/\//i.test(t)) {
    try {
      return { ...base, kind: "Website link", link: t, host: new URL(t).hostname };
    } catch {
      return { ...base, kind: "Website link" };
    }
  }
  if (/^WIFI:/i.test(t)) return { ...base, kind: "Wi-Fi network" };
  if (/^BEGIN:VCARD/i.test(t))
    return { ...base, kind: "Contact card", file: { label: "Save contact", name: "contact.vcf", mime: "text/vcard" } };
  if (/^BEGIN:VCALENDAR/i.test(t))
    return { ...base, kind: "Calendar event", file: { label: "Add to calendar", name: "event.ics", mime: "text/calendar" } };
  if (/^mailto:/i.test(t)) return { ...base, kind: "Email", action: { label: "Write email", href: t } };
  if (/^MATMSG:/i.test(t)) {
    const to = /TO:([^;]*)/i.exec(t)?.[1];
    return { ...base, kind: "Email", action: to ? { label: "Write email", href: `mailto:${to}` } : null };
  }
  if (/^tel:/i.test(t)) return { ...base, kind: "Phone number", action: { label: "Call", href: t } };
  if (/^sms(?:to)?:/i.test(t)) {
    const m = /^sms(?:to)?:([^:?]*)[:?]?(.*)$/i.exec(t);
    const body = m?.[2] ? `?body=${encodeURIComponent(m[2].replace(/^body=/i, ""))}` : "";
    return { ...base, kind: "Text message", action: m ? { label: "Send message", href: `sms:${m[1]}${body}` } : null };
  }
  const geo = /^geo:(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/i.exec(t);
  if (geo) return { ...base, kind: "Location", action: { label: "Open in Maps", href: `https://www.google.com/maps?q=${geo[1]},${geo[2]}` } };
  if (/^(bitcoin|ethereum|litecoin|dogecoin):/i.test(t)) return { ...base, kind: "Crypto address" };
  return base;
}

export function QRScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const [camOn, setCamOn] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [dragging, setDragging] = useState(false);

  const stopCamera = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCamOn(false);
  }, []);

  useEffect(() => stopCamera, [stopCamera]);

  const decodeImageData = async (img: ImageData) => {
    const { default: jsQR } = await import("jsqr");
    return jsQR(img.data, img.width, img.height, { inversionAttempts: "attemptBoth" });
  };

  const scanFile = async (file: File) => {
    setError(null);
    setResult(null);
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file (PNG, JPG, WebP).");
      return;
    }
    try {
      const bmp = await createImageBitmap(file);
      // Big photos are scaled down: faster, and QR codes still decode fine
      const scale = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(bmp.width * scale);
      canvas.height = Math.round(bmp.height * scale);
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) throw new Error("no canvas");
      ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
      bmp.close();
      const code = await decodeImageData(ctx.getImageData(0, 0, canvas.width, canvas.height));
      if (code?.data) {
        stopCamera();
        setResult(code.data);
      } else {
        setResult(null);
        setError("No QR code found in this image. Try a sharper, closer photo.");
      }
    } catch {
      setError("Couldn't read this image.");
    }
  };

  const startCamera = async () => {
    setError(null);
    setResult(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Camera isn't available in this browser. Upload a photo of the QR code instead.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 } },
        audio: false,
      });
      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) return;
      video.srcObject = stream;
      await video.play();
      setCamOn(true);

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      let last = 0;
      const tick = async (now: number) => {
        if (!streamRef.current) return;
        if (now - last > 160 && video.videoWidth) {
          last = now;
          const scale = Math.min(1, 800 / video.videoWidth);
          canvas.width = Math.round(video.videoWidth * scale);
          canvas.height = Math.round(video.videoHeight * scale);
          ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
          const code = ctx ? await decodeImageData(ctx.getImageData(0, 0, canvas.width, canvas.height)) : null;
          if (code?.data) {
            setResult(code.data);
            stopCamera();
            return;
          }
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch (err) {
      stopCamera();
      const denied = (err as DOMException)?.name === "NotAllowedError";
      setError(
        denied
          ? "Camera permission was blocked. Allow it in your browser settings, or upload a photo instead."
          : "Couldn't start the camera. Upload a photo of the QR code instead."
      );
    }
  };

  const info = result ? describe(result) : null;

  const copy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Couldn't copy in this browser.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="rounded-3xl bg-slate-900/70 border border-slate-800 p-4 sm:p-6 space-y-4">
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 grid place-items-center">
          <video ref={videoRef} playsInline muted className={`w-full h-full object-cover ${camOn ? "" : "hidden"}`} />
          {camOn && (
            <span className="pointer-events-none absolute inset-[18%] rounded-2xl border-2 border-dashed border-indigo-400/80" />
          )}
          {!camOn && (
            <div className="text-center text-slate-500 px-6">
              <Camera className="w-10 h-10 mx-auto mb-2 opacity-60" />
              <p className="text-sm">Start the camera or upload a photo of a QR code</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {camOn ? (
            <button
              type="button"
              onClick={stopCamera}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-sm font-bold"
            >
              <CameraOff className="w-4 h-4" />
              Stop camera
            </button>
          ) : (
            <button
              type="button"
              onClick={startCamera}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold"
            >
              <Camera className="w-4 h-4" />
              Start camera
            </button>
          )}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              const f = e.dataTransfer.files?.[0];
              if (f) scanFile(f);
            }}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-bold ${
              dragging
                ? "bg-indigo-600/20 border-indigo-500 text-white"
                : "bg-slate-800 hover:bg-slate-700 border-slate-700 text-white"
            }`}
          >
            <ImageUp className="w-4 h-4" />
            Upload image
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) scanFile(f);
              e.target.value = "";
            }}
          />
        </div>

        {error && (
          <p className="flex items-start gap-2 text-sm text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-xl p-3" role="alert">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            {error}
          </p>
        )}

        {result && info && (
          <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-4 space-y-3" aria-live="polite">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">{info.kind}</span>
              <button
                type="button"
                onClick={() => setResult(null)}
                aria-label="Clear result"
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="font-mono text-sm text-white break-all whitespace-pre-wrap max-h-48 overflow-auto">{result}</p>
            {info.link && (
              <p className="text-xs text-amber-200/90">
                This opens <strong>{info.host}</strong>. Only continue if you trust that site: fake QR codes are used for
                scams.
              </p>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={copy}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-sm font-semibold"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied" : "Copy"}
              </button>
              {info.action && (
                <a
                  href={info.action.href}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold"
                >
                  {info.action.label}
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {info.file && (
                <button
                  type="button"
                  onClick={() => {
                    const a = document.createElement("a");
                    a.href = URL.createObjectURL(new Blob([result], { type: info.file!.mime }));
                    a.download = info.file!.name;
                    a.click();
                    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold"
                >
                  {info.file.label}
                  <Download className="w-4 h-4" />
                </button>
              )}
              {info.link && (
                <a
                  href={info.link}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold"
                >
                  Open link
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default QRScanner;
