const Section = ({ title, children }: any) => (
  <section className="mb-8">
    <h2 className="font-serif-display text-2xl mb-3 text-primary">{title}</h2>
    <div className="text-sm leading-relaxed text-muted-foreground space-y-3">{children}</div>
  </section>
);

const LegalLayout = ({ title, lastUpdate, children }: any) => (
  <div className="container max-w-4xl py-16">
    <div className="text-xs uppercase tracking-[0.3em] text-accent font-semibold mb-3">Documento legale</div>
    <h1 className="font-serif-display text-4xl md:text-5xl mb-2">{title}</h1>
    <p className="text-xs text-muted-foreground mb-10">Ultimo aggiornamento: {lastUpdate}</p>
    <div className="prose prose-sm max-w-none">{children}</div>
  </div>
);

export const Privacy = () => (
  <LegalLayout title="Privacy Policy" lastUpdate="16 giugno 2026">
    <Section title="1. Titolare del trattamento">
      <p>Federico Volontè (di seguito "Titolare"), con sede legale in via cascina restelli 18, Limido Comasco (CO). Email: studio.v4@outlook.com. PEC: Federico.volonte@pec.it.</p>
    </Section>
    <Section title="2. Base giuridica e finalità">
      <p>Trattiamo i dati personali ai sensi del Regolamento (UE) 2016/679 (GDPR), del D.Lgs. 196/2003 e ss.mm.ii. e in conformità ai provvedimenti del Garante per la Protezione dei Dati Personali. Finalità: gestione richieste di vendita/contatto, adempimenti contrattuali e fiscali, sicurezza del sito.</p>
    </Section>
    <Section title="3. Dati raccolti">
      <p>Dati anagrafici e di contatto (nome, email, telefono, città), dati relativi al veicolo proposto, immagini caricate. Non raccogliamo categorie particolari di dati ex art. 9 GDPR.</p>
    </Section>
    <Section title="4. Conservazione">
      <p>I dati delle richieste sono conservati per 24 mesi dal contatto, salvo obblighi di legge superiori (es. fatturazione: 10 anni ex art. 2220 c.c.).</p>
    </Section>
    <Section title="5. Diritti dell'interessato">
      <p>Diritti ex artt. 15-22 GDPR: accesso, rettifica, cancellazione, limitazione, portabilità, opposizione. Reclamo all'Autorità Garante (www.gpdp.it).</p>
    </Section>
    <Section title="6. Trasferimento dati">
      <p>I dati sono ospitati su server UE (Supabase, Francoforte). Nessun trasferimento extra-SEE senza adeguate garanzie ex Cap. V GDPR.</p>
    </Section>
    <Section title="7. AI Act">
      <p>Il sito non utilizza sistemi di IA ad alto rischio ai sensi del Regolamento UE 2024/1689 (AI Act). Non vengono effettuati profilazione automatizzata o decisioni automatizzate ex art. 22 GDPR.</p>
    </Section>
  </LegalLayout>
);

export const CookiePolicy = () => (
  <LegalLayout title="Cookie Policy" lastUpdate="16 giugno 2026">
    <Section title="Cosa sono i cookie">
      <p>I cookie sono piccoli file di testo memorizzati sul tuo dispositivo. Questo sito utilizza esclusivamente cookie tecnici, conformemente al provvedimento del Garante Privacy del 10/06/2021 ("Linee guida cookie") e all'art. 122 del Codice Privacy.</p>
    </Section>
    <Section title="Cookie utilizzati">
      <p><strong>Tecnici/funzionali</strong>: necessari per la navigazione (sessione, preferenza consenso cookie). Non richiedono consenso preventivo.</p>
      <p><strong>Profilazione/marketing</strong>: NON utilizzati.</p>
      <p><strong>Analytics di terze parti</strong>: NON utilizzati.</p>
    </Section>
    <Section title="Gestione del consenso">
      <p>Puoi modificare le tue preferenze in qualsiasi momento eliminando i cookie dal tuo browser.</p>
    </Section>
  </LegalLayout>
);

export const Terms = () => (
  <LegalLayout title="Termini e Condizioni" lastUpdate="16 giugno 2026">
    <Section title="1. Oggetto">
      <p>Il sito v4.it è una vetrina informativa di veicoli storici e da collezione. Non costituisce offerta al pubblico ex art. 1336 c.c. La compravendita avviene esclusivamente in presenza, presso la sede o luogo concordato.</p>
    </Section>
    <Section title="2. Veicoli storici">
      <p>I veicoli proposti possono essere classificati come "storici" ai sensi dell'art. 60 del Codice della Strada (D.Lgs. 285/1992) se ultratrentennali e/o iscritti ai registri ASI, FMI, Lancia, Alfa Romeo, Storico Fiat, FIVA. La certificazione storica è dichiarata caso per caso nella scheda veicolo.</p>
    </Section>
    <Section title="3. Garanzie">
      <p>Garanzia legale di conformità ex artt. 128 ss. Codice del Consumo (D.Lgs. 206/2005), come modificato dal D.Lgs. 170/2021 in attuazione della Direttiva UE 2019/771: 12 mesi per veicoli usati. Per veicoli venduti tra privati o nell'ambito di permute si applicano le norme civilistiche (artt. 1490 ss. c.c.).</p>
    </Section>
    <Section title="4. Diritto di recesso">
      <p>L'art. 59 lett. a) del Codice del Consumo esclude il recesso per beni confezionati su misura o personalizzati e, nella prassi, per veicoli usati ritirati in presenza dopo prova su strada e ispezione.</p>
    </Section>
    <Section title="5. Foro competente">
      <p>Per i consumatori: foro di residenza/domicilio ex art. 66-bis Codice del Consumo. Negli altri casi: foro di competenza della sede del Titolare.</p>
    </Section>
  </LegalLayout>
);

export const LegalNotes = () => (
  <LegalLayout title="Note Legali" lastUpdate="16 giugno 2026">
    <Section title="Identificazione">
      <p>Sito gestito da Federico Volontè. Sede legale: via cascina restelli 18, Limido Comasco (CO). P.IVA 03849530138 - C.F. VLNFRC82L05B639E. PEC: Federico.volonte@pec.it.</p>
    </Section>
    <Section title="Proprietà intellettuale">
      <p>Tutti i contenuti, marchi, immagini e testi sono protetti da diritti di proprietà intellettuale ex L. 633/1941 e D.Lgs. 30/2005. Riproduzione vietata senza autorizzazione scritta.</p>
    </Section>
    <Section title="Trasparenza commerciale">
      <p>Le inserzioni rispettano gli obblighi di trasparenza previsti dal Codice del Consumo e dal D.Lgs. 70/2003 sul commercio elettronico. I prezzi indicati sono comprensivi di IVA salvo diversa indicazione.</p>
    </Section>
    <Section title="ODR — Risoluzione controversie online">
      <p>Ai sensi del Reg. UE 524/2013, è disponibile la piattaforma ODR della Commissione Europea: <a href="https://ec.europa.eu/consumers/odr" className="text-accent underline">ec.europa.eu/consumers/odr</a>.</p>
    </Section>
  </LegalLayout>
);
