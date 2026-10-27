"use client";

import React, { useState } from "react";
import {
  Globe,
  MessageCircle,
  Wifi,
  Contact,
  Mail,
  FileText,
  MessageSquare,
  Phone,
  MapPin,
  CalendarDays,
  Share2,
  Bitcoin,
  Eye,
  EyeOff,
  X,
} from "lucide-react";
import type { QRDesignConfig, QRContentType, SocialPlatform } from "@/types/qr";
import { checkCryptoAddress } from "@/lib/cryptoAddress";
import { Section, Field, Chip, Segmented, Toggle, OptionTile, inputCls } from "./ui";

const SOCIAL_PLATFORMS: { id: SocialPlatform; label: string; hint: string }[] = [
  { id: "instagram", label: "Instagram", hint: "instagram.com/" },
  { id: "facebook", label: "Facebook", hint: "facebook.com/" },
  { id: "tiktok", label: "TikTok", hint: "tiktok.com/@" },
  { id: "youtube", label: "YouTube", hint: "youtube.com/@" },
  { id: "telegram", label: "Telegram", hint: "t.me/" },
  { id: "x", label: "X (Twitter)", hint: "x.com/" },
  { id: "linkedin", label: "LinkedIn", hint: "linkedin.com/in/" },
  { id: "snapchat", label: "Snapchat", hint: "snapchat.com/add/" },
];

export const CONTENT_TYPES: { id: QRContentType; label: string; icon: React.ElementType }[] = [
  { id: "url", label: "Website", icon: Globe },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { id: "wifi", label: "Wi-Fi", icon: Wifi },
  { id: "vcard", label: "Contact", icon: Contact },
  { id: "email", label: "Email", icon: Mail },
  { id: "text", label: "Text", icon: FileText },
  { id: "sms", label: "SMS", icon: MessageSquare },
  { id: "phone", label: "Call", icon: Phone },
  { id: "geo", label: "Location", icon: MapPin },
  { id: "event", label: "Event", icon: CalendarDays },
  { id: "social", label: "Social", icon: Share2 },
  { id: "crypto", label: "Crypto", icon: Bitcoin },
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

interface ContentPanelProps {
  config: QRDesignConfig;
  update: <K extends keyof QRDesignConfig>(key: K, value: QRDesignConfig[K]) => void;
}

export function ContentPanel({ config, update }: ContentPanelProps) {
  const [wifiShowPass, setWifiShowPass] = useState(false);
  return (
    <div className="space-y-6">
      <Section title="What should the QR open?">
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
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

      {config.contentType === "sms" && (
        <Section title="Text message (SMS)" hint="Scanning opens the messages app with your number and text ready to send.">
          <Field label="Phone number">
            <input
              type="tel"
              inputMode="tel"
              value={config.sms.phone}
              onChange={(e) => update("sms", { ...config.sms, phone: e.target.value })}
              placeholder="+923001234567"
              className={inputCls}
            />
          </Field>
          <Field label="Message (optional)">
            <textarea
              rows={3}
              value={config.sms.message}
              onChange={(e) => update("sms", { ...config.sms, message: e.target.value })}
              placeholder="Type the pre-filled message…"
              className={inputCls}
            />
          </Field>
        </Section>
      )}

      {config.contentType === "phone" && (
        <Section title="Phone call" hint="Scanning opens the dialer with this number. One tap to call.">
          <Field label="Phone number">
            <input
              type="tel"
              inputMode="tel"
              value={config.phone.phone}
              onChange={(e) => update("phone", { phone: e.target.value })}
              placeholder="+923001234567"
              className={inputCls}
            />
          </Field>
        </Section>
      )}

      {config.contentType === "geo" && (
        <Section title="Location" hint="Scanning opens the map at this exact spot. Right-click a place in Google Maps to copy its coordinates.">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Latitude">
              <input
                type="text"
                inputMode="decimal"
                value={config.geo.lat}
                onChange={(e) => update("geo", { ...config.geo, lat: e.target.value })}
                placeholder="31.5204"
                className={inputCls}
              />
            </Field>
            <Field label="Longitude">
              <input
                type="text"
                inputMode="decimal"
                value={config.geo.lng}
                onChange={(e) => update("geo", { ...config.geo, lng: e.target.value })}
                placeholder="74.3587"
                className={inputCls}
              />
            </Field>
          </div>
          <Field label="Opens in">
            <Segmented
              value={config.geo.linkStyle}
              onChange={(v) => update("geo", { ...config.geo, linkStyle: v })}
              options={[
                { value: "maps", label: "Google Maps link (recommended)" },
                { value: "geo", label: "geo: link (some phones show text)" },
              ]}
            />
          </Field>
        </Section>
      )}

      {config.contentType === "event" && (
        <Section title="Calendar event" hint="Scanning offers to add this event to the phone's calendar.">
          <Field label="Event title">
            <input
              type="text"
              value={config.event.title}
              onChange={(e) => update("event", { ...config.event, title: e.target.value })}
              placeholder="Product launch"
              className={inputCls}
            />
          </Field>
          <Field label="QR type">
            <Segmented
              value={config.event.linkStyle ?? "gcal"}
              onChange={(v) => update("event", { ...config.event, linkStyle: v })}
              options={[
                { value: "gcal", label: "Calendar link (recommended)" },
                { value: "ics", label: "Raw .ics data" },
              ]}
            />
          </Field>
          <p className="text-xs text-slate-400 -mt-1">
            {(config.event.linkStyle ?? "gcal") === "gcal"
              ? "Opens Google Calendar with the event ready to save. Works on every phone camera."
              : "Embeds the event itself. Only some phone cameras offer to add it, others just show text."}
          </p>
          <Toggle
            checked={config.event.allDay}
            onChange={(v) =>
              update("event", {
                ...config.event,
                allDay: v,
                start: v ? config.event.start.slice(0, 10) : `${config.event.start.slice(0, 10)}T10:00`,
                end: v ? config.event.end.slice(0, 10) : `${config.event.end.slice(0, 10)}T11:00`,
              })
            }
            label="All-day event"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Starts">
              <input
                type={config.event.allDay ? "date" : "datetime-local"}
                value={config.event.start}
                onChange={(e) => update("event", { ...config.event, start: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Ends">
              <input
                type={config.event.allDay ? "date" : "datetime-local"}
                value={config.event.end}
                onChange={(e) => update("event", { ...config.event, end: e.target.value })}
                className={inputCls}
              />
            </Field>
          </div>
          <Field label="Location (optional)">
            <input
              type="text"
              value={config.event.location}
              onChange={(e) => update("event", { ...config.event, location: e.target.value })}
              className={inputCls}
            />
          </Field>
          <Field label="Description (optional)">
            <textarea
              rows={2}
              value={config.event.description}
              onChange={(e) => update("event", { ...config.event, description: e.target.value })}
              className={inputCls}
            />
          </Field>
        </Section>
      )}

      {config.contentType === "social" && (
        <Section title="Social media profile" hint="Scanning opens the profile in the app (or the website if the app isn't installed).">
          <div className="flex flex-wrap gap-2">
            {SOCIAL_PLATFORMS.map((p) => (
              <Chip
                key={p.id}
                active={config.social.platform === p.id}
                onClick={() => update("social", { ...config.social, platform: p.id })}
              >
                {p.label}
              </Chip>
            ))}
          </div>
          <Field label="Username or profile link">
            <input
              type="text"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              value={config.social.username}
              onChange={(e) => update("social", { ...config.social, username: e.target.value })}
              placeholder={`${SOCIAL_PLATFORMS.find((p) => p.id === config.social.platform)?.hint}yourname`}
              className={inputCls}
            />
          </Field>
        </Section>
      )}

      {config.contentType === "crypto" && (
        <Section title="Crypto wallet" hint="Scanning a wallet app fills in your address. Double-check the address: crypto payments can't be reversed.">
          <Field label="Coin">
            <Segmented
              value={config.crypto.coin}
              onChange={(v) => update("crypto", { ...config.crypto, coin: v })}
              options={[
                { value: "bitcoin", label: "Bitcoin" },
                { value: "ethereum", label: "Ethereum" },
                { value: "litecoin", label: "Litecoin" },
                { value: "dogecoin", label: "Dogecoin" },
              ]}
            />
          </Field>
          <Field label="Wallet address">
            <input
              type="text"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              value={config.crypto.address}
              onChange={(e) => update("crypto", { ...config.crypto, address: e.target.value })}
              className={`${inputCls} font-mono`}
            />
            {config.crypto.address.trim() &&
              (checkCryptoAddress(config.crypto.coin, config.crypto.address) === "valid" ? (
                <span className="block mt-1.5 text-xs text-emerald-400">Address format looks correct for {config.crypto.coin}.</span>
              ) : (
                <span className="block mt-1.5 text-xs text-rose-300">
                  This doesn&apos;t look like a valid {config.crypto.coin} address. Check the coin and copy it again.
                </span>
              ))}
          </Field>
          {config.crypto.coin !== "ethereum" && (
            <Field label="Amount (optional)">
              <input
                type="text"
                inputMode="decimal"
                value={config.crypto.amount}
                onChange={(e) => update("crypto", { ...config.crypto, amount: e.target.value })}
                className={inputCls}
              />
            </Field>
          )}
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
}
