import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Copy, ExternalLink, QrCode, ShieldCheck, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CERTISHIELD, isValidPassportUrl, qrCodeImageUrl } from "@/lib/certishield";

type Props = {
  passportUrl: string | null | undefined;
  isEnglish?: boolean;
  brand?: string;
  model?: string;
  year?: number;
};

export const CertiShieldPassport = ({ passportUrl, isEnglish = false, brand, model, year }: Props) => {
  const t = (it: string, en: string) => (isEnglish ? en : it);
  const valid = isValidPassportUrl(passportUrl);
  const qrUrl = useMemo(
    () => (valid ? qrCodeImageUrl(passportUrl as string, 132) : null),
    [passportUrl, valid],
  );

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(isEnglish ? `${label} copied` : `${label} copiato`);
  };

  return (
    <section
      id="passaporto-digitale"
      className="scroll-mt-24"
      aria-label={t("Passaporto digitale CertiShield", "CertiShield digital passport")}
    >
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-[hsl(220_18%_12%)] via-[hsl(220_22%_14%)] to-[hsl(220_18%_10%)] text-white shadow-elegant">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/20 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-blue/25 blur-3xl rounded-full pointer-events-none" />

        <div className="relative p-6 md:p-10">
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-semibold text-white/70 border border-white/15 px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-red" />
              CertiShield · Blockchain DVP
            </span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-white/50">
              {t("Powered by KNOBS", "Powered by KNOBS")}
            </span>
          </div>

          <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-start">
            <div>
              <h2 className="font-display font-bold text-2xl md:text-3xl leading-tight mb-2">
                {valid
                  ? t("Passaporto digitale su blockchain", "Blockchain digital passport")
                  : t("Passaporto digitale in preparazione", "Digital passport in preparation")}
              </h2>
              <p className="text-sm text-white/65 leading-relaxed max-w-2xl mb-6">
                {valid
                  ? t(
                      `Questa vettura${brand ? ` (${brand}${model ? " " + model : ""}${year ? `, ${year}` : ""})` : ""} è certificata su CertiShield: perizia, restauri, documenti e foto chiave sono notarizzati su blockchain in un Digital Vehicle Passport (DVP) consultabile pubblicamente tramite QR. Una garanzia di autenticità immutabile per acquirenti, assicurazioni e futuri proprietari.`,
                      `This vehicle${brand ? ` (${brand}${model ? " " + model : ""}${year ? `, ${year}` : ""})` : ""} is certified on CertiShield: appraisals, restorations, documents and key photos are notarized on blockchain in a Digital Vehicle Passport (DVP) publicly verifiable via QR. An immutable guarantee of authenticity for buyers, insurers and future owners.`,
                    )
                  : t(
                      "Stiamo predisponendo per questa vettura il Digital Vehicle Passport CertiShield su blockchain: ogni passaggio (perizia, restauri, eventi, documenti) verrà notarizzato in modo immutabile e consultabile via QR. Contattaci per ricevere la documentazione disponibile.",
                      "We are preparing the CertiShield blockchain Digital Vehicle Passport for this car: each step (appraisal, restoration, events, documents) will be notarized immutably and accessible via QR. Contact us to receive the documentation available today.",
                    )}
              </p>

              <ul className="grid sm:grid-cols-2 gap-3 mb-6">
                {[
                  {
                    it: "Identità del veicolo notarizzata su blockchain",
                    en: "Vehicle identity notarized on blockchain",
                  },
                  {
                    it: "Perizie e restauri immutabili nel tempo",
                    en: "Appraisals and restorations immutable over time",
                  },
                  {
                    it: "Archivio documenti e foto chiave",
                    en: "Archive of key documents and photos",
                  },
                  {
                    it: "Trasferibile al nuovo proprietario",
                    en: "Transferable to the new owner",
                  },
                ].map((f) => (
                  <li key={f.it} className="flex items-start gap-2 text-sm text-white/80">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <span>{isEnglish ? f.en : f.it}</span>
                  </li>
                ))}
              </ul>

              <p className="text-[11px] text-white/45 leading-relaxed">
                {t(
                  "CertiShield è la piattaforma italiana di KNOBS S.r.l. che emette il Digital Vehicle Passport (DVP) su blockchain. Complementa — non sostituisce — il Certificato di Rilevanza Storica (CRS) e i registri ASI/FIVA.",
                  "CertiShield is the Italian platform by KNOBS S.r.l. that issues the blockchain Digital Vehicle Passport (DVP). It complements — does not replace — the Certificate of Historic Relevance (CRS) and ASI/FIVA registers.",
                )}{" "}
                <Link to="/certificazione-digitale" className="text-white/70 underline hover:text-white">
                  {t("Scopri il servizio", "Learn more")}
                </Link>
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 bg-white/5 border border-white/15 rounded-xl p-5 shrink-0 w-full lg:w-auto">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-white/60">
                <QrCode className="w-4 h-4" />
                {t("Verifica passaporto", "Verify passport")}
              </div>
              {valid && qrUrl ? (
                <>
                  <div className="bg-white p-2 rounded-lg">
                    <img src={qrUrl} width={132} height={132} alt="QR CertiShield" className="block" />
                  </div>
                  <p className="text-[10px] text-center text-white/50 max-w-[140px] leading-snug">
                    {t("Scansiona per aprire il DVP su blockchain", "Scan to open the blockchain DVP")}
                  </p>
                  <div className="flex flex-col gap-2 w-full">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-full rounded-lg bg-white text-foreground hover:bg-white/90"
                      onClick={() => copy(passportUrl as string, "Link")}
                    >
                      <Copy className="w-3.5 h-3.5 mr-1.5" />
                      {t("Copia link", "Copy link")}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full rounded-lg border-white/25 text-white hover:bg-white/10"
                      asChild
                    >
                      <a href={passportUrl as string} target="_blank" rel="noreferrer">
                        <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                        {t("Apri passaporto", "Open passport")}
                      </a>
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-[132px] h-[132px] grid place-items-center bg-white/5 border border-dashed border-white/20 rounded-lg text-white/40">
                    <Link2 className="w-8 h-8" strokeWidth={1.25} />
                  </div>
                  <p className="text-[10px] text-center text-white/50 max-w-[160px] leading-snug">
                    {t(
                      "DVP CertiShield non ancora emesso per questa vettura.",
                      "CertiShield DVP not yet issued for this car.",
                    )}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full rounded-lg border-white/25 text-white hover:bg-white/10"
                    asChild
                  >
                    <a href={CERTISHIELD.marketingUrl} target="_blank" rel="noreferrer">
                      <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                      {t("Scopri CertiShield", "Discover CertiShield")}
                    </a>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
