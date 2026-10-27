"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Download, FileUp, Loader2, Trash2, ImageIcon } from "lucide-react";
import type { QRPreset } from "@/types/qr";
import type { Options } from "qr-code-styling";
import { QR_PRESETS } from "@/lib/qrPresets";
import { createZip } from "@/lib/zip";

const MAX_ROWS = 200;

type Mode = "links" | "text";
type Format = "png" | "svg";

const inputCls =
  "w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-base sm:text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors";

interface Row {
  name: string;
  data: string;
}

function parseRows(raw: string, hasNames: boolean, mode: Mode): Row[] {
  const rows: Row[] = [];
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim();
    if (!t) continue;
    let name = "";
    let data = t;
    if (hasNames) {
      const i = t.indexOf(",");
      if (i === -1) continue;
      name = t.slice(0, i).trim().replace(/^"|"$/g, "");
      data = t.slice(i + 1).trim().replace(/^"|"$/g, "");
    }
    if (!data) continue;
    if (mode === "links" && !/^[a-z][a-z0-9+.-]*:/i.test(data)) data = `https://${data}`;
    rows.push({ name, data });
  }
  return rows;
}

const safeName = (s: string) =>
  s
    .toLowerCase()
    .replace(/https?:\/\//, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);

function buildOptions(p: QRPreset, data: string, size: number, type: "canvas" | "svg", logo: string | null): Options {
  const gradient = p.colorType === "gradient";
  return {
    width: size,
    height: size,
    type,
    data,
    image: logo || undefined,
    margin: Math.round(size * 0.05),
    qrOptions: { typeNumber: 0, mode: "Byte", errorCorrectionLevel: logo ? "H" : "Q" },
    imageOptions: { hideBackgroundDots: false, imageSize: 0.25, margin: 6, crossOrigin: "anonymous" },
    dotsOptions: {
      type: p.dotType,
      color: gradient ? undefined : p.dotsColor,
      gradient: gradient
        ? {
            type: p.gradientType,
            rotation: Math.PI / 4,
            colorStops: [
              { offset: 0, color: p.gradientColor1 },
              { offset: 1, color: p.gradientColor2 },
            ],
          }
        : undefined,
    },
    cornersSquareOptions: {
      type: p.cornerSquareType,
      color: p.customEyeColor ? p.cornerSquareColor : gradient ? p.gradientColor1 : p.dotsColor,
    },
    cornersDotOptions: {
      type: p.cornerDotType,
      color: p.customEyeColor ? p.cornerDotColor : gradient ? p.gradientColor2 : p.dotsColor,
    },
    backgroundOptions: { color: p.bgColor },
  };
}

export function BulkGenerator() {
  const [raw, setRaw] = useState("https://example.com/table-1\nhttps://example.com/table-2\nhttps://example.com/table-3");
  const [hasNames, setHasNames] = useState(false);
  const [mode, setMode] = useState<Mode>("links");
  const [presetId, setPresetId] = useState("swiss-clean");
  const [size, setSize] = useState(1024);
  const [format, setFormat] = useState<Format>("png");
  const [logo, setLogo] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const csvRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const sampleRef = useRef<HTMLDivElement>(null);

  const preset = QR_PRESETS.find((p) => p.id === presetId) ?? QR_PRESETS[0];
  const allRows = useMemo(() => parseRows(raw, hasNames, mode), [raw, hasNames, mode]);
  const rows = allRows.slice(0, MAX_ROWS);
  const first = rows[0]?.data;

  // Live sample of the first row so the style can be checked before generating
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      const el = sampleRef.current;
      if (!el || !first) return;
      const { default: QRCodeStyling } = await import("qr-code-styling");
      if (cancelled) return;
      const qr = new QRCodeStyling(buildOptions(preset, first, 220, "canvas", logo));
      el.innerHTML = "";
      qr.append(el);
    }, 150);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [preset, first, logo]);

  const readFile = (file: File, onText: (t: string) => void) => {
    const reader = new FileReader();
    reader.onload = () => onText(String(reader.result ?? ""));
    reader.readAsText(file);
  };

  const readLogo = (file: File) => {
    if (!file.type.startsWith("image/") || file.size > 4 * 1024 * 1024) {
      setError("Choose an image file under 4 MB for the logo.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setLogo(String(reader.result));
    reader.readAsDataURL(file);
  };

  const generate = async () => {
    if (!rows.length) {
      setError("Add at least one line first.");
      return;
    }
    setError(null);
    setProgress({ done: 0, total: rows.length });
    try {
      const { default: QRCodeStyling } = await import("qr-code-styling");
      const entries: { name: string; data: Uint8Array }[] = [];
      const used = new Set<string>();
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const qr = new QRCodeStyling(buildOptions(preset, row.data, size, format === "svg" ? "svg" : "canvas", logo));
        const blob = (await qr.getRawData(format)) as Blob | null;
        if (!blob) throw new Error("render failed");
        let base = `${String(i + 1).padStart(3, "0")}-${safeName(row.name || row.data) || "qr"}`;
        while (used.has(base)) base += "-x";
        used.add(base);
        entries.push({ name: `${base}.${format}`, data: new Uint8Array(await blob.arrayBuffer()) });
        setProgress({ done: i + 1, total: rows.length });
        // yield so the progress bar paints
        await new Promise((r) => setTimeout(r, 0));
      }
      const zip = createZip(entries);
      const a = document.createElement("a");
      a.href = URL.createObjectURL(zip);
      a.download = `qrvibe-bulk-${rows.length}-codes.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 3000);
    } catch (err) {
      console.error("Bulk export error:", err);
      setError("Something went wrong while generating. Try fewer rows or a smaller size.");
    } finally {
      setProgress(null);
    }
  };

  const busy = progress !== null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
      <div className="lg:col-span-7 rounded-3xl bg-slate-900/70 border border-slate-800 p-4 sm:p-6 space-y-5">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <label htmlFor="bulk-input" className="text-sm font-bold text-white">
              One {hasNames ? "name,content" : mode === "links" ? "link" : "text"} per line
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => csvRef.current?.click()}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white"
              >
                <FileUp className="w-3.5 h-3.5" />
                Upload CSV / TXT
              </button>
              <button
                type="button"
                onClick={() => setRaw("")}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-300 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            </div>
            <input
              ref={csvRef}
              type="file"
              accept=".csv,.txt,text/csv,text/plain"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) readFile(f, setRaw);
                e.target.value = "";
              }}
            />
          </div>
          <textarea
            id="bulk-input"
            rows={10}
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            spellCheck={false}
            className={`${inputCls} font-mono`}
            placeholder={hasNames ? "table-1,https://example.com/menu?t=1" : "https://example.com/page-1"}
          />
          <p className="text-xs text-slate-400 mt-1.5">
            {rows.length} QR code{rows.length === 1 ? "" : "s"} ready
            {allRows.length > MAX_ROWS && (
              <span className="text-amber-300"> · only the first {MAX_ROWS} are used</span>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-xs font-semibold text-slate-300 mb-1.5">Each line is</span>
            <select value={mode} onChange={(e) => setMode(e.target.value as Mode)} className={inputCls}>
              <option value="links">A link (https:// added if missing)</option>
              <option value="text">Plain text</option>
            </select>
          </label>
          <label className="block">
            <span className="block text-xs font-semibold text-slate-300 mb-1.5">Style</span>
            <select value={presetId} onChange={(e) => setPresetId(e.target.value)} className={inputCls}>
              {QR_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="block text-xs font-semibold text-slate-300 mb-1.5">Size</span>
            <select value={size} onChange={(e) => setSize(Number(e.target.value))} className={inputCls}>
              <option value={512}>512 px</option>
              <option value={1024}>1024 px (HD)</option>
              <option value={2048}>2048 px (print)</option>
            </select>
          </label>
          <label className="block">
            <span className="block text-xs font-semibold text-slate-300 mb-1.5">File type</span>
            <select value={format} onChange={(e) => setFormat(e.target.value as Format)} className={inputCls}>
              <option value="png">PNG</option>
              <option value="svg">SVG (vector)</option>
            </select>
          </label>
        </div>

        <label className="flex items-center gap-2.5 text-sm text-slate-200 cursor-pointer">
          <input
            type="checkbox"
            checked={hasNames}
            onChange={(e) => setHasNames(e.target.checked)}
            className="w-4 h-4 accent-indigo-500"
          />
          Lines start with a file name, like <code className="text-indigo-300">table-1,https://…</code>
        </label>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => logoRef.current?.click()}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white"
          >
            <ImageIcon className="w-4 h-4" />
            {logo ? "Change logo" : "Add logo (optional)"}
          </button>
          {logo && (
            <button type="button" onClick={() => setLogo(null)} className="text-xs text-rose-300 hover:text-rose-200">
              Remove logo
            </button>
          )}
          <input
            ref={logoRef}
            type="file"
            accept="image/png,image/jpeg,image/svg+xml,image/webp"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) readLogo(f);
              e.target.value = "";
            }}
          />
        </div>
      </div>

      <div className="lg:col-span-5 rounded-3xl bg-slate-900/80 border border-slate-800 p-4 sm:p-6 lg:sticky lg:top-20 self-start">
        <p className="text-xs font-semibold text-slate-400 mb-3">Sample (first line)</p>
        <div className="mx-auto w-[220px] h-[220px] rounded-xl overflow-hidden bg-slate-950 border border-slate-800 grid place-items-center">
          <div ref={sampleRef} className="[&_canvas]:rounded-lg" />
          {!first && <span className="text-xs text-slate-500 absolute">Add a line to preview</span>}
        </div>

        {error && (
          <p className="mt-4 text-sm text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-xl p-3" role="alert">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={generate}
          disabled={busy || !rows.length}
          className="mt-5 w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:brightness-110 text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition disabled:opacity-60"
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {busy ? `Generating ${progress.done} / ${progress.total}…` : `Download ${rows.length} QR codes (ZIP)`}
        </button>
        {busy && (
          <div className="mt-3 h-1.5 rounded-full bg-slate-800 overflow-hidden" aria-hidden>
            <div
              className="h-full bg-indigo-500 transition-all"
              style={{ width: `${(progress.done / progress.total) * 100}%` }}
            />
          </div>
        )}
        <p className="mt-3 text-xs text-slate-500">Runs in your browser. Your list is never uploaded.</p>
      </div>
    </div>
  );
}

export default BulkGenerator;
