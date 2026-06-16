import { fmtKm, fmtPrice } from "@/lib/format";
import { OWNER_INFO } from "@/lib/ownerInfo";

const BRAND_NAVY = "#1e1f4b";
const BRAND_RED = "#c41e24";
const MUTED = "#64748b";
const LINE = "#e2e8f0";
const CARD = "#ffffff";
const PAGE_BG = "#f1f5f9";

export function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function nl2br(s: string): string {
  return escapeHtml(s).replace(/\r\n/g, "\n").replace(/\n/g, "<br />");
}

function emailShell(inner: string, footerNote: string, preheader?: string): string {
  const pre =
    preheader !== undefined && preheader.length > 0
      ? `<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${escapeHtml(preheader)}</div>`
      : "";
  return `<!DOCTYPE html>
<html lang="it">
<head><meta charset="utf-8"><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"></head>
<body style="margin:0;padding:0;background:${PAGE_BG};-webkit-text-size-adjust:100%;">
${pre}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAGE_BG};padding:28px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:${CARD};border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(30,31,75,0.08);border:1px solid ${LINE};">
<tr><td style="background:linear-gradient(135deg,${BRAND_NAVY} 0%,${BRAND_NAVY} 55%,${BRAND_RED} 55%,${BRAND_RED} 100%);padding:22px 28px;">
<table role="presentation" width="100%"><tr>
<td style="font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:0.02em;">V4</td>
<td align="right" style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:10px;color:rgba(255,255,255,0.85);text-transform:uppercase;letter-spacing:0.14em;">Vintage Vehicles Verified</td>
</tr></table>
</td></tr>
<tr><td style="padding:28px 28px 8px;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:15px;line-height:1.55;color:#0f172a;">
${inner}
</td></tr>
<tr><td style="padding:16px 28px 28px;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:11px;line-height:1.5;color:${MUTED};border-top:1px solid ${LINE};">
${footerNote}
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

function row(label: string, valueHtml: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 14px;border-collapse:collapse;">
<tr><td style="width:132px;vertical-align:top;padding:0 12px 0 0;font-size:11px;font-weight:600;color:${MUTED};text-transform:uppercase;letter-spacing:0.08em;">${escapeHtml(label)}</td>
<td style="vertical-align:top;font-size:14px;color:#0f172a;line-height:1.45;">${valueHtml}</td></tr></table>`;
}

function sectionTitle(t: string): string {
  return `<p style="margin:24px 0 14px;font-size:11px;font-weight:700;color:${BRAND_NAVY};text-transform:uppercase;letter-spacing:0.12em;border-bottom:2px solid ${BRAND_RED};padding-bottom:6px;display:inline-block;">${escapeHtml(t)}</p>`;
}

const footerStandard = `© V4 — ${OWNER_INFO.legalName} · P.IVA ${OWNER_INFO.piva}<br/>
PEC <a href="mailto:${escapeHtml(OWNER_INFO.pec)}" style="color:${BRAND_NAVY};">${escapeHtml(OWNER_INFO.pec)}</a> · Tel. ${escapeHtml(OWNER_INFO.phoneDisplay)}`;

export function buildTeamContactEmail(input: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  body: string;
}): { message: string; message_html: string } {
  const { name, email, phone, subject, body } = input;
  const message =
    `V4 — NOTIFICA CONTATTO\n` +
    `────────────────────────────\n\n` +
    `Oggetto: ${subject}\n\n` +
    `MITTENTE\n` +
    `  Nome:    ${name}\n` +
    `  Email:   ${email}\n` +
    `  Telefono: ${phone}\n\n` +
    `MESSAGGIO\n` +
    `────────────────────────────\n` +
    `${body}\n\n` +
    `────────────────────────────\n` +
    `Rispondi a questo thread usando l'indirizzo del cliente in "Rispondi a".`;

  const inner =
    `<p style="margin:0 0 8px;font-size:13px;color:${MUTED};">Hai ricevuto un nuovo messaggio dal modulo contatti del sito.</p>` +
    `<h1 style="margin:0 0 20px;font-family:Georgia,serif;font-size:20px;font-weight:700;color:${BRAND_NAVY};line-height:1.25;">${escapeHtml(subject)}</h1>` +
    row("Nome", escapeHtml(name)) +
    row("Email", `<a href="mailto:${escapeHtml(email)}" style="color:${BRAND_NAVY};font-weight:600;">${escapeHtml(email)}</a>`) +
    row("Telefono", escapeHtml(phone)) +
    sectionTitle("Messaggio") +
    `<div style="margin:0;padding:16px 18px;background:${PAGE_BG};border-radius:8px;border:1px solid ${LINE};font-size:14px;color:#1e293b;">${nl2br(body)}</div>`;

  const message_html = emailShell(
    inner,
    `${footerStandard}<br/><br/><span style="opacity:0.85;">Messaggio generato automaticamente dal sito V4.</span>`,
    `Nuovo contatto: ${subject.slice(0, 90)}`
  );

  return { message, message_html };
}

export function buildTeamSellEmail(input: {
  full_name: string;
  email: string;
  phone: string;
  city: string;
  brand: string;
  model: string;
  version: string;
  year: number;
  mileage_km: number;
  fuel: string;
  transmission: string;
  asking_price_eur: string | number;
  has_inspection: string;
  has_documents: string;
  has_brochure: string;
  brochure_notes: string;
  brochure_file_url: string;
  description: string;
  photos_count: number;
  photos_urls: string;
}): { message: string; message_html: string } {
  const v = input;
  const vehicle = `${v.brand} ${v.model}${v.version && v.version !== "—" ? " " + v.version : ""} (${v.year})`;
  const message =
    `V4 — NUOVA PROPOSTA DI VENDITA\n` +
    `══════════════════════════════════\n\n` +
    `VEICOLO\n` +
    `  ${vehicle}\n` +
    `  Chilometraggio: ${fmtKm(v.mileage_km)}\n` +
    `  Alimentazione / Cambio: ${v.fuel} · ${v.transmission}\n` +
    `  Prezzo richiesto: ${typeof v.asking_price_eur === "number" ? fmtPrice(v.asking_price_eur) : v.asking_price_eur}\n\n` +
    `PROPRIETARIO\n` +
    `  ${v.full_name}\n` +
    `  ${v.email}\n` +
    `  ${v.phone}\n` +
    `  Città: ${v.city}\n\n` +
    `CHECKLIST\n` +
    `  Perizia: ${v.has_inspection}\n` +
    `  Documenti: ${v.has_documents}\n` +
    `  Brochure: ${v.has_brochure}\n` +
    `  Note brochure: ${v.brochure_notes}\n` +
    (v.brochure_file_url && v.brochure_file_url !== "—" ? `  PDF brochure: ${v.brochure_file_url}\n` : "") +
    `\nDESCRIZIONE\n` +
    `${v.description}\n\n` +
    `FOTO (${v.photos_count})\n` +
    `${v.photos_urls}`;

  const priceStr =
    typeof v.asking_price_eur === "number" ? fmtPrice(v.asking_price_eur) : String(v.asking_price_eur);

  const photosLines = v.photos_urls
    .split("\n")
    .map((u) => u.trim())
    .filter(Boolean);
  const photosHtml =
    photosLines.length === 0
      ? `<span style="color:${MUTED};">Nessun link foto nel corpo del messaggio.</span>`
      : `<ol style="margin:8px 0 0;padding-left:20px;font-size:13px;color:#334155;">${photosLines
          .slice(0, 40)
          .map((u) => `<li style="margin:4px 0;word-break:break-all;"><a href="${escapeHtml(u)}" style="color:${BRAND_NAVY};">${escapeHtml(u)}</a></li>`)
          .join("")}</ol>`;

  const inner =
    `<p style="margin:0 0 8px;font-size:13px;color:${MUTED};">Nuova richiesta dal modulo <strong>Proponi la tua auto</strong>.</p>` +
    `<h1 style="margin:0 0 6px;font-family:Georgia,serif;font-size:22px;font-weight:700;color:${BRAND_NAVY};">${escapeHtml(vehicle)}</h1>` +
    `<p style="margin:0 0 20px;font-size:14px;color:#334155;">${escapeHtml(fmtKm(v.mileage_km))} · ${escapeHtml(v.fuel)} · ${escapeHtml(v.transmission)} · <strong>${escapeHtml(priceStr)}</strong></p>` +
    sectionTitle("Contatto") +
    row("Nome", escapeHtml(v.full_name)) +
    row("Email", `<a href="mailto:${escapeHtml(v.email)}" style="color:${BRAND_NAVY};font-weight:600;">${escapeHtml(v.email)}</a>`) +
    row("Telefono", `<a href="tel:${escapeHtml(v.phone.replace(/\s/g, ""))}" style="color:${BRAND_NAVY};">${escapeHtml(v.phone)}</a>`) +
    row("Città", escapeHtml(v.city)) +
    sectionTitle("Checklist") +
    row("Perizia", escapeHtml(v.has_inspection)) +
    row("Documenti", escapeHtml(v.has_documents)) +
    row("Brochure", escapeHtml(v.has_brochure)) +
    (v.brochure_notes && v.brochure_notes !== "—" ? row("Note brochure", nl2br(v.brochure_notes)) : "") +
    (v.brochure_file_url && v.brochure_file_url !== "—"
      ? row(
          "PDF brochure",
          `<a href="${escapeHtml(v.brochure_file_url)}" style="color:${BRAND_RED};font-weight:600;">Scarica / apri PDF</a>`
        )
      : "") +
    sectionTitle("Descrizione") +
    `<div style="margin:0;padding:16px 18px;background:${PAGE_BG};border-radius:8px;border:1px solid ${LINE};font-size:14px;color:#1e293b;">${nl2br(v.description)}</div>` +
    sectionTitle(`Foto inviate (${v.photos_count})`) +
    photosHtml;

  const message_html = emailShell(
    inner,
    `${footerStandard}<br/><br/><span style="opacity:0.85;">Notifica automatica — gestisci la pratica dal pannello admin V4.</span>`,
    `Nuova proposta: ${vehicle} — ${priceStr}`
  );

  return { message, message_html };
}

export function buildClientAcceptanceEmail(input: {
  fullName: string;
  brand: string;
  model: string;
  year: number;
  priceEur: number;
  listingUrl: string;
}): { message: string; message_html: string } {
  const { fullName, brand, model, year, priceEur, listingUrl } = input;
  const car = `${brand} ${model} (${year})`;
  const message =
    `Gentile ${fullName},\n\n` +
    `con piacere Le comunichiamo che la Sua ${car} è stata accettata dal nostro team e pubblicata nel catalogo V4.\n\n` +
    `Prezzo di pubblicazione: ${fmtPrice(priceEur)}\n` +
    `Scheda online: ${listingUrl}\n\n` +
    `Per informazioni o appuntamenti può contattarci ai recapiti indicati in calce o rispondere a questa email.\n\n` +
    `Cordiali saluti,\nTeam V4 — Vintage Vehicles Verified`;

  const inner =
    `<p style="margin:0 0 16px;font-size:15px;color:#334155;">Gentile <strong>${escapeHtml(fullName)}</strong>,</p>` +
    `<p style="margin:0 0 18px;font-size:15px;color:#334155;line-height:1.6;">con piacere Le comunichiamo che la Sua <strong>${escapeHtml(brand)} ${escapeHtml(model)}</strong> (anno <strong>${year}</strong>) è stata <strong>accettata</strong> e <strong>pubblicata</strong> nel nostro catalogo online.</p>` +
    `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 22px;background:${PAGE_BG};border:1px solid ${LINE};border-radius:10px;"><tr><td style="padding:18px 20px;">` +
    `<p style="margin:0 0 6px;font-size:11px;font-weight:700;color:${MUTED};text-transform:uppercase;letter-spacing:0.1em;">Prezzo di pubblicazione</p>` +
    `<p style="margin:0;font-family:Georgia,serif;font-size:26px;font-weight:700;color:${BRAND_NAVY};">${escapeHtml(fmtPrice(priceEur))}</p>` +
    `</td></tr></table>` +
    `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;"><tr><td style="border-radius:8px;background:${BRAND_NAVY};">` +
    `<a href="${escapeHtml(listingUrl)}" style="display:inline-block;padding:14px 26px;font-family:system-ui,sans-serif;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;">Vedi la scheda online →</a>` +
    `</td></tr></table>` +
    `<p style="margin:0;font-size:14px;color:${MUTED};line-height:1.55;">Per appuntamenti o dettagli commerciali può rispondere a questa email o scriverci alla PEC ufficiale in calce.</p>` +
    `<p style="margin:20px 0 0;font-size:14px;color:#0f172a;">Cordiali saluti,<br/><strong>Team V4</strong></p>`;

  const message_html = emailShell(
    inner,
    `${footerStandard}<br/><br/><span style="opacity:0.85;">Email automatica relativa alla Sua proposta di vendita.</span>`,
    `La tua ${brand} ${model} è ora nel catalogo V4.`
  );

  return { message, message_html };
}

export function buildClientRejectionEmail(input: {
  fullName: string;
  brand: string;
  model: string;
  year: number;
  reason: string;
}): { message: string; message_html: string } {
  const { fullName, brand, model, year, reason } = input;
  const car = `${brand} ${model} (${year})`;
  const message =
    `Gentile ${fullName},\n\n` +
    `La ringraziamo per averci proposto la Sua ${car}.\n\n` +
    `Dopo un'attenta valutazione, al momento non possiamo inserirla nel nostro catalogo. Motivazione:\n\n` +
    `${reason}\n\n` +
    `Restiamo a disposizione per future proposte che possano rientrare nella nostra selezione.\n\n` +
    `Cordiali saluti,\nTeam V4 — Vintage Vehicles Verified`;

  const inner =
    `<p style="margin:0 0 16px;font-size:15px;color:#334155;">Gentile <strong>${escapeHtml(fullName)}</strong>,</p>` +
    `<p style="margin:0 0 18px;font-size:15px;color:#334155;line-height:1.6;">La ringraziamo per averci proposto la Sua <strong>${escapeHtml(brand)} ${escapeHtml(model)}</strong> (anno <strong>${year}</strong>).</p>` +
    `<p style="margin:0 0 12px;font-size:14px;color:#334155;">Dopo un'attenta valutazione, al momento <strong>non possiamo inserirla</strong> nel nostro catalogo. Di seguito il motivo:</p>` +
    `<div style="margin:0 0 22px;padding:16px 18px;border-left:4px solid ${BRAND_RED};background:#fff5f5;border-radius:0 8px 8px 0;font-size:14px;color:#1e293b;line-height:1.55;">${nl2br(reason)}</div>` +
    `<p style="margin:0 0 20px;font-size:14px;color:${MUTED};line-height:1.55;">Restiamo a disposizione per future proposte in linea con la selezione V4.</p>` +
    `<p style="margin:0;font-size:14px;color:#0f172a;">Cordiali saluti,<br/><strong>Team V4</strong></p>`;

  const message_html = emailShell(
    inner,
    `${footerStandard}<br/><br/><span style="opacity:0.85;">Email automatica relativa alla Sua proposta di vendita.</span>`,
    `Aggiornamento sulla proposta ${brand} ${model}.`
  );

  return { message, message_html };
}
