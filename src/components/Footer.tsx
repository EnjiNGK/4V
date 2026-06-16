import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, ShieldCheck, Lock, FileCheck, Award, BadgeCheck } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { OWNER_INFO } from "@/lib/ownerInfo";

export const Footer = () => {
  const { isEnglish } = useLanguage();
  return (
    <footer className="mt-24 bg-[hsl(220_18%_10%)] text-[hsl(38_25%_94%)]">
      <div className="border-b border-white/10">
        <div className="container py-10 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 border border-white/10">
          {[
            { icon: ShieldCheck, t: "GDPR Compliant", d: "UE 2016/679" },
            { icon: Lock, t: isEnglish ? "Secure payments" : "Pagamenti sicuri", d: isEnglish ? "Tracked bank transfer" : "Bonifico tracciato" },
            { icon: FileCheck, t: isEnglish ? "Verified documents" : "Documenti verificati", d: isEnglish ? "On every vehicle" : "Su ogni vettura" },
            { icon: Award, t: isEnglish ? "Arbiter Surveyor" : "Perito Arbitro", d: isEnglish ? "International FIVA" : "Internazionale FIVA" },
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
            <img src="/logo-v4.png" alt="V4 Vintage Vehicles Verified" width={44} height={44} className="w-11 h-11 object-contain" />
          </div>

          <p className="text-sm text-white/60 leading-relaxed">
            {isEnglish
              ? "Research, appraisal and dissemination of vehicles of historical and collector interest. Every car is selected, studied and documented by the Team of international Arbiter Surveyor Federico Volontè."
              : "Ricerca, perizia e divulgazione di veicoli di interesse storico e collezionistico. Ogni vettura viene selezionata, studiata e documentata dal Team del Perito Arbitro internazionale Federico Volontè."}
          </p>
        </div>
        <div>
          <h4 className="font-serif-display text-lg mb-3">{isEnglish ? "Explore" : "Esplora"}</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/catalogo" className="hover:text-white">{isEnglish ? "Catalog" : "Catalogo"}</Link></li>
            <li><Link to="/chi-siamo" className="hover:text-white">{isEnglish ? "About" : "Chi siamo"}</Link></li>
            <li><Link to="/vendi" className="hover:text-white">{isEnglish ? "Sell your car" : "Proponi la tua auto"}</Link></li>
            <li><Link to="/contatti" className="hover:text-white">{isEnglish ? "Contact" : "Contatti"}</Link></li>
            <li>
              <Link to="/certificazione-digitale" className="hover:text-white">
                {isEnglish ? "CertiShield · blockchain DVP" : "CertiShield · DVP su blockchain"}
              </Link>

            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-serif-display text-lg mb-3">{isEnglish ? "Legal" : "Legale"}</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/privacy" className="hover:text-white">Privacy Policy (GDPR)</Link></li>
            <li><Link to="/cookie" className="hover:text-white">Cookie Policy</Link></li>
            <li><Link to="/termini" className="hover:text-white">{isEnglish ? "Terms & Conditions" : "Termini & Condizioni"}</Link></li>
            <li><Link to="/note-legali" className="hover:text-white">{isEnglish ? "Legal Notes" : "Note Legali"}</Link></li>
            <li>
              <Link to="/note-legali#segnalazioni-contenuti" className="hover:text-white">
                {isEnglish ? "Illegal content (DSA)" : "Segnalazioni contenuti (DSA)"}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-serif-display text-lg mb-3">{isEnglish ? "Contact" : "Contatti"}</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 shrink-0" />
              <a href={`mailto:${OWNER_INFO.pec}`} className="hover:text-white break-all">{OWNER_INFO.pec}</a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 shrink-0" />
              <a href={`tel:${OWNER_INFO.phoneE164}`} className="hover:text-white">{OWNER_INFO.phoneDisplay}</a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{OWNER_INFO.fullAddress}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container py-6 text-[11px] text-white/50 flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
            <span className="flex items-center gap-1.5">
              <BadgeCheck className="w-3.5 h-3.5 text-white/40 shrink-0" />
              {OWNER_INFO.legalName}
            </span>
            <span className="text-white/20">·</span>
            <span>{OWNER_INFO.fullAddress}</span>
            <span className="text-white/20">·</span>
            <span>
              {isEnglish ? "VAT" : "P.IVA"} {OWNER_INFO.piva}
            </span>
            <span className="text-white/20">·</span>
            <span>{isEnglish ? "Tax code" : "C.F."} {OWNER_INFO.cf}</span>
            <span className="text-white/20">·</span>
            <span>
              Tel.{" "}
              <a href={`tel:${OWNER_INFO.phoneE164}`} className="hover:text-white/80">{OWNER_INFO.phoneDisplay}</a>
            </span>
            <span className="text-white/20">·</span>
            <span>
              PEC:{" "}
              <a href={`mailto:${OWNER_INFO.pec}`} className="hover:text-white/80 break-all">{OWNER_INFO.pec}</a>
            </span>
          </div>
          <div className="flex flex-col md:flex-row justify-between gap-2 pt-3 border-t border-white/5">
            <div className="flex flex-col gap-1">
              <span>© {new Date().getFullYear()} V4 — Vintage Vehicles Verified · {isEnglish ? "All rights reserved" : "Tutti i diritti riservati"}</span>
              <span className="text-white/40 italic">da un'idea di Roberto Russo</span>
            </div>
            <span>GDPR UE 2016/679 · D.Lgs. 196/2003 · AI Act UE 2024/1689 · Cod. Cons. D.Lgs. 206/2005</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
