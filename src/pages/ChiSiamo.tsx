import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Search, Stamp, Car as CarIcon, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
};

const ChiSiamo = () => (
  <>
    {/* HERO */}
    <section className="relative bg-foreground text-background overflow-hidden">
      <div aria-hidden className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
      <div aria-hidden className="absolute -bottom-12 -right-10 font-serif-display text-[16rem] leading-none text-background/[0.04] select-none pointer-events-none hidden lg:block">
        V4
      </div>
      <div className="container relative py-24 md:py-36">
        <motion.div {...fadeUp} transition={{ duration: 0.7 }}>
          <div className="hairline text-background/60 mb-6 flex items-center gap-3">
            <span className="w-6 h-px bg-brand-red" />
            Chi siamo — il significato di V4
            <span className="w-2 h-2 rounded-full bg-brand-blue ml-2" />
          </div>
          <h1 className="font-serif-display font-light text-5xl md:text-7xl lg:text-8xl leading-[0.95] mb-8 max-w-4xl">
            Quattro <em className="text-background/60">V</em>.<br />
            Un'unica visione.
          </h1>
          <p className="text-background/75 max-w-2xl text-lg font-light leading-relaxed">
            V4 non è un semplice portale di veicoli usati. È ricerca, selezione, perizia e
            divulgazione di pezzi che rappresentano stile, design e qualità artigianale dei decenni passati.
          </p>
        </motion.div>
      </div>
    </section>

    {/* LE 4 V */}
    <section className="relative py-20 md:py-28 bg-background overflow-hidden">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-px bg-border border border-border">
          {[
            {
              k: "V di… Volontè",
              icon: Stamp,
              accent: "red",
              lead: "Federico Volontè — classe 1982, Perito Arbitro internazionale per la valutazione dei veicoli.",
              body: "Collezionista, appassionato di storia dell'automobilismo, Giudice ai concorsi d'eleganza e restauratore. Con il suo Team collabora con le più importanti Case d'asta internazionali, Musei, gallerie, grandi collezionisti e appassionati privati. Presidente, consigliere e fondatore di Club di veicoli d'epoca a livello Nazionale ed internazionale. Special guest a congressi, conferenze ed eventi di settore. Nel 2025 fonda con Riccardo Baruffaldi il canale social Artedeimotori.",
              quote: "\"Tutte le auto hanno pari dignità, ma diverso valore.\"",
              bullets: ["Perito Arbitro internazionale", "Giudice concorsi d'eleganza", "Co-fondatore Artedeimotori (2025)"],
            },
            {
              k: "V di… Vintage",
              icon: Search,
              accent: "blue",
              lead: "Pezzi rari con almeno 20 anni di storia: aerei, motociclette, autovetture.",
              body: "V4 cerca, seleziona e racconta veicoli che hanno fatto stile, design e qualità artigianale. Hunting di pezzi rari, studio per valore storico e firma, completamento del percorso documentale (CRS, C.I. Targa ORO, Perizia valutativa). Solo i veicoli meritevoli vengono pubblicati. Vivere il veicolo Vintage è una scelta di stile contro la fast fashion e un atto ecologico di economia circolare.",
              quote: "Una scelta di stile contro la fast fashion. Un atto di economia circolare.",
              bullets: ["Hunting di pezzi rari", "Selezione per valore storico", "Completamento documentale"],
            },
            {
              k: "V di… Vehicles",
              icon: CarIcon,
              accent: "red",
              lead: "Veicoli di interesse storico e collezionistico — indipendentemente dal valore intrinseco.",
              body: "Il focus di V4 sono tutti i veicoli che, indipendentemente dal valore di mercato, hanno una storia da raccontare e meritano pubblicazione: ai fini divulgativi tramite il canale social Artedeimotori, e ai fini di compravendita su queste pagine. Dalla fine dell'Ottocento agli anni ruggenti, dal Liberty alla Dolce Vita, fino ai tempi moderni.",
              quote: "Dalla fine dell'Ottocento agli anni ruggenti, dal Liberty alla Dolce Vita.",
              bullets: ["Auto, moto e aerei storici", "Divulgazione su Artedeimotori", "Compravendita su V4"],
            },
            {
              k: "V di… Verified",
              icon: BadgeCheck,
              accent: "blue",
              lead: "Ogni veicolo pubblicato è verificato e periziato dal Team Volontè.",
              body: "Una Perizia valutativa è un accertamento tecnico fondamentale che determina valore di mercato, stato d'uso ed eventuali danni. Strumento indispensabile per risarcimenti assicurativi equi, compravendite tra privati sicure, valutazione di un veicolo storico, controversie legali, eredità, successioni, divorzi. Il Team V4 opera su tutto il territorio europeo e nordamericano, previo accordi.",
              quote: "Solo un veicolo conforme alla nostra linea guida può essere pubblicato.",
              bullets: ["Perizia valutativa completa", "Operativi in Europa e Nord America", "Su appuntamento"],
            },
          ].map((v, i) => (
            <motion.article
              key={v.k}
              {...fadeUp}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="bg-background p-8 md:p-12 group hover:bg-secondary/30 transition-smooth relative"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="hairline text-muted-foreground flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${v.accent === "red" ? "bg-brand-red" : "bg-brand-blue"}`} />
                  {v.k}
                </div>
                <v.icon className={`w-6 h-6 ${v.accent === "red" ? "text-brand-red" : "text-brand-blue"} group-hover:rotate-6 transition-smooth`} strokeWidth={1.25} />
              </div>
              <p className="font-serif-display text-2xl md:text-3xl leading-snug mb-5">{v.lead}</p>
              <p className="text-muted-foreground font-light leading-relaxed mb-6">{v.body}</p>
              <p className={`italic text-sm font-light border-l-2 pl-4 mb-6 ${v.accent === "red" ? "border-brand-red" : "border-brand-blue"}`}>
                {v.quote}
              </p>
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
            <Link to="/vendi">Proponi la tua auto <ArrowRight className="ml-3 w-4 h-4" /></Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-none border-foreground/20 px-8 h-12">
            <Link to="/contatti">Contattaci <ArrowRight className="ml-3 w-4 h-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  </>
);

export default ChiSiamo;
