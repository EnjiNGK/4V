import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";
import { Link } from "react-router-dom";

const KEY = "autonobile-cookie-consent-v1";

export const CookieBanner = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem(KEY)) setShow(true);
  }, []);
  if (!show) return null;
  const set = (v: "all" | "necessary") => {
    localStorage.setItem(KEY, JSON.stringify({ v, ts: Date.now() }));
    setShow(false);
  };
  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-[60] bg-card border border-border rounded-lg shadow-elegant p-5 animate-fade-in-up">
      <div className="flex items-start gap-3">
        <Cookie className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-serif-display text-lg mb-1">Cookie & privacy</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Utilizziamo solo cookie tecnici necessari al funzionamento del sito. Nessun tracker pubblicitario o di profilazione. Conforme GDPR (UE 2016/679) e provvedimento Garante 10/06/2021.{" "}
            <Link to="/cookie" className="underline">Cookie Policy</Link>
          </p>
          <div className="flex gap-2 mt-3">
            <Button size="sm" variant="outline" onClick={() => set("necessary")} className="flex-1">Solo necessari</Button>
            <Button size="sm" onClick={() => set("all")} className="flex-1 bg-primary text-primary-foreground">Accetta</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
