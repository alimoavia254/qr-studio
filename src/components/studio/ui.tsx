import React from "react";

/* ------------------------------------------------------------------ */
/* Small shared UI pieces so every panel looks and behaves the same    */
/* ------------------------------------------------------------------ */

export const inputCls =
  "w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-base sm:text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors";

export function Section({
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

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-slate-300 mb-1.5">{label}</span>
      {children}
    </label>
  );
}

export function Chip({
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

export function Segmented<T extends string | number>({
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

export function Toggle({
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

export function ColorField({
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

export function OptionTile({
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

