import { Seo } from "@/components/Seo";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FUELS, TRANSMISSIONS, CONDITIONS } from "@/lib/format";
import { buildTeamSellEmail } from "@/lib/emailLayouts";
import { toast } from "sonner";
import { Upload, X, CheckCircle2, Car, ShieldCheck, FileText } from "lucide-react";
import { motion } from "framer-motion";

const schema = z.object({
  full_name: z.string().trim().min(2, "Nome troppo corto").max(100),
  email: z.string().trim().email("Email non valida").max(200),
  phone: z.string().trim().min(6, "Telefono non valido").max(30),
  city: z.string().trim().max(100).optional(),
  brand: z.string().trim().min(1).max(50),
  model: z.string().trim().min(1).max(50),
  version: z.string().trim().max(100).optional(),
  year: z.coerce.number().min(1950).max(new Date().getFullYear() + 1),
  mileage_km: z.coerce.number().min(0).max(2000000),
  fuel: z.string().min(1),
  transmission: z.string().min(1),
  power_hp: z.coerce.number().min(0).max(2000).optional(),
  displacement_cc: z.coerce.number().min(0).max(10000).optional(),
  color: z.string().trim().max(50).optional(),
  condition: z.string().min(1),
  previous_owners: z.coerce.number().min(0).max(20).optional(),
  has_inspection: z.boolean(),
  has_documents: z.boolean(),
  has_brochure: z.boolean().optional(),
  brochure_notes: z.string().trim().max(2000).optional(),
  asking_price_eur: z.coerce.number().min(0).max(10000000).optional(),
  description: z.string().trim().max(3000).optional(),
});

const Sell = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [brochureFile, setBrochureFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState<any>({
    has_inspection: false, has_documents: true, has_brochure: false, fuel: "", transmission: "", condition: "Usata",
  });

  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    const next = [...files, ...selected].slice(0, 40);
    setFiles(next);
  };

  const removeFile = (i: number) => setFiles(files.filter((_, idx) => idx !== i));
  const handleBrochureFile = (e: React.ChangeEvent<HTMLInputElement>) => setBrochureFile(e.target.files?.[0] ?? null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setSubmitting(true);
    try {
      const urls: string[] = [];
      let brochureFileUrl: string | null = null;
      for (const f of files) {
        const path = `${crypto.randomUUID()}-${f.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
        const { error: upErr } = await supabase.storage.from("listing-uploads").upload(path, f, { upsert: false });
        if (upErr) throw upErr;
        const { data } = supabase.storage.from("listing-uploads").getPublicUrl(path);
        urls.push(data.publicUrl);
      }
      if (brochureFile) {
        const brochurePath = `${crypto.randomUUID()}-${brochureFile.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
        const { error: brochureErr } = await supabase.storage.from("listing-uploads").upload(brochurePath, brochureFile, {
          upsert: false,
          contentType: "application/pdf",
        });
        if (brochureErr) throw brochureErr;
        const { data } = supabase.storage.from("listing-uploads").getPublicUrl(brochurePath);
        brochureFileUrl = data.publicUrl;
      }
      const { error } = await supabase.from("listing_requests").insert({ ...parsed.data, image_urls: urls, brochure_file_url: brochureFileUrl } as any);
      if (error) throw error;
      try {
        const { sendEmail, EMAILJS, SITE_NOTIFY_EMAIL } = await import("@/lib/emailjs");
        const sellFields = {
          full_name: parsed.data.full_name,
          email: parsed.data.email,
          phone: parsed.data.phone,
          city: parsed.data.city || "—",
          brand: parsed.data.brand,
          model: parsed.data.model,
          version: parsed.data.version || "—",
          year: parsed.data.year,
          mileage_km: parsed.data.mileage_km,
          fuel: parsed.data.fuel,
          transmission: parsed.data.transmission,
          asking_price_eur: parsed.data.asking_price_eur ?? "—",
          has_inspection: parsed.data.has_inspection ? "Sì" : "No (perizia da fare)",
          has_documents: parsed.data.has_documents ? "Sì" : "No",
          has_brochure: parsed.data.has_brochure ? "Sì" : "No (la realizziamo noi)",
          brochure_notes: parsed.data.brochure_notes || "—",
          brochure_file_url: brochureFileUrl || "—",
          description: parsed.data.description || "—",
          photos_count: urls.length,
          photos_urls: urls.join("\n"),
        };
        const { message, message_html } = buildTeamSellEmail(sellFields);
        await sendEmail(EMAILJS.sellTemplateId, {
          from_name: parsed.data.full_name,
          from_email: parsed.data.email,
          ...sellFields,
          subject: `[V4 · Proposta] ${parsed.data.brand} ${parsed.data.model} — ${parsed.data.year}`,
          message,
          message_html,
          reply_to: parsed.data.email,
          to_email: SITE_NOTIFY_EMAIL,
        });
      } catch (mailErr) { console.warn("EmailJS:", mailErr); }
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      toast.error(err.message ?? "Errore invio");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) return (
    <div className="container py-24 text-center max-w-xl">
      <div className="w-20 h-20 rounded-full bg-gradient-brand mx-auto grid place-items-center shadow-glow mb-6">
        <CheckCircle2 className="w-10 h-10 text-white" />
      </div>
      <h1 className="font-display font-bold text-3xl mb-3">Richiesta inviata!</h1>
      <p className="text-muted-foreground mb-6">Grazie. Esamineremo la tua proposta e ti contatteremo entro 48 ore.</p>
      <Button onClick={() => { setDone(false); setForm({ has_inspection: false, has_documents: true, has_brochure: false }); setFiles([]); setBrochureFile(null); }}>Invia un'altra</Button>
    </div>
  );

  return (
    <>
      <Seo
        title="Proponi la tua auto storica | V4 Vintage Verified"
        description="Vuoi vendere o far valutare la tua auto storica o da collezione? Proponila al team V4 Vintage Verified: perizia, selezione e pubblicazione con Digital Vehicle Passport su blockchain."
        path="/vendi"
      />
      {/* HERO header */}
      <section className="bg-foreground text-background py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        <div className="container relative max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="hairline text-background/60 mb-5 flex items-center gap-3">
              <span className="w-6 h-px bg-brand-red" />
              Vendi la tua auto storica
              <span className="w-2 h-2 rounded-full bg-brand-blue ml-2" />
            </div>
            <h1 className="font-serif-display font-light text-4xl md:text-6xl leading-[1.05] mb-5">
              Affidaci la tua <em>vettura</em>.
            </h1>
            <p className="text-background/70 max-w-2xl text-lg font-light leading-relaxed">
              Compila il modulo con i dettagli e fino a 40 fotografie. La nostra commissione
              esamina la proposta e ti ricontatta entro <strong className="text-background">48 ore lavorative</strong>.
            </p>
            <div className="grid grid-cols-3 gap-px mt-10 bg-background/10 border border-background/15 max-w-2xl">
              {[
                { n: "01", t: "Compila", d: "Dati e foto" },
                { n: "02", t: "Valutazione", d: "Entro 48h" },
                { n: "03", t: "Incontro", d: "In presenza" },
              ].map((s) => (
                <div key={s.n} className="bg-foreground p-4 md:p-5">
                  <div className="hairline text-background/50 mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-red" />
                    {s.n}
                  </div>
                  <div className="font-display text-lg md:text-xl">{s.t}</div>
                  <div className="text-xs text-background/60 font-light">{s.d}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container py-14 md:py-20 max-w-4xl">
      <form onSubmit={submit} className="space-y-8">
        <Section title="I tuoi contatti">
          <Field label="Nome e cognome *"><Input value={form.full_name ?? ""} onChange={(e) => set("full_name", e.target.value)} required /></Field>
          <Field label="Email *"><Input type="email" value={form.email ?? ""} onChange={(e) => set("email", e.target.value)} required /></Field>
          <Field label="Telefono *"><Input value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value)} required /></Field>
          <Field label="Città"><Input value={form.city ?? ""} onChange={(e) => set("city", e.target.value)} /></Field>
        </Section>

        <Section title="Dati veicolo">
          <Field label="Marca *"><Input value={form.brand ?? ""} onChange={(e) => set("brand", e.target.value)} required /></Field>
          <Field label="Modello *"><Input value={form.model ?? ""} onChange={(e) => set("model", e.target.value)} required /></Field>
          <Field label="Versione / Allestimento"><Input value={form.version ?? ""} onChange={(e) => set("version", e.target.value)} /></Field>
          <Field label="Anno *"><Input type="number" value={form.year ?? ""} onChange={(e) => set("year", e.target.value)} required /></Field>
          <Field label="Chilometraggio *"><Input type="number" value={form.mileage_km ?? ""} onChange={(e) => set("mileage_km", e.target.value)} required /></Field>
          <Field label="Prezzo richiesto (€)"><Input type="number" value={form.asking_price_eur ?? ""} onChange={(e) => set("asking_price_eur", e.target.value)} /></Field>
          <Field label="Carburante *">
            <Select value={form.fuel ?? ""} onValueChange={(v) => set("fuel", v)}>
              <SelectTrigger><SelectValue placeholder="Seleziona" /></SelectTrigger>
              <SelectContent>{FUELS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Cambio *">
            <Select value={form.transmission ?? ""} onValueChange={(v) => set("transmission", v)}>
              <SelectTrigger><SelectValue placeholder="Seleziona" /></SelectTrigger>
              <SelectContent>{TRANSMISSIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Condizione *">
            <Select value={form.condition ?? ""} onValueChange={(v) => set("condition", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{CONDITIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Potenza (CV)"><Input type="number" value={form.power_hp ?? ""} onChange={(e) => set("power_hp", e.target.value)} /></Field>
          <Field label="Cilindrata (cc)"><Input type="number" value={form.displacement_cc ?? ""} onChange={(e) => set("displacement_cc", e.target.value)} /></Field>
          <Field label="Colore"><Input value={form.color ?? ""} onChange={(e) => set("color", e.target.value)} /></Field>
          <Field label="N° proprietari precedenti"><Input type="number" value={form.previous_owners ?? ""} onChange={(e) => set("previous_owners", e.target.value)} /></Field>
        </Section>

        <Section title="Documenti e perizia" cols={2}>
          <div className="flex items-center justify-between p-4 rounded-xl border border-border">
            <div>
              <div className="font-semibold text-sm">Hai una perizia?</div>
              <div className="text-xs text-muted-foreground">Documento meccanico ufficiale</div>
            </div>
            <Switch checked={form.has_inspection} onCheckedChange={(v) => set("has_inspection", v)} />
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl border border-border">
            <div>
              <div className="font-semibold text-sm">Documenti regolari?</div>
              <div className="text-xs text-muted-foreground">Libretto, tagliandi, ecc.</div>
            </div>
            <Switch checked={form.has_documents} onCheckedChange={(v) => set("has_documents", v)} />
          </div>
          {!form.has_inspection && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:col-span-2 flex gap-4 p-5 border border-brand-blue/30 bg-brand-blue/5 border-l-4 border-l-brand-blue"
            >
              <ShieldCheck className="w-6 h-6 text-brand-blue shrink-0 mt-0.5" strokeWidth={1.5} />
              <div>
                <div className="font-display text-base mb-1">Nessuna perizia? Ce ne occupiamo noi.</div>
                <div className="text-sm text-muted-foreground font-light leading-relaxed">
                  Federico Volontè — Perito Arbitro internazionale — e il Team V4 effettuano direttamente
                  perizia tecnica e certificazione del veicolo (ASI / FMI quando applicabile). Nessun
                  costo aggiuntivo per te se la vettura entra nel nostro catalogo.
                </div>
              </div>
            </motion.div>
          )}
          <div className="flex items-center justify-between p-4 rounded-xl border border-border md:col-span-2">
            <div>
              <div className="font-semibold text-sm">Hai una scheda brochure?</div>
              <div className="text-xs text-muted-foreground">PDF tecnico/commerciale del veicolo</div>
            </div>
            <Switch checked={!!form.has_brochure} onCheckedChange={(v) => set("has_brochure", v)} />
          </div>
          {form.has_brochure ? (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:col-span-2 p-5 border border-emerald-500/30 bg-emerald-500/5 border-l-4 border-l-emerald-600"
            >
              <div className="font-display text-base mb-1">Perfetto, carica direttamente il PDF.</div>
              <div className="text-sm text-muted-foreground font-light leading-relaxed mb-3">
                Inserisci la brochure in PDF qui sotto e, se vuoi, aggiungi note utili per il team.
              </div>
              <label className="block border border-border bg-card/70 p-4 cursor-pointer hover:border-accent transition-smooth">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 grid place-items-center bg-emerald-500/10 text-emerald-700">
                    <FileText className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-sm">{brochureFile ? brochureFile.name : "Seleziona brochure PDF"}</div>
                    <div className="text-xs text-muted-foreground">Solo file PDF · brochure commerciale o scheda tecnica</div>
                  </div>
                </div>
                <input type="file" accept="application/pdf" className="hidden" onChange={handleBrochureFile} />
              </label>
              {brochureFile && (
                <button type="button" onClick={() => setBrochureFile(null)} className="mt-3 inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
                  <X className="w-3.5 h-3.5" /> Rimuovi PDF
                </button>
              )}
              <Textarea
                rows={2}
                className="mt-4"
                placeholder="Note sulla brochure (opzionale)"
                value={form.brochure_notes ?? ""}
                onChange={(e) => set("brochure_notes", e.target.value)}
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:col-span-2 flex gap-4 p-5 border border-brand-red/30 bg-brand-red/5 border-l-4 border-l-brand-red"
            >
              <ShieldCheck className="w-6 h-6 text-brand-red shrink-0 mt-0.5" strokeWidth={1.5} />
              <div>
                <div className="font-display text-base mb-1">Niente brochure? La realizziamo noi.</div>
                <div className="text-sm text-muted-foreground font-light leading-relaxed">
                  Il nostro team produce la scheda PDF professionale del veicolo (storia, scheda tecnica,
                  provenienza, manutenzioni). Per farlo ci servono:
                </div>
                <ul className="mt-3 space-y-1.5 text-sm text-foreground/80">
                  <li className="flex gap-2"><span className="text-brand-red">•</span> Anno, marca, modello, allestimento e numero di telaio (VIN)</li>
                  <li className="flex gap-2"><span className="text-brand-red">•</span> Storia dei passaggi di proprietà (libretto / foglio complementare)</li>
                  <li className="flex gap-2"><span className="text-brand-red">•</span> Tagliandi, restauri e interventi rilevanti documentati</li>
                  <li className="flex gap-2"><span className="text-brand-red">•</span> Eventuali certificazioni ASI / FMI / concorsi</li>
                  <li className="flex gap-2"><span className="text-brand-red">•</span> 30–40 fotografie (esterni, interni, vano motore, telaio)</li>
                </ul>
                <Textarea
                  rows={3}
                  className="mt-4"
                  placeholder="Aggiungi qui le info disponibili (storia, manutenzioni, documenti…)"
                  value={form.brochure_notes ?? ""}
                  onChange={(e) => set("brochure_notes", e.target.value)}
                />
              </div>
            </motion.div>
          )}
        </Section>

        <Section title="Descrizione" cols={1}>
          <Textarea rows={5} placeholder="Racconta lo stato dell'auto, manutenzioni, eventuali difetti..." value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} />
        </Section>

        <Section title={`Foto (${files.length}/40)`} cols={1}>
          <label className="block border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-accent transition-smooth">
            <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
            <div className="font-semibold">Carica le foto</div>
            <div className="text-xs text-muted-foreground">Fino a 40 immagini, JPG o PNG</div>
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
          </label>
          {files.length > 0 && (
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2 mt-4">
              {files.map((f, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-secondary group">
                  <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeFile(i)} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-white grid place-items-center opacity-0 group-hover:opacity-100">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Section>

        <Button type="submit" size="lg" disabled={submitting} className="w-full md:w-auto rounded-none bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12">
          <Car className="w-4 h-4 mr-2" />
          {submitting ? "Invio in corso..." : "Invia richiesta"}
        </Button>
      </form>
      </div>
    </>
  );
};

const Section = ({ title, children, cols = 2 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.5 }}
    className="bg-card border border-border p-6 md:p-8 shadow-card relative"
  >
    <div className="absolute top-0 left-0 w-12 h-px bg-brand-red" />
    <h2 className="font-display text-2xl mb-6">{title}</h2>
    <div className={`grid gap-4 ${cols === 1 ? "" : "md:grid-cols-2"}`}>{children}</div>
  </motion.div>
);
const Field = ({ label, children }: any) => (
  <div>
    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">{label}</Label>
    {children}
  </div>
);

export default Sell;
