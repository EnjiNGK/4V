import { Seo } from "@/components/Seo";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  ExternalLink,
  FileCheck,
  Library,
  QrCode,
  Scale,
  ShieldCheck,
  Users,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import { OWNER_INFO } from "@/lib/ownerInfo";
import { CERTISHIELD } from "@/lib/certishield";

const fade = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
};

const CertificazioneDigitale = () => {
  const { isEnglish } = useLanguage();
  const t = (it: string, en: string) => (isEnglish ? en : it);

  const steps = [
    {
      n: "01",
      icon: BadgeCheck,
      title: t("Emissione del libretto digitale", "Issuance of the digital logbook"),
      body: t(
        "Il professionista certificato (perito, restauratore, museo o concessionario) compila la scheda CertiShield del veicolo: identità, descrizioni, foto, video, documenti, perizie e storico dei restauri.",
        "A certified professional (appraiser, restorer, museum or dealer) compiles the CertiShield record of the vehicle: identity, descriptions, photos, videos, documents, appraisals and restoration history.",
      ),
    },
    {
      n: "02",
      icon: ShieldCheck,
      title: t("Certificazione su blockchain", "Blockchain certification"),
      body: t(
        "Il libretto digitale viene notarizzato tramite CertiShield, generando un Digital Vehicle Passport (DVP) immutabile. Ogni dato resta inalterabile e verificabile nel tempo.",
        "The digital logbook is notarized through CertiShield, generating an immutable Digital Vehicle Passport (DVP). Every piece of data remains tamper-proof and verifiable over time.",
      ),
    },
    {
      n: "03",
      icon: QrCode,
      title: t("Accesso pubblico con QR", "Public QR access"),
      body: t(
        "Il proprietario (e i suoi interlocutori: acquirenti, assicurazioni, eventi) consultano il DVP scansionando il QR o aprendo il link. Il certificato segue la vettura anche al cambio di proprietà.",
        "The owner (and their counterparts: buyers, insurers, events) access the DVP by scanning the QR or opening the link. The certificate stays with the vehicle even when ownership changes.",
      ),
    },
  ];

  const benefits = [
    {
      icon: ShieldCheck,
      title: t("Per il collezionista", "For collectors"),
      body: t(
        "Tutela permanente del valore della vettura: stato, perizie e restauri attestati su blockchain, condivisibili in pochi secondi con acquirenti e compagnie assicurative.",
        "Permanent protection of the car's value: condition, appraisals and restorations attested on blockchain, shareable in seconds with buyers and insurers.",
      ),
    },
    {
      icon: Users,
      title: t("Per l'acquirente", "For buyers"),
      body: t(
        "Verifica indipendente di storia, perizie e matching numbers prima dell'acquisto. Riduce drasticamente il rischio di frode e manomissioni del chilometraggio o dei documenti.",
        "Independent verification of history, appraisals and matching numbers before purchase. Dramatically reduces fraud risk on mileage or documents.",
      ),
    },
    {
      icon: Wrench,
      title: t("Per il restauratore", "For restorers"),
      body: t(
        "Ogni fase di restauro viene documentata e certificata: garanzia di trasparenza sul lavoro svolto e tutela della propria firma professionale.",
        "Every restoration phase is documented and certified: transparency on the work performed and protection of the professional's signature.",
      ),
    },
    {
      icon: Scale,
      title: t("Per perito e assicurazione", "For appraisers & insurers"),
      body: t(
        "Le perizie emesse via CertiShield non sono modificabili né contestabili: maggiore affidabilità delle valutazioni, polizze più accurate, meno contenzioso.",
        "Appraisals issued through CertiShield cannot be altered or disputed: more reliable valuations, more accurate policies, less litigation.",
      ),
    },
  ];

  return (
    <div className="bg-background">
      <Seo
        title={t("CertiShield — Passaporto digitale su blockchain per auto storiche | V4", "CertiShield — Blockchain Digital Vehicle Passport for classic cars | V4")}
        description={t("Scopri CertiShield, la piattaforma italiana di KNOBS che notarizza su blockchain il Digital Vehicle Passport (DVP) di auto storiche e da collezione: perizie, restauri e documenti immutabili e verificabili via QR.", "Discover CertiShield, the Italian KNOBS platform notarizing the Digital Vehicle Passport (DVP) for classic cars on blockchain: appraisals, restorations and documents immutable and QR-verifiable.")}
        path="/certificazione-digitale"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "CertiShield Digital Vehicle Passport",
          provider: { "@type": "Organization", name: "V4 Vintage Verified" },
          areaServed: "IT",
          serviceType: "Blockchain vehicle certification",
        }}
      />
      {/* HERO */}
      <section className="relative overflow-hidden bg-foreground text-background">
        <div aria-hidden className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
        <div aria-hidden className="absolute -top-32 -right-40 w-[36rem] h-[36rem] rounded-full bg-brand-red/20 blur-3xl pointer-events-none" />
        <div aria-hidden className="absolute -bottom-32 -left-40 w-[36rem] h-[36rem] rounded-full bg-brand-blue/25 blur-3xl pointer-events-none" />

        <div className="container relative py-24 md:py-32">
          <motion.div {...fade} className="max-w-3xl">
            <div className="hairline text-background/60 mb-5 flex items-center gap-3">
              <span className="w-6 h-px bg-brand-red" />
              CertiShield · Blockchain DVP
              <span className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
              {t("Powered by KNOBS", "Powered by KNOBS")}
            </div>
            <h1 className="font-serif-display font-light text-5xl md:text-7xl leading-[1.02] mb-7">
              {t("Il passaporto digitale", "The digital passport")}
              <br />
              <em className="text-background/55">
                {t("delle auto storiche", "for classic cars")}
              </em>
            </h1>
            <p className="text-lg text-background/75 font-light leading-relaxed mb-10 max-w-2xl">
              {t(
                "Ogni vettura affidata a V4 può essere certificata su CertiShield, la piattaforma italiana che notarizza su blockchain il Digital Vehicle Passport (DVP): un libretto digitale immutabile per proteggere e valorizzare la storia di youngtimer, classic e d'epoca.",
                "Every car entrusted to V4 can be certified on CertiShield, the Italian platform that notarizes the Digital Vehicle Passport (DVP) on blockchain: an immutable digital logbook to protect and enhance the history of youngtimers, classic and vintage cars.",
              )}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-none bg-brand-red text-white hover:bg-brand-red/90 px-8 h-12">
                <Link to="/contatti">
                  {t("Certifica la tua auto", "Certify your car")} <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-none border-background/40 bg-transparent text-background hover:bg-background hover:text-foreground px-8 h-12">
                <a href={CERTISHIELD.marketingUrl} target="_blank" rel="noreferrer">
                  {t("Sito ufficiale CertiShield", "Official CertiShield site")} <ExternalLink className="ml-2 w-4 h-4" />
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* COS'È */}
      <section className="container py-20 md:py-28">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <motion.div {...fade} className="lg:col-span-5">
            <div className="hairline text-muted-foreground mb-4 flex items-center gap-3">
              <span className="w-6 h-px bg-brand-red" />
              {t("Che cos'è CertiShield", "What is CertiShield")}
            </div>
            <h2 className="font-display text-3xl md:text-4xl leading-tight mb-6">
              {t(
                "Un libretto digitale immutabile, su blockchain.",
                "An immutable digital logbook, on blockchain.",
              )}
            </h2>
          </motion.div>
          <motion.div {...fade} className="lg:col-span-7 space-y-5 text-muted-foreground leading-relaxed">
            <p>
              {t(
                "CertiShield è la piattaforma sviluppata da KNOBS S.r.l. che sfrutta la tecnologia blockchain per certificare e preservare l'autenticità delle auto storiche. Ad ogni veicolo viene assegnato un Digital Vehicle Passport sicuro e verificabile, che conserva perizie, restauri, partecipazioni a eventi e documenti chiave in modo permanente e a prova di manomissione.",
                "CertiShield is the platform developed by KNOBS S.r.l. that leverages blockchain technology to certify and preserve the authenticity of classic cars. Each vehicle receives a secure, verifiable Digital Vehicle Passport storing appraisals, restorations, event participations and key documents permanently and tamper-proof.",
              )}
            </p>
            <p>
              {t(
                "Lo strumento è pensato per professionisti, collezionisti ed enti che vogliono salvaguardare la storia del veicolo nel tempo, garantendo trasparenza, autenticità e valore di mercato — anche al passaggio di proprietà.",
                "It is designed for professionals, collectors and institutions who want to safeguard the vehicle's history over time, ensuring transparency, authenticity and market value — even across ownership changes.",
              )}
            </p>
            <div className="pt-2">
              <a
                href={CERTISHIELD.brochureUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-accent hover:text-foreground border-b border-accent/40 hover:border-foreground pb-1 transition-smooth"
              >
                <FileCheck className="w-4 h-4" />
                {t("Scarica la brochure ufficiale (PDF)", "Download the official brochure (PDF)")}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* COME FUNZIONA */}
      <section className="bg-secondary/40 py-20 md:py-28">
        <div className="container">
          <motion.div {...fade} className="max-w-2xl mb-12">
            <div className="hairline text-muted-foreground mb-4 flex items-center gap-3">
              <span className="w-6 h-px bg-brand-red" />
              {t("Come funziona", "How it works")}
            </div>
            <h2 className="font-display text-3xl md:text-4xl leading-tight">
              {t(
                "Tre passi, un certificato immutabile.",
                "Three steps, one immutable certificate.",
              )}
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-px bg-border border border-border">
            {steps.map((s) => (
              <motion.div key={s.n} {...fade} className="bg-background p-8 md:p-10">
                <div className="flex items-center justify-between mb-5">
                  <span className="font-mono text-xs text-muted-foreground tracking-wider">{s.n}</span>
                  <s.icon className="w-6 h-6 text-brand-red" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-xl mb-3">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFICI */}
      <section className="container py-20 md:py-28">
        <motion.div {...fade} className="max-w-2xl mb-12">
          <div className="hairline text-muted-foreground mb-4 flex items-center gap-3">
            <span className="w-6 h-px bg-brand-red" />
            {t("Vantaggi", "Benefits")}
          </div>
          <h2 className="font-display text-3xl md:text-4xl leading-tight">
            {t("Trasparenza per ogni protagonista.", "Transparency for every stakeholder.")}
          </h2>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-6">
          {benefits.map((b) => (
            <motion.div
              key={b.title}
              {...fade}
              className="bg-card border border-border rounded-2xl p-7 shadow-card"
            >
              <b.icon className="w-7 h-7 text-brand-red mb-4" strokeWidth={1.5} />
              <h3 className="font-display text-xl mb-2">{b.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{b.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* NOTA LEGALE / CRS */}
      <section className="bg-foreground text-background py-16 md:py-20">
        <div className="container">
          <motion.div {...fade} className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-4">
              <div className="hairline text-background/60 mb-4 flex items-center gap-3">
                <span className="w-6 h-px bg-brand-red" />
                {t("Nota importante", "Important notice")}
              </div>
              <h2 className="font-display text-2xl md:text-3xl leading-tight">
                {t(
                  "CertiShield complementa, non sostituisce CRS / ASI / FIVA.",
                  "CertiShield complements, does not replace CRS / ASI / FIVA.",
                )}
              </h2>
            </div>
            <div className="lg:col-span-8 space-y-4 text-background/75 leading-relaxed text-sm">
              <p>
                {t(
                  "Il Certificato di Rilevanza Storica (CRS) rilasciato da ASI e i registri FIVA restano i documenti riconosciuti dalle autorità per agevolazioni fiscali, circolazione e iscrizione a manifestazioni ufficiali. Il Digital Vehicle Passport CertiShield è uno strumento aggiuntivo di trasparenza commerciale e tutela del valore: si affianca ai registri ufficiali, non li sostituisce.",
                  "The Certificate of Historic Relevance (CRS) issued by ASI and FIVA registers remain the documents recognised by authorities for tax incentives, circulation and official events. The CertiShield Digital Vehicle Passport is an additional commercial transparency and value-protection tool: it sits alongside official registers, it does not replace them.",
                )}
              </p>
              <p className="text-background/55 text-xs">
                {t(
                  `CertiShield™ è un marchio di KNOBS S.r.l. — V4 di ${OWNER_INFO.legalName} opera come showroom partner che propone la certificazione blockchain ai propri clienti.`,
                  `CertiShield™ is a trademark of KNOBS S.r.l. — V4 by ${OWNER_INFO.legalName} acts as a partner showroom offering the blockchain certification to its clients.`,
                )}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-20 md:py-28 text-center">
        <motion.div {...fade} className="max-w-2xl mx-auto">
          <Library className="w-10 h-10 text-brand-red mx-auto mb-6" strokeWidth={1.25} />
          <h2 className="font-display text-3xl md:text-4xl mb-5">
            {t("Vuoi certificare la tua vettura?", "Want to certify your car?")}
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            {t(
              "Contattaci: valutiamo la documentazione esistente, raccogliamo perizia e immagini con i nostri standard e attiviamo il Digital Vehicle Passport CertiShield. Il QR di verifica resterà legato alla vettura, anche oltre la vendita.",
              "Contact us: we review the existing documentation, gather the appraisal and images to our standard and activate the CertiShield Digital Vehicle Passport. The verification QR stays with the vehicle, even beyond the sale.",
            )}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild size="lg" className="rounded-none bg-brand-red text-white hover:bg-brand-red/90 px-8 h-12">
              <Link to="/contatti">
                {t("Richiedi la certificazione", "Request certification")} <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-none px-8 h-12">
              <Link to="/catalogo">
                {t("Vedi auto in catalogo", "Browse the catalog")}
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default CertificazioneDigitale;
