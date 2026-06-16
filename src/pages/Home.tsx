import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Camera, Handshake, Star, ChevronDown, FileBadge, Award, Quote, CheckCircle2, ScrollText, KeyRound, MapPin, ExternalLink, Search, Car as CarIcon, ShieldCheck, QrCode, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { CarCard, CarCardData } from "@/components/CarCard";
import { motion } from "framer-motion";
import heroCar from "@/assets/hero-car.jpg";
import { useLanguage } from "@/lib/i18n";
import { Seo } from "@/components/Seo";

const REVIEWS_IT = [
  { n: "Marco R.", c: "Collezionista — Milano", date: "12 marzo 2026", t: "Documentazione impeccabile sulla mia Alfa Giulia GTA. Ispezione su ponte, prova su strada, zero sorprese. Esperienza da casa d'aste." },
  { n: "Sara M.", c: "Restauratrice — Modena", date: "28 febbraio 2026", t: "Foto dettagliatissime, anche del sottoscocca e del vano motore. Finalmente un portale serio per chi conosce davvero le auto storiche." },
  { n: "Luca P.", c: "Acquirente Porsche 911 RS", date: "07 febbraio 2026", t: "Trattativa professionale e riservata, passaggio ASI gestito interamente da loro. Lo consiglio senza riserve a ogni collezionista." },
];
const REVIEWS_EN = [
  { n: "Marco R.", c: "Collector — Milan", date: "March 12, 2026", t: "Impeccable documentation on my Alfa Giulia GTA. Lift inspection, test drive, zero surprises. Auction-house experience." },
  { n: "Sara M.", c: "Restorer — Modena", date: "February 28, 2026", t: "Extremely detailed photos, including underbody and engine bay. Finally a serious portal for those who really know classic cars." },
  { n: "Luca P.", c: "Porsche 911 RS buyer", date: "February 7, 2026", t: "Professional and confidential negotiation, ASI registration handled entirely by them. I recommend them without reservations to every collector." },
];

const ReviewCard = ({ r, verifiedLabel }: { r: { n: string; c: string; date: string; t: string }; verifiedLabel: string }) => (
  <div className="bg-background p-9 md:p-10 relative flex flex-col h-full">
    <Quote className="absolute top-6 right-6 w-12 h-12 text-foreground/[0.04]" strokeWidth={1} />
    <div className="flex items-center gap-0.5 mb-5">
      {Array.from({ length: 5 }).map((_, k) => (
        <span key={k} className="w-5 h-5 grid place-items-center bg-[#00b67a]">
          <Star className="w-3 h-3 fill-current text-white" strokeWidth={0} />
        </span>
      ))}
      <span className="ml-2 hairline text-muted-foreground">{verifiedLabel}</span>
    </div>
    <p className="font-display text-lg md:text-xl leading-relaxed mb-6 italic flex-1">"{r.t}"</p>
    <div className="pt-5 border-t border-border flex items-center justify-between">
      <div>
        <div className="hairline text-foreground">{r.n}</div>
        <div className="text-xs text-muted-foreground mt-1">{r.c}</div>
      </div>
      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{r.date}</div>
    </div>
  </div>
);

const MobileReviewsCarousel = ({ reviews, verifiedLabel, reviewLabel }: { reviews: typeof REVIEWS_IT; verifiedLabel: string; reviewLabel: string }) => {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % reviews.length), 6000);
    return () => clearInterval(id);
  }, [reviews.length]);
  return (
    <div className="md:hidden">
      <div className="relative overflow-hidden border border-border bg-border">
        <div className="flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${idx * 100}%)` }}>
          {reviews.map((r) => (
            <div key={r.n} className="w-full shrink-0">
              <ReviewCard r={r} verifiedLabel={verifiedLabel} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 mt-5">
        {reviews.map((_, i) => (
          <button
            key={i}
            aria-label={`${reviewLabel} ${i + 1}`}
            onClick={() => setIdx(i)}
            className={`h-1.5 rounded-full transition-all ${i === idx ? "w-8 bg-foreground" : "w-1.5 bg-foreground/30"}`}
          />
        ))}
      </div>
    </div>
  );
};

const Home = () => {
  const { isEnglish } = useLanguage();
  const reviews = isEnglish ? REVIEWS_EN : REVIEWS_IT;
  const verifiedLabel = isEnglish ? "Verified" : "Verificata";
  const [featured, setFeatured] = useState<CarCardData[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("cars")
        .select("id, brand, model, version, year, mileage_km, price_eur, fuel, transmission, featured, car_images(url, is_cover, position)")
        .eq("status", "published")
        .order("featured", { ascending: false })
        .order("year", { ascending: true })
        .limit(6);
      const mapped = (data ?? []).map((c: any) => ({
        ...c,
        cover: (c.car_images?.find((i: any) => i.is_cover) ?? c.car_images?.[0])?.url ?? null,
      }));
      setFeatured(mapped);
    })();
  }, []);

  return (
    <>
      <Seo
        title={isEnglish ? "V4 Vintage Verified — Classic & collectible cars certified on blockchain" : "V4 Vintage Verified — Auto storiche e da collezione certificate su blockchain"}
        description={isEnglish ? "Curated selection of classic, youngtimer and collectible cars in Italy. Appraisals, documents and CertiShield Digital Vehicle Passport on blockchain." : "Selezione curata di auto storiche, youngtimer e da collezione in Italia. Perizie, documenti regolari e Digital Vehicle Passport CertiShield su blockchain."}
        path="/"
        image="/logo-v4.png"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "AutoDealer",
          name: "V4 Vintage Verified",
          url: "/",
          logo: "/logo-v4.png",
          areaServed: "IT",
          priceRange: "€€€",
        }}
      />
      {/* HERO — full-bleed editorial */}
      <section className="relative min-h-[100svh] md:h-[92vh] md:min-h-[640px] w-full overflow-hidden bg-black text-white flex flex-col">
        <div className="absolute inset-0">
          <img
            src={heroCar}
            alt={isEnglish ? "Classic vehicle" : "Vettura storica"}
            width={1920}
            height={1080}
            className="w-full h-full object-cover object-center animate-ken-burns"
          />
          {/* Strong readability scrim — desktop bottom gradient */}
          <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />
          <div className="hidden md:block absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          {/* Mobile: heavy bottom scrim so text is fully readable */}
          <div className="md:hidden absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/95" />
        </div>

        {/* Center content */}
        <div className="relative h-full container flex-1 flex flex-col justify-end pb-16 pt-28 md:pb-32">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="font-serif-display font-light text-[2.6rem] sm:text-[3.4rem] md:text-[6rem] leading-[0.95] tracking-tight mb-5 md:mb-6">
              Vintage.<br />
              <span className="italic font-normal">Vehicles. Verified.</span>
            </h1>
            <p className="text-[15px] md:text-lg text-white/85 max-w-xl font-light leading-relaxed mb-8 md:mb-10">
              {isEnglish
                ? "Vehicles of historical and collector interest, selected and appraised by the Team of international Arbiter Surveyor Federico Volontè."
                : "Veicoli di interesse storico e collezionistico, selezionati e periziati dal Team del Perito Arbitro internazionale Federico Volontè."}
            </p>
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-4 sm:gap-6">
              <Button asChild size="lg" className="rounded-none bg-white text-black hover:bg-white/90 px-8 h-12 w-full sm:w-auto justify-center">
                <Link to="/catalogo">{isEnglish ? "View catalog" : "Vedi il catalogo"} <ArrowRight className="ml-3 w-4 h-4" /></Link>
              </Button>
              <Link to="/vendi" className="hairline text-white/85 hover:text-white border-b border-white/40 hover:border-white pb-1 transition-smooth self-center">
                {isEnglish ? "Submit your car for publication →" : "Invia la tua auto da pubblicare →"}
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator (desktop only) */}
        <div className="hidden md:block absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 animate-bounce">
          <ChevronDown className="w-5 h-5" />
        </div>
      </section>

      {/* MARQUEE / brand strip */}
      <section className="border-y border-border bg-background overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee py-5 text-foreground/60">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex items-center gap-12 pr-12 font-display text-2xl italic">
              {["Alfa Romeo", "Porsche", "Jaguar", "Mercedes-Benz", "Ferrari", "Lancia", "BMW", "Fiat", "Lamborghini", "Maserati"].map((b, i) => (
                <span key={`${k}-${b}`} className="flex items-center gap-12">
                  {b}
                  <span className={`w-1.5 h-1.5 rounded-full ${i % 2 === 0 ? "bg-brand-red/70" : "bg-brand-blue/70"}`} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED — visible immediately under hero */}
      <section className="py-20 md:py-28 bg-gradient-soft">
        <div className="container">
          <div className="flex items-end justify-between mb-10 pb-6 border-b border-border">
            <div>
              <div className="hairline text-muted-foreground mb-3 flex items-center gap-3">
                <span className="w-6 h-px bg-brand-red" />
                {isEnglish ? "Current selection" : "Selezione corrente"}
              </div>
              <h2 className="font-display text-3xl md:text-5xl">{isEnglish ? "Classic vehicles showcase" : "Vetrina veicoli storici"}</h2>
            </div>
            <Button asChild variant="ghost" className="hidden md:inline-flex hairline">
              <Link to="/catalogo">{isEnglish ? "Full catalog" : "Tutto il catalogo"} <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
          {featured.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-border">
              <p className="text-muted-foreground font-light">{isEnglish ? "Catalog coming soon." : "Catalogo in arrivo."}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 md:gap-8">
              {featured.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                >
                  <CarCard car={c} />
                </motion.div>
              ))}
            </div>
          )}
          <div className="mt-10 text-center md:hidden">
            <Button asChild className="rounded-none bg-primary text-primary-foreground px-8 h-12">
              <Link to="/catalogo">{isEnglish ? "View full catalog" : "Vedi tutto il catalogo"} <ArrowRight className="ml-3 w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CHI SIAMO TEASER */}
      <section className="relative py-24 md:py-32 bg-foreground text-background overflow-hidden">
        <div aria-hidden className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)", backgroundSize: "26px 26px" }} />
        <div aria-hidden className="absolute -top-20 -right-10 font-serif-display text-[22rem] leading-none text-background/[0.04] select-none pointer-events-none hidden md:block">V4</div>

        <div className="container relative grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-7">
            <div className="hairline text-background/60 mb-5 flex items-center gap-3">
              <span className="w-6 h-px bg-brand-red" />
              {isEnglish ? "About — the meaning of V4" : "Chi siamo — il significato di V4"}
              <span className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
            </div>
            <h2 className="font-serif-display font-light text-4xl md:text-6xl lg:text-7xl leading-[1.02] mb-6">
              {isEnglish ? <>Four <em className="text-background/60">V's</em>.<br />One vision.</> : <>Quattro <em className="text-background/60">V</em>.<br />Un'unica visione.</>}
            </h2>
            <p className="text-background/70 font-light text-lg leading-relaxed mb-8 max-w-xl">
              {isEnglish
                ? "V4 is not a simple used car portal. It is research, selection, appraisal and storytelling of pieces that represent style, design and craftsmanship of decades past."
                : "V4 non è un semplice portale di veicoli usati. È ricerca, selezione, perizia e divulgazione di pezzi che rappresentano stile, design e qualità artigianale dei decenni passati."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="rounded-none bg-background text-foreground hover:bg-background/90 px-8 h-12">
                <Link to="/chi-siamo">{isEnglish ? "Discover the 4 V's" : "Scopri le 4 V"} <ArrowRight className="ml-3 w-4 h-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-none border-background/30 bg-transparent text-background hover:bg-background hover:text-foreground px-8 h-12">
                <Link to="/vendi">{isEnglish ? "Sell your car" : "Proponi la tua auto"}</Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-px bg-background/10 border border-background/10">
            {[
              { k: "Volontè", a: "red", d: isEnglish ? "International Arbiter Surveyor" : "Perito Arbitro internazionale" },
              { k: "Vintage", a: "blue", d: isEnglish ? "Rare pieces, history and signature" : "Pezzi rari, storia e firma" },
              { k: "Vehicles", a: "red", d: isEnglish ? "Classic cars · motorcycles · aircraft" : "Auto · moto · aerei storici" },
              { k: "Verified", a: "blue", d: isEnglish ? "Appraised by the V4 Team" : "Periziati dal Team V4" },
            ].map((v) => (
              <div key={v.k} className="bg-foreground p-7 md:p-8">
                <div className="hairline text-background/60 flex items-center gap-2 mb-3">
                  <span className={`w-1.5 h-1.5 rounded-full ${v.a === "red" ? "bg-brand-red" : "bg-brand-blue"}`} />
                  {isEnglish ? "V for…" : "V di…"}
                </div>
                <div className="font-serif-display text-2xl md:text-3xl mb-2">{v.k}</div>
                <div className="text-xs text-background/60 font-light">{v.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* METODO — editorial split with numbers, checklist & visual identity */}
      <section className="relative py-24 md:py-32 bg-background overflow-hidden">
        {/* decorative oversized type */}
        <div aria-hidden className="absolute -top-10 right-0 font-serif-display text-[18rem] leading-none text-foreground/[0.03] select-none pointer-events-none hidden md:block">
          {isEnglish ? "method" : "metodo"}
        </div>

        <div className="container relative">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 mb-16">
            {/* Left intro column */}
            <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
              <div className="hairline text-muted-foreground mb-5 flex items-center gap-3">
                <span className="w-6 h-px bg-brand-blue" />
                {isEnglish ? "Our method" : "Il nostro metodo"}
                <span className="w-1.5 h-1.5 rounded-full bg-brand-red" />
              </div>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05] mb-6">
                {isEnglish ? <>Three principles.<br /><em className="text-foreground/60">No compromise.</em></> : <>Tre principi.<br /><em className="text-foreground/60">Nessun compromesso.</em></>}
              </h2>
              <p className="text-muted-foreground font-light leading-relaxed mb-8">
                {isEnglish
                  ? "We treat every car as a piece of history: we document it, we photograph it, we tell its story. And then we show it to you in person — because a classic car is not bought blindly."
                  : "Trattiamo ogni vettura come un pezzo di storia: la documentiamo, la fotografiamo, la raccontiamo. E poi te la mostriamo di persona — perché un'auto storica non si compra al buio."}
              </p>
              <div className="flex items-center gap-4 pt-6 border-t border-border">
                <div className="flex -space-x-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-red ring-2 ring-background" />
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-blue ring-2 ring-background" />
                  <span className="w-2.5 h-2.5 rounded-full bg-foreground ring-2 ring-background" />
                </div>
                <span className="hairline text-muted-foreground">{isEnglish ? "V4 Standard" : "Standard V4"}</span>
              </div>
            </div>

            {/* Right method blocks */}
            <div className="lg:col-span-7 space-y-px">
              {[
                {
                  n: "01",
                  icon: ScrollText,
                  t: isEnglish ? "Complete documentation" : "Documentazione completa",
                  d: isEnglish
                    ? "Original logbooks, tracked ownership transfers, ASI / FMI certifications when available. Every car has a verifiable history."
                    : "Libretti originali, passaggi di proprietà tracciati, certificazioni ASI / FMI quando disponibili. Ogni vettura ha una storia verificabile.",
                  bullets: isEnglish
                    ? ["Logbook and supplementary form", "Ownership and service history", "ASI / FMI certification"]
                    : ["Libretto e foglio complementare", "Storico passaggi e tagliandi", "Certificazione ASI / FMI"],
                  accent: "red",
                },
                {
                  n: "02",
                  icon: Camera,
                  t: isEnglish ? "Professional photography" : "Fotografia professionale",
                  d: isEnglish
                    ? "Up to 40 high-resolution images: exteriors, interiors, engine bay, chassis, details and imperfections. Transparency above all."
                    : "Fino a 40 immagini ad alta risoluzione: esterni, interni, vano motore, telaio, dettagli e imperfezioni. Trasparenza prima di tutto.",
                  bullets: isEnglish
                    ? ["360° exteriors and details", "Engine bay and underbody", "Declared imperfections"]
                    : ["Esterni 360° e dettagli", "Vano motore e sottoscocca", "Imperfezioni dichiarate"],
                  accent: "blue",
                },
                {
                  n: "03",
                  icon: KeyRound,
                  t: isEnglish ? "In-person sale" : "Vendita in presenza",
                  d: isEnglish
                    ? "Visit the car in our showroom, inspect every detail, take it for a drive. Trust is built in person, not with a click."
                    : "Visita la vettura nel nostro showroom, ispeziona ogni dettaglio, prova la guida. La fiducia nasce dall'incontro, non da un click.",
                  bullets: isEnglish
                    ? ["Lift inspection", "Agreed test drive", "Confidential negotiation"]
                    : ["Ispezione su ponte sollevatore", "Prova su strada concordata", "Trattativa riservata"],
                  accent: "red",
                },
              ].map((v, i) => (
                <motion.article
                  key={v.n}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  className="group grid grid-cols-[auto_1fr] gap-6 md:gap-10 p-7 md:p-9 border border-border bg-card hover:bg-secondary/30 transition-smooth relative"
                >
                  <div className="flex flex-col items-start">
                    <div className={`font-serif-display text-5xl md:text-6xl leading-none ${v.accent === "red" ? "text-brand-red" : "text-brand-blue"}`}>
                      {v.n}
                    </div>
                    <div className="w-px h-12 bg-border mt-4 ml-3" />
                  </div>
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 className="font-display text-2xl md:text-3xl">{v.t}</h3>
                      <v.icon className="w-6 h-6 text-foreground/40 group-hover:text-foreground group-hover:rotate-6 transition-smooth shrink-0" strokeWidth={1.25} />
                    </div>
                    <p className="text-sm md:text-base text-muted-foreground font-light leading-relaxed mb-5">{v.d}</p>
                    <ul className="space-y-1.5">
                      {v.bullets.map((b) => (
                        <li key={b} className="flex items-center gap-2.5 text-sm text-foreground/80">
                          <CheckCircle2 className={`w-4 h-4 ${v.accent === "red" ? "text-brand-red" : "text-brand-blue"}`} strokeWidth={1.5} />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* PASSAPORTO DIGITALE — CertiShield (KNOBS) */}
      <section className="py-24 md:py-28 bg-foreground text-background relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        <div className="container relative">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <div className="hairline text-background/60 mb-4 flex items-center gap-3">
                <span className="w-6 h-px bg-brand-red" />
                {isEnglish ? "CertiShield · Blockchain DVP" : "CertiShield · DVP su blockchain"}
              </div>
              <h2 className="font-display text-4xl md:text-5xl leading-tight mb-5">
                {isEnglish ? (
                  <>Digital Vehicle Passport<br /><em className="text-background/55">on blockchain</em></>
                ) : (
                  <>Passaporto digitale<br /><em className="text-background/55">su blockchain</em></>
                )}
              </h2>
              <p className="text-background/70 font-light leading-relaxed mb-8">
                {isEnglish
                  ? "Through our partnership with CertiShield by KNOBS, each certified car receives an immutable Digital Vehicle Passport: appraisals, restorations, documents and key photos notarized on blockchain and verifiable via QR — for life."
                  : "Grazie alla partnership con CertiShield by KNOBS, ogni auto certificata riceve un Digital Vehicle Passport immutabile: perizie, restauri, documenti e foto chiave notarizzati su blockchain e verificabili con un QR — per sempre."}
              </p>
              <Button asChild variant="outline" className="rounded-none border-background/40 bg-transparent text-background hover:bg-background hover:text-foreground">
                <Link to="/certificazione-digitale">
                  {isEnglish ? "How CertiShield works" : "Come funziona CertiShield"} <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
            <div className="lg:col-span-7 grid sm:grid-cols-3 gap-px bg-background/10 border border-background/15">
              {[
                {
                  icon: ShieldCheck,
                  t: "01",
                  s: isEnglish ? "Blockchain certified" : "Certificato su blockchain",
                  d: isEnglish ? "Immutable record by an authorized professional" : "Registrazione immutabile da professionista autorizzato",
                },
                {
                  icon: Link2,
                  t: "02",
                  s: isEnglish ? "Full vehicle history" : "Storia completa del veicolo",
                  d: isEnglish ? "Appraisals, restorations, events, documents" : "Perizie, restauri, eventi, documenti",
                },
                {
                  icon: QrCode,
                  t: "03",
                  s: isEnglish ? "QR public verification" : "Verifica pubblica via QR",
                  d: isEnglish ? "Transferable to the next owner" : "Trasferibile al nuovo proprietario",
                },
              ].map((item) => (
                <div key={item.t} className="bg-foreground p-6 md:p-8 border border-transparent hover:border-background/20 transition-smooth">
                  <item.icon className="w-7 h-7 text-brand-red mb-4" strokeWidth={1.25} />
                  <div className="font-mono text-xs text-background/50 mb-1">{item.t}</div>
                  <div className="font-display text-lg mb-2">{item.s}</div>
                  <div className="text-xs text-background/55 font-light">{item.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA — Vendere */}
      <section className="relative py-24 md:py-28 overflow-hidden bg-foreground text-background">
        <div aria-hidden className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
        <div aria-hidden className="absolute -top-32 -left-40 w-[36rem] h-[36rem] rounded-full bg-brand-blue/20 blur-3xl pointer-events-none" />
        <div aria-hidden className="absolute -bottom-32 -right-40 w-[36rem] h-[36rem] rounded-full bg-brand-red/20 blur-3xl pointer-events-none" />
        <div aria-hidden className="absolute right-0 top-1/2 -translate-y-1/2 font-serif-display text-[18rem] leading-none text-background/[0.04] select-none pointer-events-none hidden lg:block">
          {isEnglish ? "Sell" : "Vendere"}
        </div>

        <div className="container relative">
          <div className="grid md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-7">
              <div className="hairline text-background/60 mb-5 flex items-center gap-3">
                <span className="w-6 h-px bg-brand-red" />
                {isEnglish ? "Sell with V4" : "Vendere con V4"}
                <span className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
              </div>
              <h2 className="font-serif-display font-light text-4xl md:text-6xl lg:text-7xl leading-[1] mb-6">
                {isEnglish ? <>Do you have a classic car<br /><em className="text-background/60">to entrust to us?</em></> : <>Hai un'auto storica<br /><em className="text-background/60">da affidarci?</em></>}
              </h2>
              <p className="text-background/75 font-light text-lg mb-8 leading-relaxed max-w-xl">
                {isEnglish ? (
                  <>Fill out the detailed form and send up to 40 photos. We carefully evaluate every proposal and get back to you within <strong className="text-background">48 working hours</strong>. If needed, <span className="text-background border-b border-brand-red">we handle the appraisal ourselves</span>.</>
                ) : (
                  <>Compila il modulo dettagliato e invia fino a 40 fotografie. Valutiamo ogni proposta con cura e ti ricontattiamo entro <strong className="text-background">48 ore lavorative</strong>. Se serve, <span className="text-background border-b border-brand-red">la perizia la facciamo noi</span>.</>
                )}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-none bg-brand-red text-white hover:bg-brand-red/90 px-8 h-12">
                  <Link to="/vendi">{isEnglish ? "Sell your car" : "Proponi la tua auto"} <ArrowRight className="ml-3 w-4 h-4" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-none border-background/30 bg-transparent text-background hover:bg-background hover:text-foreground px-8 h-12">
                  <Link to="/contatti">{isEnglish ? "Talk to us" : "Parla con noi"}</Link>
                </Button>
              </div>
            </div>

            <div className="md:col-span-5 grid grid-cols-2 gap-px bg-background/10 border border-background/15">
              {[
                { n: "01", t: isEnglish ? "Submit" : "Compila", d: isEnglish ? "Full data and photos" : "Dati completi e foto", a: "red" },
                { n: "02", t: isEnglish ? "We evaluate" : "Valutiamo", d: isEnglish ? "Within 48 working hours" : "Entro 48h lavorative", a: "blue" },
                { n: "03", t: isEnglish ? "We appraise" : "Periziamo", d: isEnglish ? "Technical and ASI / FMI" : "Tecnica e ASI / FMI", a: "red" },
                { n: "04", t: isEnglish ? "We sell" : "Vendiamo", d: isEnglish ? "In person, confidential" : "In presenza, riservato", a: "blue" },
              ].map((s) => (
                <div key={s.n} className="bg-foreground p-5 md:p-6">
                  <div className={`font-serif-display text-3xl mb-2 ${s.a === "red" ? "text-brand-red" : "text-brand-blue"}`}>{s.n}</div>
                  <div className="font-display text-lg">{s.t}</div>
                  <div className="text-xs text-background/60 font-light mt-1">{s.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIANZE — Trustpilot style */}
      <section className="py-24 md:py-28 bg-gradient-soft">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14 pb-8 border-b border-border">
            <div>
              <div className="hairline text-muted-foreground mb-3 flex items-center gap-3">
                <span className="w-6 h-px bg-brand-red" />
                {isEnglish ? "Verified reviews" : "Recensioni verificate"}
              </div>
              <h2 className="font-display text-4xl md:text-5xl">{isEnglish ? "The voice of collectors" : "La voce dei collezionisti"}</h2>
            </div>

            {/* Trustpilot summary card */}
            <a
              href="https://www.trustpilot.com/review/v4.it"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-4 bg-background border border-border px-5 py-4 hover:border-foreground/40 transition-smooth"
            >
              <div className="flex items-center gap-1.5">
                <Star className="w-5 h-5 fill-current text-[#00b67a]" strokeWidth={0} />
                <span className="font-display text-2xl leading-none">4.9</span>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, k) => (
                  <span key={k} className="w-5 h-5 grid place-items-center bg-[#00b67a]">
                    <Star className="w-3.5 h-3.5 fill-current text-white" strokeWidth={0} />
                  </span>
                ))}
              </div>
              <div className="text-xs leading-tight">
                <div className="font-medium">Trustpilot</div>
                <div className="text-muted-foreground">{isEnglish ? "142 reviews" : "142 recensioni"}</div>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-smooth" />
            </a>
          </div>

          <MobileReviewsCarousel reviews={reviews} verifiedLabel={verifiedLabel} reviewLabel={isEnglish ? "Review" : "Recensione"} />

          <div className="hidden md:grid md:grid-cols-3 gap-px bg-border border border-border">
            {reviews.map((r, i) => (
              <motion.div
                key={r.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <ReviewCard r={r} verifiedLabel={verifiedLabel} />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <a
              href="https://www.trustpilot.com/review/v4.it"
              target="_blank"
              rel="noopener noreferrer"
              className="hairline text-muted-foreground hover:text-foreground border-b border-border hover:border-foreground pb-1 transition-smooth inline-flex items-center gap-2"
            >
              {isEnglish ? "Read all reviews on Trustpilot" : "Leggi tutte le recensioni su Trustpilot"} <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
