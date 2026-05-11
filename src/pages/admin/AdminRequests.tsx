import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fmtKm, fmtPrice } from "@/lib/format";
import { toast } from "sonner";
import { Mail, Phone, ChevronDown, ChevronUp, Trash2, CheckCircle2, X, Loader2 } from "lucide-react";

const STATUSES = ["new", "in_progress", "published", "rejected"];
const STATUS_LABEL: Record<string, string> = { new: "Nuova", in_progress: "In lavorazione", published: "Pubblicata", rejected: "Rifiutata" };
const STATUS_COLOR: Record<string, string> = {
  new: "bg-brand-blue/10 text-brand-blue",
  in_progress: "bg-amber-500/10 text-amber-600",
  published: "bg-emerald-500/10 text-emerald-600",
  rejected: "bg-brand-red/10 text-brand-red",
};

const AdminRequests = () => {
  const [reqs, setReqs] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState<string | null>(null);
  const [publishing, setPublishing] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<any | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejecting, setRejecting] = useState(false);
  const [publishTarget, setPublishTarget] = useState<any | null>(null);
  const [publishPrice, setPublishPrice] = useState<string>("");

  const load = async () => {
    const { data } = await supabase.from("listing_requests").select("*").order("created_at", { ascending: false });
    setReqs(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const updStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("listing_requests").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };
  const remove = async (id: string) => {
    if (!confirm("Eliminare questa richiesta?")) return;
    await supabase.from("listing_requests").delete().eq("id", id);
    load();
  };

  // ───────── PUBLISH: create car + email
  const openPublish = (r: any) => {
    setPublishTarget(r);
    setPublishPrice(r.asking_price_eur ? String(r.asking_price_eur) : "");
  };
  const confirmPublish = async () => {
    if (!publishTarget) return;
    const r = publishTarget;
    const price = Number(publishPrice);
    if (!price || price <= 0) return toast.error("Inserisci un prezzo di vendita valido");
    setPublishing(r.id);
    try {
      // 1) Create car as published
      const carPayload: any = {
        brand: r.brand,
        model: r.model,
        version: r.version ?? null,
        year: r.year,
        mileage_km: r.mileage_km ?? 0,
        price_eur: price,
        fuel: r.fuel,
        transmission: r.transmission,
        power_hp: r.power_hp ?? null,
        displacement_cc: r.displacement_cc ?? null,
        color: r.color ?? null,
        condition: r.condition,
        previous_owners: r.previous_owners ?? null,
        has_documents: r.has_documents ?? true,
        has_inspection: r.has_inspection ?? false,
        description: r.description ?? null,
        location: r.city ?? null,
        brochure_url: r.brochure_file_url ?? null,
        status: "published",
        featured: false,
      };
      const { data: car, error: carErr } = await supabase.from("cars").insert(carPayload).select().single();
      if (carErr) throw carErr;

      // 2) Copy images from request into car_images
      if (r.image_urls?.length) {
        const rows = r.image_urls.map((url: string, i: number) => ({
          car_id: car.id,
          url,
          position: i,
          is_cover: i === 0,
        }));
        await supabase.from("car_images").insert(rows);
      }

      // 3) Mark request published
      await supabase.from("listing_requests").update({ status: "published" }).eq("id", r.id);

      // 4) Send acceptance email via EmailJS (free)
      try {
        const { sendEmail, EMAILJS } = await import("@/lib/emailjs");
        await sendEmail(EMAILJS.contactTemplateId, {
          to_email: r.email,
          reply_to: "info@v4.it",
          from_name: "V4 — Vintage Vehicles Verified",
          subject: `La tua ${r.brand} ${r.model} è stata accettata`,
          message:
            `Ciao ${r.full_name},\n\n` +
            `Ti confermiamo che la tua ${r.brand} ${r.model} (${r.year}) è stata accettata e pubblicata nel nostro catalogo V4.\n` +
            `Prezzo di pubblicazione: € ${price.toLocaleString("it-IT")}\n\n` +
            `Scheda online: ${window.location.origin}/auto/${car.id}\n\n` +
            `Per qualsiasi informazione siamo a disposizione.\n— Team V4`,
        });
      } catch (e) {
        console.warn("email send failed", e);
        toast.warning("Auto pubblicata ma email non inviata.");
      }

      toast.success("Auto pubblicata in vetrina ed email inviata.");
      setPublishTarget(null);
      load();
    } catch (e: any) {
      toast.error(e.message || "Errore in pubblicazione");
    } finally {
      setPublishing(null);
    }
  };

  // ───────── REJECT: dialog + reason + email
  const confirmReject = async () => {
    if (!rejectTarget) return;
    if (rejectReason.trim().length < 10) return toast.error("Inserisci una motivazione (min 10 caratteri)");
    setRejecting(true);
    try {
      await supabase.from("listing_requests").update({ status: "rejected", admin_notes: rejectReason }).eq("id", rejectTarget.id);
      try {
        const { sendEmail, EMAILJS } = await import("@/lib/emailjs");
        await sendEmail(EMAILJS.contactTemplateId, {
          to_email: rejectTarget.email,
          reply_to: "info@v4.it",
          from_name: "V4 — Vintage Vehicles Verified",
          subject: `Esito proposta: ${rejectTarget.brand} ${rejectTarget.model}`,
          message:
            `Ciao ${rejectTarget.full_name},\n\n` +
            `Ti ringraziamo per averci proposto la tua ${rejectTarget.brand} ${rejectTarget.model} (${rejectTarget.year}).\n` +
            `Dopo attenta valutazione, in questo momento non possiamo accoglierla nel nostro catalogo per la seguente motivazione:\n\n` +
            `${rejectReason}\n\n` +
            `Restiamo a tua disposizione per future proposte.\n— Team V4`,
        });
      } catch (e) {
        console.warn("email send failed", e);
        toast.warning("Richiesta rifiutata ma email non inviata.");
      }
      toast.success("Richiesta rifiutata ed email inviata.");
      setRejectTarget(null);
      setRejectReason("");
      load();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setRejecting(false);
    }
  };

  const filtered = reqs.filter((r) => filter === "all" || r.status === filter);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display font-bold text-3xl">Richieste di vendita</h1>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tutte</SelectItem>
            {STATUSES.map((s) => <SelectItem key={s} value={s}>{STATUS_LABEL[s]}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && <div className="text-center py-16 text-muted-foreground bg-card rounded-2xl border border-border">Nessuna richiesta.</div>}
        {filtered.map((r) => {
          const isOpen = open === r.id;
          const isFinal = r.status === "published" || r.status === "rejected";
          return (
            <div key={r.id} className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
              <button onClick={() => setOpen(isOpen ? null : r.id)} className="w-full p-5 flex items-center gap-4 text-left hover:bg-secondary/50">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold">{r.brand} {r.model} <span className="text-muted-foreground font-normal">— {r.year}</span></div>
                  <div className="text-xs text-muted-foreground">{r.full_name} • {r.email} • {new Date(r.created_at).toLocaleDateString("it-IT")}</div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLOR[r.status]}`}>{STATUS_LABEL[r.status]}</span>
                {r.asking_price_eur && <span className="font-display font-bold text-accent">{fmtPrice(r.asking_price_eur)}</span>}
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {isOpen && (
                <div className="border-t border-border p-5 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    <Info l="Telefono" v={<a href={`tel:${r.phone}`} className="text-accent flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{r.phone}</a>} />
                    <Info l="Email" v={<a href={`mailto:${r.email}`} className="text-accent flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{r.email}</a>} />
                    <Info l="Città" v={r.city ?? "—"} />
                    <Info l="Versione" v={r.version ?? "—"} />
                    <Info l="Km" v={fmtKm(r.mileage_km)} />
                    <Info l="Carburante / Cambio" v={`${r.fuel} • ${r.transmission}`} />
                    <Info l="Potenza / Cilindrata" v={`${r.power_hp ?? "—"} CV • ${r.displacement_cc ?? "—"} cc`} />
                    <Info l="Colore / Condizione" v={`${r.color ?? "—"} • ${r.condition}`} />
                    <Info l="Proprietari" v={r.previous_owners ?? "—"} />
                    <Info l="Documenti / Perizia" v={`${r.has_documents ? "✓" : "✗"} doc • ${r.has_inspection ? "✓" : "✗"} perizia`} />
                  </div>
                  {r.description && <div><div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Descrizione</div><div className="text-sm whitespace-pre-line">{r.description}</div></div>}
                  {r.admin_notes && r.status === "rejected" && (
                    <div className="border-l-4 border-brand-red bg-brand-red/5 p-3">
                      <div className="text-xs uppercase tracking-wider text-brand-red mb-1">Motivazione rifiuto</div>
                      <div className="text-sm whitespace-pre-line">{r.admin_notes}</div>
                    </div>
                  )}
                  {r.image_urls?.length > 0 && (
                    <div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Foto ({r.image_urls.length})</div>
                      <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                        {r.image_urls.map((u: string, i: number) => (
                          <a key={i} href={u} target="_blank" rel="noreferrer" className="aspect-square rounded overflow-hidden">
                            <img src={u} className="w-full h-full object-cover hover:scale-105 transition" alt="" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border">
                    {!isFinal && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => openPublish(r)}
                          disabled={publishing === r.id}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          {publishing === r.id ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-1" />}
                          Pubblica in vetrina
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => { setRejectTarget(r); setRejectReason(""); }}
                          className="border-brand-red text-brand-red hover:bg-brand-red hover:text-white"
                        >
                          <X className="w-4 h-4 mr-1" /> Rifiuta
                        </Button>
                      </>
                    )}
                    <Select value={r.status} onValueChange={(v) => updStatus(r.id, v)}>
                      <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                      <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{STATUS_LABEL[s]}</SelectItem>)}</SelectContent>
                    </Select>
                    <Button variant="ghost" size="sm" onClick={() => remove(r.id)} className="text-destructive ml-auto"><Trash2 className="w-4 h-4 mr-1" />Elimina</Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* PUBLISH DIALOG */}
      <Dialog open={!!publishTarget} onOpenChange={(o) => !o && setPublishTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pubblica in vetrina</DialogTitle>
            <DialogDescription>
              L'auto verrà creata e resa visibile a tutti nel catalogo. Verrà inviata un'email di accettazione al richiedente.
            </DialogDescription>
          </DialogHeader>
          {publishTarget && (
            <div className="space-y-4">
              <div className="text-sm bg-secondary/40 p-3 rounded">
                <div className="font-semibold">{publishTarget.brand} {publishTarget.model} {publishTarget.version} — {publishTarget.year}</div>
                <div className="text-xs text-muted-foreground">{publishTarget.full_name} • {publishTarget.email}</div>
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Prezzo di pubblicazione (€) *</Label>
                <Input
                  type="number"
                  value={publishPrice}
                  onChange={(e) => setPublishPrice(e.target.value)}
                  placeholder={publishTarget.asking_price_eur ? `Richiesto: ${publishTarget.asking_price_eur}` : "Es. 45000"}
                />
                <p className="text-[11px] text-muted-foreground mt-1">Prezzo richiesto: {publishTarget.asking_price_eur ? fmtPrice(publishTarget.asking_price_eur) : "—"}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPublishTarget(null)}>Annulla</Button>
            <Button onClick={confirmPublish} disabled={!!publishing} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              {publishing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Pubblico…</> : <><CheckCircle2 className="w-4 h-4 mr-2" />Conferma e pubblica</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* REJECT DIALOG */}
      <Dialog open={!!rejectTarget} onOpenChange={(o) => !o && setRejectTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-brand-red flex items-center gap-2"><X className="w-5 h-5" /> Rifiuta richiesta</DialogTitle>
            <DialogDescription>
              Inserisci una motivazione: verrà inviata via email al richiedente.
            </DialogDescription>
          </DialogHeader>
          {rejectTarget && (
            <div className="space-y-4">
              <div className="text-sm bg-secondary/40 p-3 rounded">
                <div className="font-semibold">{rejectTarget.brand} {rejectTarget.model} — {rejectTarget.year}</div>
                <div className="text-xs text-muted-foreground">{rejectTarget.full_name} • {rejectTarget.email}</div>
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Motivazione *</Label>
                <Textarea
                  rows={5}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Es. Documentazione incompleta, veicolo non in linea con la nostra selezione…"
                />
                <p className="text-[11px] text-muted-foreground mt-1">{rejectReason.length}/2000</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectTarget(null)}>Annulla</Button>
            <Button onClick={confirmReject} disabled={rejecting} className="bg-brand-red hover:bg-brand-red/90 text-white">
              {rejecting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Invio…</> : <><X className="w-4 h-4 mr-2" />Rifiuta e invia email</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Info = ({ l, v }: any) => (
  <div><div className="text-xs uppercase tracking-wider text-muted-foreground">{l}</div><div className="font-medium">{v}</div></div>
);

export default AdminRequests;
