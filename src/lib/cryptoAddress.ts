import type { CryptoCoin } from "@/types/qr";

const BECH32_CHARSET = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";

function polymod(values: number[]): number {
  const GEN = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
  let chk = 1;
  for (const v of values) {
    const top = chk >>> 25;
    chk = ((chk & 0x1ffffff) << 5) ^ v;
    for (let i = 0; i < 5; i++) if ((top >>> i) & 1) chk ^= GEN[i];
  }
  return chk >>> 0;
}

/** Full segwit address check: checksum, witness version vs bech32/bech32m, and program length (BIP-173 / BIP-350). */
function bech32Valid(addr: string, hrp: string): boolean {
  if (addr !== addr.toLowerCase() && addr !== addr.toUpperCase()) return false;
  const a = addr.toLowerCase();
  const sep = a.lastIndexOf("1");
  if (sep < 1 || a.slice(0, sep) !== hrp || a.length - sep - 1 < 7 || a.length > 90) return false;
  const data: number[] = [];
  for (const ch of a.slice(sep + 1)) {
    const i = BECH32_CHARSET.indexOf(ch);
    if (i === -1) return false;
    data.push(i);
  }
  const hrpExp = [...hrp].map((c) => c.charCodeAt(0) >> 5).concat(0, [...hrp].map((c) => c.charCodeAt(0) & 31));
  const pm = polymod([...hrpExp, ...data]);
  const version = data[0];
  if (version > 16) return false;
  if (pm !== (version === 0 ? 1 : 0x2bc830a3)) return false;

  // 5-bit groups -> bytes, padding must be < 5 bits and all zero
  let acc = 0;
  let bits = 0;
  let bytes = 0;
  for (const v of data.slice(1, -6)) {
    acc = ((acc << 5) | v) & 0xfff;
    bits += 5;
    if (bits >= 8) {
      bits -= 8;
      bytes++;
    }
  }
  if (bits >= 5 || (acc & ((1 << bits) - 1)) !== 0) return false;
  return version === 0 ? bytes === 20 || bytes === 32 : bytes >= 2 && bytes <= 40;
}

const B58 = "[1-9A-HJ-NP-Za-km-z]";

/** "valid" = format (and checksum where checkable) is right. Legacy base58 is format-checked only. */
export function checkCryptoAddress(coin: CryptoCoin, raw: string): "valid" | "invalid" {
  const a = raw.trim();
  if (!a) return "invalid";
  switch (coin) {
    case "bitcoin":
      if (/^bc1/i.test(a)) return bech32Valid(a, "bc") ? "valid" : "invalid";
      return new RegExp(`^[13]${B58}{25,34}$`).test(a) ? "valid" : "invalid";
    case "litecoin":
      if (/^ltc1/i.test(a)) return bech32Valid(a, "ltc") ? "valid" : "invalid";
      return new RegExp(`^[LM3]${B58}{25,34}$`).test(a) ? "valid" : "invalid";
    case "dogecoin":
      return new RegExp(`^[DA9]${B58}{25,34}$`).test(a) ? "valid" : "invalid";
    case "ethereum":
      return /^0x[0-9a-fA-F]{40}$/.test(a) ? "valid" : "invalid";
  }
}

/** Plain decimal (no exponent) with up to 8 decimals, as BIP-21 requires. */
export function formatCryptoAmount(v: string): string | null {
  const n = parseFloat(v);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n.toFixed(8).replace(/\.?0+$/, "");
}
