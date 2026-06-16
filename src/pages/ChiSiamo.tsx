import { Seo } from "@/components/Seo";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Search, Stamp, Car as CarIcon, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
};

const ChiSiamo = () => {
  const { isEnglish } = useLanguage();
  const cards = isEnglish
    ? [
        {
          k: "V for… Volontè",
          icon: Stamp,
          accent: "red",
          lead: "Federico Volontè — born 1982, international Arbiter Surveyor for vehicle valuation.",
          body: "Collector, automotive history enthusiast, Judge at concours d'élégance and restorer. With his Team he collaborates with the most important international auction houses, Museums, galleries, major collectors and private enthusiasts. President, board member and founder of historic vehicle Clubs at national and international level. Special guest at congresses, conferences and industry events. In 2025 he founds the social channel Artedeimotori with Riccardo Baruffaldi.",
          quote: "\"All cars have equal dignity, but different value.\"",
          bullets: ["International Arbiter Surveyor", "Concours d'élégance Judge", "Co-founder Artedeimotori (2025)"],
        },
        {
          k: "V for… Vintage",
          icon: Search,
          accent: "blue",
          lead: "Rare pieces with at least 20 years of history: aircraft, motorcycles, cars.",
          body: "V4 searches, selects and tells the story of vehicles that defined style, design and craftsmanship. Hunting of rare pieces, study of historical value and signature, completion of the documentary path (CRS, C.I. Targa ORO, valuation appraisal). Only worthy vehicles are published. Living the Vintage vehicle is a style choice against fast fashion and an ecological act of circular economy.",
          quote: "A style choice against fast fashion. An act of circular economy.",
          bullets: ["Rare pieces hunting", "Selection by historical value", "Documentary completion"],
        },
        {
          k: "V for… Vehicles",
          icon: CarIcon,
          accent: "red",
          lead: "Vehicles of historical and collector interest — regardless of their intrinsic value.",
          body: "V4's focus is all vehicles that, regardless of market value, have a story to tell and deserve publication: for educational purposes through the Artedeimotori social channel, and for buying/selling on these pages. From the late 1800s to the roaring years, from Liberty to Dolce Vita, up to modern times.",
          quote: "From the late 1800s to the roaring years, from Liberty to Dolce Vita.",
          bullets: ["Classic cars, motorcycles and aircraft", "Storytelling on Artedeimotori", "Buying and selling on V4"],
        },
        {
          k: "V for… Verified",
          icon: BadgeCheck,
          accent: "blue",
          lead: "Every published vehicle is verified and appraised by the Volontè Team.",
          body: "A valuation appraisal is a fundamental technical assessment that determines market value, condition and any damage. Indispensable tool for fair insurance reimbursements, safe transactions between private parties, valuation of a historic vehicle, legal disputes, inheritances, successions, divorces. The V4 Team operates throughout Europe and North America, by appointment.",
          quote: "Only a vehicle compliant with our guidelines can be published.",
          bullets: ["Complete valuation appraisal", "Operating in Europe and North America", "By appointment"],
        },
      ]
    : [
        { k: "V di… Volontè", icon: Stamp, accent: "red", lead: "Federico Volontè — classe 1982, Perito Arbitro internazionale per la valutazione dei veicoli.", body: "Collezionista, appassionato di storia dell'automobilismo, Giudice ai concorsi d'eleganza e restauratore. Con il suo Team collabora con le più importanti Case d'asta internazionali, Musei, gallerie, grandi collezionisti e appassionati privati. Presidente, consigliere e fondatore di Club di veicoli d'epoca a livello Nazionale ed internazionale. Special guest a congressi, conferenze ed eventi di settore. Nel 2025 fonda con Riccardo Baruffaldi il canale social Artedeimotori.", quote: "\"Tutte le auto hanno pari dignità, ma diverso valore.\"", bullets: ["Perito Arbitro internazionale", "Giudice concorsi d'eleganza", "Co-fondatore Artedeimotori (2025)"] },
        { k: "V di… Vintage", icon: Search, accent: "blue", lead: "Pezzi rari con almeno 20 anni di storia: aerei, motociclette, autovetture.", body: "V4 cerca, seleziona e racconta veicoli che hanno fatto stile, design e qualità artigianale. Hunting di pezzi rari, studio per valore storico e firma, completamento del percorso documentale (CRS, C.I. Targa ORO, Perizia valutativa). Solo i veicoli meritevoli vengono pubblicati. Vivere il veicolo Vintage è una scelta di stile contro la fast fashion e un atto ecologico di economia circolare.", quote: "Una scelta di stile contro la fast fashion. Un atto di economia circolare.", bullets: ["Hunting di pezzi rari", "Selezione per valore storico", "Completamento documentale"] },
        { k: "V di… Vehicles", icon: CarIcon, accent: "red", lead: "Veicoli di interesse storico e collezionistico — indipendentemente dal valore intrinseco.", body: "Il focus di V4 sono tutti i veicoli che, indipendentemente dal valore di mercato, hanno una storia da raccontare e meritano pubblicazione: ai fini divulgativi tramite il canale social Artedeimotori, e ai fini di compravendita su queste pagine. Dalla fine dell'Ottocento agli anni ruggenti, dal Liberty alla Dolce Vita, fino ai tempi moderni.", quote: "Dalla fine dell'Ottocento agli anni ruggenti, dal Liberty alla Dolce Vita.", bullets: ["Auto, moto e aerei storici", "Divulgazione su Artedeimotori", "Compravendita su V4"] },
        { k: "V di… Verified", icon: BadgeCheck, accent: "blue", lead: "Ogni veicolo pubblicato è verificato e periziato dal Team Volontè.", body: "Una Perizia valutativa è un accertamento tecnico fondamentale che determina valore di mercato, stato d'uso ed eventuali danni. Strumento indispensabile per risarcimenti assicurativi equi, compravendite tra privati sicure, valutazione di un veicolo storico, controversie legali, eredità, successioni, divorzi. Il Team V4 opera su tutto il territorio europeo e nordamericano, previo accordi.", quote: "Solo un veicolo conforme alla nostra linea guida può essere pubblicato.", bullets: ["Perizia valutativa completa", "Operativi in Europa e Nord America", "Su appuntamento"] },
      ];

  return (
    <>
      <Seo
        title="Chi siamo — Federico Volontè, Perito Arbitro internazionale | V4 Vintage Verified"
        description="V4 è il progetto di Federico Volontè, Perito Arbitro internazionale, giudice di concorsi d'eleganza e collezionista. Selezione, perizia e racconto di auto storiche e da collezione."
        path="/chi-siamo"
      />
      <section className="relative bg-foreground text-background overflow-hidden">
        <div aria-hidden className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
        <div aria-hidden className="absolute -bottom-12 -right-10 font-serif-display text-[16rem] leading-none text-background/[0.04] select-none pointer-events-none hidden lg:block">V4</div>
        <div className="container relative py-24 md:py-36">
          <motion.div {...fadeUp} transition={{ duration: 0.7 }}>
            <div className="hairline text-background/60 mb-6 flex items-center gap-3">
              <span className="w-6 h-px bg-brand-red" />
              {isEnglish ? "About — the meaning of V4" : "Chi siamo — il significato di V4"}
              <span className="w-2 h-2 rounded-full bg-brand-blue ml-2" />
            </div>
            <h1 className="font-serif-display font-light text-5xl md:text-7xl lg:text-8xl leading-[0.95] mb-8 max-w-4xl">
              {isEnglish ? <>Four <em className="text-background/60">V's</em>.<br />One vision.</> : <>Quattro <em className="text-background/60">V</em>.<br />Un'unica visione.</>}
            </h1>
            <p className="text-background/75 max-w-2xl text-lg font-light leading-relaxed">
              {isEnglish
                ? "V4 is not a simple used car portal. It is research, selection, appraisal and storytelling of pieces that represent style, design and craftsmanship of decades past."
                : "V4 non è un semplice portale di veicoli usati. È ricerca, selezione, perizia e divulgazione di pezzi che rappresentano stile, design e qualità artigianale dei decenni passati."}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="relative py-20 md:py-28 bg-background overflow-hidden">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-px bg-border border border-border">
            {cards.map((v, i) => (
              <motion.article key={v.k} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.08 }} className="bg-background p-8 md:p-12 group hover:bg-secondary/30 transition-smooth relative">
                <div className="flex items-start justify-between mb-6">
                  <div className="hairline text-muted-foreground flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${v.accent === "red" ? "bg-brand-red" : "bg-brand-blue"}`} />
                    {v.k}
                  </div>
                  <v.icon className={`w-6 h-6 ${v.accent === "red" ? "text-brand-red" : "text-brand-blue"} group-hover:rotate-6 transition-smooth`} strokeWidth={1.25} />
                </div>
                <p className="font-serif-display text-2xl md:text-3xl leading-snug mb-5">{v.lead}</p>
                <p className="text-muted-foreground font-light leading-relaxed mb-6">{v.body}</p>
                <p className={`italic text-sm font-light border-l-2 pl-4 mb-6 ${v.accent === "red" ? "border-brand-red" : "border-brand-blue"}`}>{v.quote}</p>
                <ul className="space-y-2 pt-5 border-t border-border">
                  {v.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle2 className={`w-4 h-4 ${v.accent === "red" ? "text-brand-red" : "text-brand-blue"}`} strokeWidth={1.5} />
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>

          <div className="mt-16 flex flex-col sm:flex-row gap-4 items-center justify-center text-center">
            <Button asChild size="lg" className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12">
              <Link to="/vendi">{isEnglish ? "Sell your car" : "Proponi la tua auto"} <ArrowRight className="ml-3 w-4 h-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-none border-foreground/20 px-8 h-12">
              <Link to="/contatti">{isEnglish ? "Contact us" : "Contattaci"} <ArrowRight className="ml-3 w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default ChiSiamo;
