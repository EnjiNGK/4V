export const CERTISHIELD = {
  brand: "CertiShield",
  vendor: "KNOBS S.r.l.",
  product: "Digital Vehicle Passport (DVP)",
  marketingUrl: "https://knobs.it/en/certishield-digital-vehicle-passport/",
  brochureUrl:
    "https://knobs.it/wp-content/uploads/2025/04/CertiShield-for-Automotive_ENG_May2025.pdf",
  bookingUrl: "https://calendly.com/luca-pilloni",
} as const;

export function qrCodeImageUrl(data: string, size = 140): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=8&data=${encodeURIComponent(
    data,
  )}`;
}

export function isValidPassportUrl(url: string | null | undefined): url is string {
  if (!url) return false;
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}
