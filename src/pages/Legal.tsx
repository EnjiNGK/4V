import type { ReactNode } from "react";
import { OWNER_INFO } from "@/lib/ownerInfo";

const LAST_UPDATE = "13 maggio 2026";

const Section = ({ title, children, id }: { title: string; children: ReactNode; id?: string }) => (
  <section className="mb-8" id={id}>
    <h2 className="font-serif-display text-2xl mb-3 text-primary">{title}</h2>
    <div className="text-sm leading-relaxed text-muted-foreground space-y-3">{children}</div>
  </section>
);

const LegalLayout = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="container max-w-4xl py-16">
    <div className="text-xs uppercase tracking-[0.3em] text-accent font-semibold mb-3">Documento legale</div>
    <h1 className="font-serif-display text-4xl md:text-5xl mb-2">{title}</h1>
    <p className="text-xs text-muted-foreground mb-10">Ultimo aggiornamento: {LAST_UPDATE}</p>
    <div className="prose prose-sm max-w-none">{children}</div>
  </div>
);

export const Privacy = () => (
  <LegalLayout title="Privacy Policy (informativa ex art. 13 GDPR)">
    <Section title="1. Titolare del trattamento">
      <p>
        Il titolare del trattamento è <strong>{OWNER_INFO.legalName}</strong>, con sede legale in {OWNER_INFO.fullAddress},
        P.IVA {OWNER_INFO.piva}, C.F. {OWNER_INFO.cf}. Contatti: PEC{" "}
        <a href={`mailto:${OWNER_INFO.pec}`} className="text-accent underline">
          {OWNER_INFO.pec}
        </a>
        , telefono {OWNER_INFO.phoneDisplay}.
      </p>
    </Section>
    <Section title="2. Finalità, basi giuridiche e natura del conferimento">
      <p>
        I dati personali sono trattati nel rispetto del Regolamento (UE) 2016/679 (&quot;GDPR&quot;), del D.Lgs. 196/2003 come
        modificato dal D.Lgs. 101/2018 (&quot;Codice Privacy&quot;) e dei provvedimenti del Garante per la protezione dei dati
        personali.
      </p>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <strong>Risposta a richieste di contatto / informazioni</strong> (modulo contatti): base giuridica art. 6(1)(b) GDPR
          (misure precontrattuali su richiesta dell&apos;interessato) e, ove applicabile, art. 6(1)(f) (legittimo interesse a
          gestire la corrispondenza).
        </li>
        <li>
          <strong>Gestione proposte di vendita veicolo</strong> (modulo &quot;Proponi la tua auto&quot;, inclusi allegati e
          immagini): art. 6(1)(b) GDPR; ove necessario adempimenti precontrattuali/contrattuali e gestione della pratica.
        </li>
        <li>
          <strong>Adempimenti contabili, fiscali e di legge</strong>: art. 6(1)(c) GDPR.
        </li>
        <li>
          <strong>Sicurezza del sito e prevenzione abusi</strong> (log tecnici, rate limiting lato fornitore): art. 6(1)(f)
          GDPR, previo bilanciamento con i diritti dell&apos;interessato.
        </li>
      </ul>
      <p>
        Il conferimento dei dati contrassegnati come obbligatori nei moduli è necessario per dare seguito alla richiesta; il
        mancato conferimento comporta l&apos;impossibilità di evadere la pratica.
      </p>
    </Section>
    <Section title="3. Categorie di dati trattati">
      <p>
        Dati identificativi e di contatto (nome, cognome o ragione sociale, email, telefono, eventuale città), dati relativi al
        veicolo proposto, descrizioni libere, documentazione allegata, immagini. <strong>Non</strong> sono raccolte, salvo
        invio spontaneo e non richiesto, categorie particolari di dati ex art. 9 GDPR.
      </p>
    </Section>
    <Section title="4. Modalità del trattamento">
      <p>
        Il trattamento avviene con strumenti informatici e telematici, secondo logiche correlate alle finalità indicate e con
        adozione di misure tecniche e organizzative adeguate ex art. 32 GDPR (controllo degli accessi, connessioni cifrate,
        policy di conservazione).
      </p>
    </Section>
    <Section title="5. Destinatari e responsabili del trattamento (art. 28 GDPR)">
      <p>
        I dati possono essere trattati da personale autorizzato del Titolare e da fornitori di servizi nominati responsabili
        del trattamento, tra cui in particolare:
      </p>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <strong>Supabase Inc.</strong> (hosting database, autenticazione amministratori, storage file) — dati in regione UE
          (Francoforte) per il progetto configurato. Informativa:{" "}
          <a href="https://supabase.com/privacy" className="text-accent underline" target="_blank" rel="noopener noreferrer">
            supabase.com/privacy
          </a>
          .
        </li>
        <li>
          <strong>EmailJS</strong> (invio messaggi email dal browser) — trattamento necessario all&apos;inoltro delle
          richieste. I dati possono transitare verso paesi terzi in base alle clausole contrattuali tipo approvate dalla
          Commissione UE o altre garanzie ex Cap. V GDPR. Informativa:{" "}
          <a href="https://www.emailjs.com/legal/privacy-policy/" className="text-accent underline" target="_blank" rel="noopener noreferrer">
            emailjs.com/legal/privacy-policy
          </a>
          .
        </li>
      </ul>
    </Section>
    <Section title="6. Conservazione">
      <p>
        I dati delle richieste commerciali/generic sono conservati per il tempo necessario a gestire la pratica e, comunque,
        per non oltre <strong>24 mesi</strong> dall&apos;ultimo contatto attivo, salvo obblighi di legge superiori (es.
        conservazione documenti contabili fino a 10 anni).
      </p>
    </Section>
    <Section title="7. Trasferimenti verso paesi terzi">
      <p>
        Ove i fornitori trattino dati al di fuori dello Spazio Economico Europeo, il trasferimento avviene sulla base di
        decisioni di adeguatezza della Commissione UE o delle Clausole Contrattuali Tipo (SCC) ex art. 46 GDPR, o altre
        garanzie previste dal Cap. V GDPR.
      </p>
    </Section>
    <Section title="8. Diritti dell'interessato (artt. 15–22 GDPR)">
      <p>
        L&apos;interessato può esercitare i diritti di accesso, rettifica, cancellazione (&quot;diritto all&apos;oblio&quot;),
        limitazione del trattamento, portabilità e opposizione, nei limiti e alle condizioni previste dal GDPR, rivolgendosi
        al Titolare ai recapiti sopra indicati (preferibilmente via PEC).
      </p>
      <p>
        È inoltre possibile proporre reclamo all&apos;Autorità Garante per la protezione dei dati personali (
        <a href="https://www.gpdp.it" className="text-accent underline" target="_blank" rel="noopener noreferrer">
          www.gpdp.it
        </a>
        ).
      </p>
    </Section>
    <Section title="9. Decisioni automatizzate e profilazione">
      <p>
        Non sono effettuate decisioni interamente automatizzate che producano effetti giuridici o incidano in modo analogo
        significativamente sull&apos;interessato ex art. 22 GDPR. Non è attivo profilamento ai fini di marketing automatizzato.
      </p>
    </Section>
    <Section title="10. Regolamento (UE) 2024/1689 (AI Act)">
      <p>
        Il presente sito non impiega, alla data dell&apos;ultimo aggiornamento, sistemi di intelligenza artificiale classificati
        come ad alto rischio ai sensi del Regolamento (UE) 2024/1689, né moduli generativi integrati nelle funzioni di
        contatto o vendita.
      </p>
    </Section>
    <Section title="11. Minori">
      <p>
        I servizi non sono destinati a minori di 14 anni. Se venissero trattati dati di minori per errore, il Titolare
        provvederà alla loro cancellazione su segnalazione.
      </p>
    </Section>
  </LegalLayout>
);

export const CookiePolicy = () => (
  <LegalLayout title="Cookie Policy e tecnologie di memorizzazione locale">
    <Section title="1. Quadro normativo">
      <p>
        In conformità al Provvedimento del Garante del 10 giugno 2021 (&quot;Linee guida cookie e altri strumenti di
        tracciamento&quot;) e all&apos;art. 122 del Codice Privacy, si descrivono i cookie e le tecnologie analoghe utilizzate
        su questo sito.
      </p>
    </Section>
    <Section title="2. Cookie e memorizzazioni utilizzate">
      <p>
        <strong>Cookie / storage tecnici strettamente necessari</strong>
      </p>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <strong>Preferenza lingua</strong> (<code className="text-foreground">localStorage</code>, chiave{" "}
          <code className="text-foreground">v4-language</code>): memorizza la scelta italiano/inglese; durata persistente fino
          a cancellazione manuale.
        </li>
        <li>
          <strong>Consenso informativo cookie</strong> (<code className="text-foreground">localStorage</code>, chiave{" "}
          <code className="text-foreground">autonobile-cookie-consent-v1</code>): memorizza la risposta al banner; durata
          persistente fino a cancellazione manuale.
        </li>
        <li>
          <strong>Sessione amministratore Supabase</strong> (<code className="text-foreground">localStorage</code>, chiavi
          prefisso <code className="text-foreground">sb-</code> e suffisso <code className="text-foreground">-auth-token</code>
          ): necessarie per l&apos;accesso riservato al pannello di gestione; durata legata alla sessione e al rinnovo token
          gestito dal fornitore.
        </li>
      </ul>
      <p>
        <strong>Cookie di profilazione / marketing di terze parti</strong>: <strong>non</strong> sono utilizzati.
      </p>
      <p>
        <strong>Strumenti di analytics di terze parti</strong> (es. Google Analytics): <strong>non</strong> sono integrati
        alla data dell&apos;ultimo aggiornamento.
      </p>
    </Section>
    <Section title="3. Gestione delle preferenze">
      <p>
        È possibile cancellare o bloccare cookie e dati in <code className="text-foreground">localStorage</code> attraverso
        le impostazioni del proprio browser. La disabilitazione dei cookie tecnici può compromettere alcune funzioni (es.
        login amministratore o preferenza lingua).
      </p>
    </Section>
  </LegalLayout>
);

export const Terms = () => (
  <LegalLayout title="Termini e Condizioni d'uso del sito">
    <Section title="1. Oggetto e accettazione">
      <p>
        Le presenti condizioni regolano l&apos;accesso e l&apos;utilizzo del sito web V4 (&quot;Vintage Vehicles
        Verified&quot;) e dei servizi informativi ivi offerti. La navigazione e l&apos;invio di moduli comportano la
        conoscenza e l&apos;integrale accettazione delle presenti condizioni e dell&apos;informativa privacy.
      </p>
    </Section>
    <Section title="2. Natura del servizio">
      <p>
        Il sito ha finalità prevalentemente <strong>promozionali e informative</strong> (catalogo veicoli, presentazione
        attività, raccolta contatti). Le schede veicolo non costituiscono offerta al pubblico ai sensi dell&apos;art. 1336
        c.c.; ogni trattativa commerciale è svolta autonomamente secondo accordi esterni al mero utilizzo del sito.
      </p>
    </Section>
    <Section title="3. Veicoli storici e documentazione">
      <p>
        Le informazioni su eventuali iscrizioni a registri storici (ASI, FMI, FIVA, ecc.) sono fornite a titolo dichiarativo
        e vanno verificate in sede contrattuale. Riferimenti normativi sulle categorie di veicoli: Codice della Strada (D.Lgs.
        285/1992) e normativa speciale applicabile.
      </p>
    </Section>
    <Section title="4. Rapporti con i consumatori">
      <p>
        Ove applicabile il Codice del Consumo (D.Lgs. 206/2005 e s.m.i., incluso D.Lgs. 170/2021 di attuazione della Direttiva
        UE 2019/771), il consumatore beneficia dei diritti ivi previsti, inclusa la garanzia legale di conformità per i beni
        di secondo mano, nei limiti e alle condizioni di legge.
      </p>
    </Section>
    <Section title="5. Esclusione di responsabilità (limiti di legge)">
      <p>
        Il Titolare si impegna a mantenere aggiornati i contenuti in buona fede ma non garantisce l&apos;assenza di errori
        materiali o temporanee indisponibilità tecniche. Fatto salvo quanto inderogabile per legge, non risponde per danni
        indiretti o perdita di profitto derivanti dall&apos;uso o dall&apos;impossibilità di usare il sito.
      </p>
    </Section>
    <Section title="6. Proprietà intellettuale">
      <p>
        Testi, marchi, loghi, layout e database (ove applicabile) sono tutelati dalla normativa italiana ed europea in
        materia di proprietà industriale e diritto d&apos;autore. È vietata la riproduzione non autorizzata.
      </p>
    </Section>
    <Section title="7. Foro competente">
      <p>
        Per i consumatori residenti in UE si applica il foro di cui all&apos;art. 66-bis Codice del Consumo, ove applicabile.
        Per le controversie diverse, foro italiano territorialmente competente secondo le norme processuali vigenti.
      </p>
    </Section>
  </LegalLayout>
);

export const LegalNotes = () => (
  <LegalLayout title="Note Legali e Informazioni ex D.Lgs. 70/2003">
    <Section title="1. Identificazione del prestatore di servizi della società dell'informazione">
      <p>
        Il sito è gestito da <strong>{OWNER_INFO.legalName}</strong>, con sede in {OWNER_INFO.fullAddress}, P.IVA{" "}
        {OWNER_INFO.piva}, C.F. {OWNER_INFO.cf}. Recapiti: telefono {OWNER_INFO.phoneDisplay}; PEC{" "}
        <a href={`mailto:${OWNER_INFO.pec}`} className="text-accent underline">
          {OWNER_INFO.pec}
        </a>
        .
      </p>
    </Section>
    <Section title="2. Proprietà intellettuale e marchi">
      <p>
        Il marchio &quot;V4&quot; e i relativi segni distintivi sono di titolarità del Titolare o utilizzati su licenza. I
        contenuti sono protetti dalla L. 633/1941 e dal D.Lgs. 30/2005 (Codice della proprietà industriale), salvo diversa
        indicazione per immagini di terzi.
      </p>
    </Section>
    <Section title="3. Trasparenza commerciale e prezzi">
      <p>
        I prezzi indicati nelle schede veicolo — ove presenti — sono espressi in euro e si intendono IVA inclusa salvo
        diversa e chiara indicazione contraria, in conformità agli obblighi informativi precontrattuali di cui al Codice del
        Consumo e al D.Lgs. 70/2003 in materia di commercio elettronico, nei limiti di applicabilità.
      </p>
    </Section>
    <Section title="4. Piattaforma ODR (risoluzione controversie online)">
      <p>
        Ai sensi del Regolamento (UE) n. 524/2013, per la risoluzione extragiudiziale delle controversie relative a contratti
        online con consumatori è disponibile la piattaforma ODR della Commissione Europea:{" "}
        <a href="https://ec.europa.eu/consumers/odr" className="text-accent underline" target="_blank" rel="noopener noreferrer">
          https://ec.europa.eu/consumers/odr
        </a>
        .
      </p>
    </Section>
    <Section title="5. Servizi della società dell'informazione — Regolamento (UE) 2022/2065 (DSA)" id="segnalazioni-contenuti">
      <p>
        Il Titolare, nella misura in cui ricorra la qualifica di prestatore di servizi di hosting o intermediario ai sensi
        del Regolamento (UE) 2022/2065 (&quot;Digital Services Act&quot;), rispetta gli obblighi di trasparenza e di gestione
        delle segnalazioni di contenuti illegali.
      </p>
      <p>
        <strong>Segnalazione contenuti ritenuti illegali</strong>: è possibile inviare una segnalazione motivata — con
        indicazione degli estremi del contenuto e dei fatti — tramite PEC a{" "}
        <a href={`mailto:${OWNER_INFO.pec}`} className="text-accent underline">
          {OWNER_INFO.pec}
        </a>{" "}
        oppure tramite il modulo di contatto presente sul sito, selezionando un oggetto che consenta di identificare la
        richiesta come segnalazione ex DSA. Le segnalazioni manifestamente infondate o abusive potranno essere rigettate.
      </p>
      <p>
        Per le richieste delle autorità di polizia e giudiziarie valgono i canali istituzionali e le procedure previste dalla
        legge italiana e dall&apos;Unione Europea.
      </p>
    </Section>
    <Section title="6. Legge applicabile">
      <p>
        Salvo norme imperative inderogabili a tutela dei consumatori, il rapporto giuridico derivante dall&apos;uso del sito
        è regolato dalla legge italiana.
      </p>
    </Section>
  </LegalLayout>
);
