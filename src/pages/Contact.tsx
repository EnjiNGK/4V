import { Seo } from "@/components/Seo";
import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, ArrowRight, Calendar, MessageCircle, Instagram, ShieldCheck, Car, KeyRound, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { sendEmail, EMAILJS, SITE_NOTIFY_EMAIL } from "@/lib/emailjs";
import { OWNER_INFO, OWNER_MAPS_URL } from "@/lib/ownerInfo";
import { buildTeamContactEmail } from "@/lib/emailLayouts";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
};

const schema = z.object({
  name: z.string().trim().min(2, "Nome troppo corto").max(100),
  email: z.string().trim().email("Email non valida").max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  subject: z.string().trim().min(2, "Oggetto richiesto").max(150),
  message: z.string().trim().min(10, "Scrivi almeno 10 caratteri").max(2000),
});

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const onChange = (k: string, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((iss) => {
        if (iss.path[0]) fieldErrors[String(iss.path[0])] = iss.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setSending(true);
    try {
      const { message, message_html } = buildTeamContactEmail({
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || "—",
        subject: parsed.data.subject,
        body: parsed.data.message,
      });
      await sendEmail(EMAILJS.contactTemplateId, {
        from_name: parsed.data.name,
        from_email: parsed.data.email,
        phone: parsed.data.phone || "—",
        subject: `[V4 · Contatti] ${parsed.data.subject}`,
        message,
        message_html,
        reply_to: parsed.data.email,
        to_email: SITE_NOTIFY_EMAIL,
      });
      setSent(true);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      toast.success("Messaggio inviato. Ti risponderemo entro 24h.");
    } catch (err: any) {
      console.error(err);
      toast.error(`Invio non riuscito. Scrivi direttamente a ${OWNER_INFO.pec}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Seo
        title="Contatti — V4 Vintage Verified | Perizie e auto storiche"
        description="Contatta V4 Vintage Verified per perizie, valutazioni e compravendita di auto storiche e da collezione. Compravendita esclusivamente in presenza."
        path="/contatti"
      />
      {/* HERO */}
      <section className="relative bg-foreground text-background overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
        <div aria-hidden className="absolute -bottom-16 -right-10 font-serif-display text-[16rem] leading-none text-background/[0.04] select-none pointer-events-none hidden lg:block">
          contatti
        </div>

        <div className="container relative py-24 md:py-36">
          <motion.div {...fadeUp} transition={{ duration: 0.7 }}>
            <div className="hairline text-background/60 mb-6 flex items-center gap-3">
              <span className="w-6 h-px bg-brand-red" />
              Contatti — Fenegrò (CO)
              <span className="w-2 h-2 rounded-full bg-brand-blue ml-2" />
            </div>
            <h1 className="font-serif-display font-light text-5xl md:text-7xl lg:text-8xl leading-[0.95] mb-8 max-w-4xl">
              Vieni a vederla.<br />
              <em className="text-background/70">Provala.</em> Decidi.
            </h1>
            <p className="text-background/70 max-w-xl text-lg font-light leading-relaxed">
              La nostra vendita è esclusivamente <strong className="text-background">in presenza</strong>.
              Fissa un appuntamento o scrivici: ti rispondiamo entro 24h.
            </p>

            <div className="mt-12 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="rounded-none bg-background text-foreground hover:bg-background/90 px-8 h-12">
                <a href={`tel:${OWNER_INFO.phoneE164}`}><Phone className="w-4 h-4 mr-3" />Chiama ora</a>
              </Button>
              <Button asChild size="lg" className="rounded-none bg-[#25D366] text-white hover:bg-[#20bd5a] px-8 h-12">
                <a href={`https://wa.me/${OWNER_INFO.phoneE164.replace(/^\+/, "")}`} target="_blank" rel="noopener noreferrer"><MessageCircle className="w-4 h-4 mr-3" />WhatsApp</a>
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="relative border-t border-background/10">
          <div className="container grid grid-cols-2 md:grid-cols-4 divide-x divide-background/10">
            {[
              { k: "Risposta", v: "< 24h" },
              { k: "Lingue", v: "IT · EN · DE" },
              { k: "Visite", v: "Su appuntamento" },
              { k: "Trattativa", v: "Riservata" },
            ].map((s) => (
              <div key={s.k} className="py-5 px-4 md:px-6">
                <div className="hairline text-background/50 mb-1">{s.k}</div>
                <div className="font-display text-lg md:text-xl text-background">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORM + INFO */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
            {/* FORM */}
            <motion.div {...fadeUp} transition={{ duration: 0.7 }} className="lg:col-span-7">
              <div className="hairline text-muted-foreground mb-4 flex items-center gap-3">
                <span className="w-6 h-px bg-brand-red" />
                Scrivici
              </div>
              <h2 className="font-display text-4xl md:text-5xl leading-[1.05] mb-6">
                Inviaci un <em className="text-foreground/60">messaggio</em>.
              </h2>
              <p className="text-muted-foreground font-light mb-8 max-w-xl">
                Compila il modulo: rispondiamo personalmente entro 24 ore lavorative all'indirizzo email che inserisci.
              </p>

              {sent ? (
                <div className="border border-brand-blue/30 bg-brand-blue/5 p-8">
                  <div className="hairline text-brand-blue mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-blue" /> Messaggio ricevuto
                  </div>
                  <h3 className="font-display text-2xl mb-2">Grazie, ti scriviamo presto.</h3>
                  <p className="text-muted-foreground font-light mb-5">
                    Abbiamo inviato una conferma alla tua email. Il Team V4 risponderà entro 24h.
                  </p>
                  <Button onClick={() => setSent(false)} variant="outline" className="rounded-none border-foreground/20">
                    Invia un altro messaggio
                  </Button>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-5 border border-border bg-card p-6 md:p-8">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field label="Nome e cognome *" error={errors.name}>
                      <Input value={form.name} onChange={(e) => onChange("name", e.target.value)} placeholder="Mario Rossi" className="rounded-none h-11" />
                    </Field>
                    <Field label="Email *" error={errors.email}>
                      <Input type="email" value={form.email} onChange={(e) => onChange("email", e.target.value)} placeholder="mario@esempio.it" className="rounded-none h-11" />
                    </Field>
                    <Field label="Telefono" error={errors.phone}>
                      <Input value={form.phone} onChange={(e) => onChange("phone", e.target.value)} placeholder="+39 …" className="rounded-none h-11" />
                    </Field>
                    <Field label="Oggetto *" error={errors.subject}>
                      <Input value={form.subject} onChange={(e) => onChange("subject", e.target.value)} placeholder="Informazioni su…" className="rounded-none h-11" />
                    </Field>
                  </div>
                  <Field label="Messaggio *" error={errors.message}>
                    <Textarea rows={6} value={form.message} onChange={(e) => onChange("message", e.target.value)} placeholder="Raccontaci cosa cerchi o cosa vuoi proporci." className="rounded-none" />
                  </Field>
                  <div className="flex items-center justify-between gap-4 pt-3 border-t border-border">
                    <p className="text-[11px] text-muted-foreground font-light">
                      Inviando accetti la nostra <Link to="/privacy" className="underline">Privacy Policy</Link> (GDPR UE 2016/679).
                    </p>
                    <Button type="submit" disabled={sending} className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6 shrink-0">
                      {sending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Invio…</> : <><Send className="w-4 h-4 mr-2" />Invia messaggio</>}
                    </Button>
                  </div>
                </form>
              )}
            </motion.div>

            {/* INFO RAIL */}
            <motion.div {...fadeUp} transition={{ duration: 0.7, delay: 0.1 }} className="lg:col-span-5 space-y-5">
              {[
                { icon: Mail, t: OWNER_INFO.pec, s: "PEC — risposta entro 24h", href: `mailto:${OWNER_INFO.pec}`, accent: "red" },
                { icon: Phone, t: OWNER_INFO.phoneDisplay, s: "Lun–Sab · 9:00 → 19:00", href: `tel:${OWNER_INFO.phoneE164}`, accent: "blue" },
                { icon: MapPin, t: OWNER_INFO.addressZipCity, s: OWNER_INFO.addressStreet, href: OWNER_MAPS_URL, accent: "red" },
              ].map((c) => (
                <a key={c.t} href={c.href} className={`flex gap-5 p-6 bg-card border border-border border-l-4 ${c.accent === "red" ? "border-l-brand-red" : "border-l-brand-blue"} hover:bg-secondary/40 transition-smooth group`}>
                  <c.icon className="w-6 h-6 text-foreground/70 mt-1 shrink-0" strokeWidth={1.25} />
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-xl mb-1 truncate">{c.t}</div>
                    <div className="text-sm text-muted-foreground font-light">{c.s}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground self-center group-hover:translate-x-1 transition-transform" />
                </a>
              ))}

              <div id="mappa" className="relative overflow-hidden bg-foreground text-background p-8 mt-2">
                <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
                <div className="relative">
                  <div className="hairline text-background/60 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-red" />
                    Showroom — Su appuntamento
                  </div>
                  <div className="font-display text-3xl mb-1">V4 — {OWNER_INFO.addressZipCity}</div>
                  <div className="text-background/70 font-light mb-5">{OWNER_INFO.fullAddress} · Lun–Sab · 9:00 → 19:00</div>
                  <div className="flex gap-3 flex-wrap">
                    <a href={OWNER_MAPS_URL} target="_blank" rel="noopener noreferrer" className="hairline text-background/80 border-b border-background/30 hover:border-background pb-1 inline-flex items-center gap-2">
                      Apri su Maps <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hairline text-background/80 border-b border-background/30 hover:border-background pb-1 inline-flex items-center gap-2">
                      <Instagram className="w-3.5 h-3.5" /> Instagram
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* APPOINTMENT */}
          <div className="mt-24 pt-16 border-t border-border grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <motion.div {...fadeUp} transition={{ duration: 0.7 }} className="lg:col-span-6">
              <div className="hairline text-muted-foreground mb-4 flex items-center gap-3">
                <span className="w-6 h-px bg-brand-blue" />
                Appuntamento
              </div>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05] mb-6">
                Visita lo <em className="text-foreground/60">showroom</em>.
              </h2>
              <p className="text-muted-foreground font-light text-lg leading-relaxed mb-8">
                Riceviamo collezionisti, appassionati e curiosi. Ogni visita è dedicata: dedichiamo tempo per mostrarti dettagli, documentazione e storia di ogni vettura.
              </p>

              <div className="border-t border-border pt-8">
                <div className="hairline text-muted-foreground mb-5">— Cosa aspettarsi</div>
                <ol className="space-y-5">
                  {[
                    { i: Car, t: "Ispezione completa", d: "Esame su ponte sollevatore, motore freddo, dettagli interni." },
                    { i: KeyRound, t: "Prova su strada", d: "Test guida concordato, percorso misto città / extraurbano." },
                    { i: ShieldCheck, t: "Documentazione", d: "Esame libretto, passaggi, certificazioni e perizia." },
                  ].map((s, idx) => (
                    <li key={s.t} className="flex gap-5 group">
                      <div className="font-serif-display text-2xl text-foreground/30 w-8 shrink-0 group-hover:text-brand-red transition-smooth">
                        0{idx + 1}
                      </div>
                      <s.i className="w-5 h-5 text-foreground/70 mt-1 shrink-0" strokeWidth={1.25} />
                      <div>
                        <div className="font-display text-lg leading-tight">{s.t}</div>
                        <div className="text-sm text-muted-foreground font-light mt-1">{s.d}</div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </motion.div>

            <motion.div {...fadeUp} transition={{ duration: 0.7, delay: 0.1 }} className="lg:col-span-6 grid gap-5">
              {[
                { icon: Calendar, t: "Su appuntamento", d: "Concordiamo data e ora che funzionino per te.", accent: "red" },
                { icon: Clock, t: "Lun–Sab · 9:00 → 19:00", d: "Disponibilità anche fuori orario per visite riservate.", accent: "blue" },
                { icon: MessageCircle, t: "Risposta entro 24h", d: "Rispondiamo personalmente a ogni richiesta.", accent: "red" },
              ].map((item) => (
                <div key={item.t} className={`flex gap-5 p-6 bg-card border border-border border-l-4 ${item.accent === "red" ? "border-l-brand-red" : "border-l-brand-blue"}`}>
                  <item.icon className="w-6 h-6 text-foreground/70 mt-1 shrink-0" strokeWidth={1.25} />
                  <div>
                    <div className="font-display text-xl mb-1">{item.t}</div>
                    <div className="text-sm text-muted-foreground font-light">{item.d}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
  <div>
    <Label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-2 block">{label}</Label>
    {children}
    {error && <p className="text-xs text-destructive mt-1.5">{error}</p>}
  </div>
);

export default Contact;
