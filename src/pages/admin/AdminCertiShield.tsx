import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ShieldCheck, ExternalLink, Save, Trash2, Info } from "lucide-react";
import { CERTISHIELD, isValidPassportUrl } from "@/lib/certishield";
import { fmtPrice } from "@/lib/format";

const AdminCertiShield = () => {
  const [cars, setCars] = useState<any[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("cars")
      .select("id, brand, model, year, price_eur, status, certishield_url, car_images(url, is_cover, position)")
      .order("created_at", { ascending: false });
    setCars(data ?? []);
    const d: Record<string, string> = {};
    (data ?? []).forEach((c: any) => (d[c.id] = c.certishield_url ?? ""));
    setDrafts(d);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const save = async (id: string) => {
    const url = drafts[id]?.trim() || null;
    if (url && !isValidPassportUrl(url)) {
      toast.error("URL non valido. Deve iniziare con https://");
      return;
    }
    setSavingId(id);
    const { error } = await supabase.from("cars").update({ certishield_url: url } as any).eq("id", id);
    setSavingId(null);
    if (error) return toast.error(error.message);
    toast.success(url ? "Passaporto CertiShield aggiornato" : "Passaporto rimosso");
    setCars((cs) => cs.map((c) => (c.id === id ? { ...c, certishield_url: url } : c)));
  };

  const clear = async (id: string) => {
    setDrafts((d) => ({ ...d, [id]: "" }));
    await save(id);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display font-bold text-3xl flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-brand-red" /> CertiShield · DVP
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestione rapida dei Passaporti Digitali su blockchain (Digital Vehicle Passport) per ogni vettura.
          </p>
        </div>
        <a
          href={CERTISHIELD.marketingUrl}
          target="_blank"
          rel="noreferrer"
          className="text-xs uppercase tracking-[0.18em] text-accent hover:text-foreground inline-flex items-center gap-1.5"
        >
          Sito CertiShield <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="mb-6 rounded-2xl border border-accent/30 bg-accent/5 p-5 text-sm leading-relaxed">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-accent mt-0.5 shrink-0" />
          <div className="space-y-2">
            <p className="font-semibold">Come aggiungere il DVP per una macchina</p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Far certificare l'auto da un professionista accreditato CertiShield (perito, restauratore o dealer).</li>
              <li>Una volta emesso il passaporto, CertiShield fornisce un <strong>link pubblico</strong> (es. <code className="text-[11px] bg-secondary px-1 py-0.5 rounded">https://app.certishield.io/dvp/...</code>) e un QR.</li>
              <li>Incolla quel link nel campo della vettura qui sotto e clicca <strong>Salva</strong>.</li>
              <li>Il QR e il pulsante "Apri passaporto" appariranno automaticamente sulla scheda pubblica dell'auto.</li>
            </ol>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="h-40 bg-muted animate-pulse rounded-2xl" />
      ) : cars.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center text-muted-foreground">
          Nessuna auto in archivio.
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl shadow-card divide-y divide-border overflow-hidden">
          {cars.map((c) => {
            const cover = (c.car_images?.find((i: any) => i.is_cover) ?? c.car_images?.[0])?.url;
            const draft = drafts[c.id] ?? "";
            const dirty = (draft || "") !== (c.certishield_url ?? "");
            const hasDvp = !!c.certishield_url;
            return (
              <div key={c.id} className="p-4 flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center gap-3 md:w-72 shrink-0">
                  <div className="w-16 h-12 rounded-lg bg-secondary overflow-hidden shrink-0">
                    {cover && <img src={cover} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{c.brand} {c.model}</div>
                    <div className="text-xs text-muted-foreground">{c.year} • {fmtPrice(c.price_eur)}</div>
                  </div>
                  {hasDvp ? (
                    <span className="ml-auto text-[10px] uppercase tracking-wider bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">DVP</span>
                  ) : (
                    <span className="ml-auto text-[10px] uppercase tracking-wider bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">—</span>
                  )}
                </div>

                <div className="flex-1 flex flex-col sm:flex-row gap-2">
                  <Input
                    value={draft}
                    onChange={(e) => setDrafts((d) => ({ ...d, [c.id]: e.target.value }))}
                    placeholder="https://app.certishield.io/dvp/..."
                    className="flex-1"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => save(c.id)}
                      disabled={!dirty || savingId === c.id}
                      className="bg-gradient-brand text-white"
                    >
                      <Save className="w-4 h-4 mr-1" /> Salva
                    </Button>
                    {hasDvp && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={c.certishield_url} target="_blank" rel="noreferrer" title="Apri DVP">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                    {hasDvp && (
                      <Button size="sm" variant="ghost" onClick={() => clear(c.id)} title="Rimuovi DVP">
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminCertiShield;
