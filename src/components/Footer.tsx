import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, ShieldCheck, Lock, FileCheck, Award, BadgeCheck } from "lucide-react";

export const Footer = () => (
  <footer className="mt-24 bg-[hsl(220_18%_10%)] text-[hsl(38_25%_94%)]">
    {/* TRUST STRIP — premium legal & compliance */}
    <div className="border-b border-white/10">
      <div className="container py-10 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 border border-white/10">
        {[
          { icon: ShieldCheck, t: "GDPR Compliant", d: "UE 2016/679" },
          { icon: Lock, t: "Pagamenti sicuri", d: "Bonifico tracciato" },
          { icon: FileCheck, t: "Documenti verificati", d: "Su ogni vettura" },
          { icon: Award, t: "Perito Arbitro", d: "Internazionale FIVA" },
        ].map((b) => (
          <div key={b.t} className="bg-[hsl(220_18%_10%)] p-5 md:p-6 flex items-center gap-4">
            <b.icon className="w-7 h-7 text-white/70 shrink-0" strokeWidth={1.25} />
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-white/50">{b.t}</div>
              <div className="font-serif-display text-base text-white">{b.d}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="container py-16 grid md:grid-cols-4 gap-10">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 overflow-hidden border border-white/20 grid place-items-center"
               style={{ background: "linear-gradient(135deg, #28295b 50%, #e52729 50%)" }}>
            <span className="font-serif-display font-bold text-white text-sm">V4</span>
          </div>
          <div>
            <div className="font-serif-display font-bold text-xl leading-none">V4</div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-white/50 mt-1">Vintage Vehicles Verified</div>
          </div>
        </div>
        <p className="text-sm text-white/60 leading-relaxed">Ricerca, perizia e divulgazione di veicoli di interesse storico e collezionistico. Ogni vettura viene selezionata, studiata e documentata dal Team del Perito Arbitro internazionale Federico Volontè.</p>
      </div>
      <div>
        <h4 className="font-serif-display text-lg mb-3">Esplora</h4>
        <ul className="space-y-2 text-sm text-white/70">
          <li><Link to="/catalogo" className="hover:text-white">Catalogo</Link></li>
          <li><Link to="/chi-siamo" className="hover:text-white">Chi siamo</Link></li>
          <li><Link to="/vendi" className="hover:text-white">Proponi la tua auto</Link></li>
          <li><Link to="/contatti" className="hover:text-white">Contatti</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-serif-display text-lg mb-3">Legale</h4>
        <ul className="space-y-2 text-sm text-white/70">
          <li><Link to="/privacy" className="hover:text-white">Privacy Policy (GDPR)</Link></li>
          <li><Link to="/cookie" className="hover:text-white">Cookie Policy</Link></li>
          <li><Link to="/termini" className="hover:text-white">Termini & Condizioni</Link></li>
          <li><Link to="/note-legali" className="hover:text-white">Note Legali</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-serif-display text-lg mb-3">Contatti</h4>
        <ul className="space-y-2 text-sm text-white/70">
          <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> studio.v4@outlook.com</li>
          <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +39 380 864 5012</li>
          <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> via cascina restelli 18 limido comasco</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-white/10">
      <div className="container py-6 text-[11px] text-white/50 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <span className="flex items-center gap-1.5"><BadgeCheck className="w-3.5 h-3.5 text-white/40" /> Federico Volontè</span>
          <span className="text-white/20">·</span>
          <span>P.IVA 03849530138</span>
          <span className="text-white/20">·</span>
          <span>C.F. VLNFRC82L05B639E</span>
          <span className="text-white/20">·</span>
          <span>PEC: Federico.volonte@pec.it</span>
        </div>
        <div className="flex flex-col md:flex-row justify-between gap-2 pt-3 border-t border-white/5">
          <span>© {new Date().getFullYear()} V4 — Vintage Vehicles Verified · da un'idea di Roberto Russo · Tutti i diritti riservati</span>
          <span>GDPR UE 2016/679 · D.Lgs. 196/2003 · AI Act UE 2024/1689 · Cod. Cons. D.Lgs. 206/2005</span>
        </div>
      </div>
    </div>
  </footer>
);
