// Color utilities for contrast and QR scannability analysis

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleanHex = hex.replace("#", "").trim();
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    return { r, g, b };
  }
  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return { r, g, b };
  }
  return null;
}

export function getLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function getContrastRatio(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  if (!rgb1 || !rgb2) return 1;

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

export interface ScannabilityResult {
  score: number; // 0 - 100
  rating: "Excellent" | "Good" | "Fair" | "Warning";
  colorClass: string;
  contrastRatio: number;
  contrastText: string;
  recommendations: string[];
}

export function evaluateScannability(
  fgColor: string,
  bgColor: string,
  hasLogo: boolean,
  logoSize: number,
  errorCorrection: string
): ScannabilityResult {
  const ratio = getContrastRatio(fgColor, bgColor);
  const roundedRatio = Math.round(ratio * 10) / 10;
  const recommendations: string[] = [];
  let score = 100;

  // Contrast checks
  if (ratio >= 7) {
    // Ultra high contrast
  } else if (ratio >= 4.5) {
    score -= 10;
  } else if (ratio >= 3) {
    score -= 30;
    recommendations.push("Increase color contrast between QR dots and background.");
  } else {
    score -= 60;
    recommendations.push("Low contrast detected! Most phone cameras will struggle to scan this.");
  }

  // Logo checks
  if (hasLogo) {
    if (errorCorrection !== "H" && errorCorrection !== "Q") {
      score -= 25;
      recommendations.push("For logos, set Error Correction to 'H' (High) to avoid scan failures.");
    }
    if (logoSize > 0.35) {
      score -= 20;
      recommendations.push("Logo covers more than 35% of the QR code. Consider reducing logo size.");
    }
  }

  score = Math.max(10, Math.min(100, score));

  let rating: "Excellent" | "Good" | "Fair" | "Warning" = "Excellent";
  let colorClass = "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
  let contrastText = "High Contrast";

  if (score >= 85) {
    rating = "Excellent";
    colorClass = "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
    contrastText = "Optimal Scannability";
  } else if (score >= 70) {
    rating = "Good";
    colorClass = "text-blue-400 border-blue-500/30 bg-blue-500/10";
    contrastText = "Reliable Scan";
  } else if (score >= 50) {
    rating = "Fair";
    colorClass = "text-amber-400 border-amber-500/30 bg-amber-500/10";
    contrastText = "Moderate Scanability";
  } else {
    rating = "Warning";
    colorClass = "text-rose-400 border-rose-500/30 bg-rose-500/10";
    contrastText = "Scan May Fail";
  }

  return {
    score,
    rating,
    colorClass,
    contrastRatio: roundedRatio,
    contrastText,
    recommendations,
  };
}
