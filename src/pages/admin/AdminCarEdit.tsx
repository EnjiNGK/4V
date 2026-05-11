import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FUELS, TRANSMISSIONS, BODIES, CONDITIONS } from "@/lib/format";
import { toast } from "sonner";
import { Upload, X, Star, Save, ArrowLeft } from "lucide-react";

const AdminCarEdit = () => {
  const { id } = useParams();
  const isNew = id === "nuova";
  const navigate = useNavigate();
  const [car, setCar] = useState<any>({
    status: "draft", featured: false, has_inspection: false, has_documents: true, condition: "Usata",
    fuel: "", transmission: "", year: new Date().getFullYear(), mileage_km: 0, price_eur: 0, brand: "", model: "",
  });
  const [images, setImages] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      const { data } = await supabase.from("cars").select("*, car_images(*)").eq("id", id).maybeSingle();
      if (data) {
        setCar(data);
        setImages((data.car_images ?? []).sort((a: any, b: any) => a.position - b.position));
      }
    })();
  }, [id, isNew]);

  const set = (k: string, v: any) => setCar((c: any) => ({ ...c, [k]: v }));

  const save = async () => {
    if (!car.brand || !car.model || !car.fuel || !car.transmission || !car.price_eur) {
      return toast.error("Compila i campi obbligatori");
    }
    const { car_images, ...payload } = car;
    payload.price_eur = Number(payload.price_eur);
    payload.mileage_km = Number(payload.mileage_km);
    payload.year = Number(payload.year);
    if (payload.power_hp) payload.power_hp = Number(payload.power_hp);
    if (payload.displacement_cc) payload.displacement_cc = Number(payload.displacement_cc);
    if (payload.previous_owners) payload.previous_owners = Number(payload.previous_owners);

    if (isNew) {
      const { data, error } = await supabase.from("cars").insert(payload).select().single();
      if (error) return toast.error(error.message);
      toast.success("Creata");
      navigate(`/admin/auto/${data.id}`);
    } else {
      const { error } = await supabase.from("cars").update(payload).eq("id", id);
      if (error) return toast.error(error.message);
      toast.success("Salvata");
    }
  };

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isNew) return toast.error("Salva prima l'auto");
    const files = Array.from(e.target.files ?? []);
    if (images.length + files.length > 40) return toast.error("Massimo 40 immagini");
    setUploading(true);
    let pos = images.length;
    for (const f of files) {
      const path = `${id}/${crypto.randomUUID()}-${f.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
      const { error: upErr } = await supabase.storage.from("cars").upload(path, f);
      if (upErr) { toast.error(upErr.message); continue; }
      const { data: urlData } = supabase.storage.from("cars").getPublicUrl(path);
      const { data: imgRow, error: insErr } = await supabase.from("car_images").insert({
        car_id: id!, url: urlData.publicUrl, storage_path: path, position: pos, is_cover: images.length === 0 && pos === 0,
      }).select().single();
      if (insErr) { toast.error(insErr.message); continue; }
      setImages((prev) => [...prev, imgRow]);
      pos++;
    }
    setUploading(false);
  };

  const removeImage = async (img: any) => {
    if (img.storage_path) await supabase.storage.from("cars").remove([img.storage_path]);
    await supabase.from("car_images").delete().eq("id", img.id);
    setImages(images.filter((i) => i.id !== img.id));
  };

  const setCover = async (img: any) => {
    await supabase.from("car_images").update({ is_cover: false }).eq("car_id", id);
    await supabase.from("car_images").update({ is_cover: true }).eq("id", img.id);
    setImages(images.map((i) => ({ ...i, is_cover: i.id === img.id })));
    toast.success("Copertina impostata");
  };

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={() => navigate("/admin/auto")} className="mb-4"><ArrowLeft className="w-4 h-4 mr-1" /> Indietro</Button>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display font-bold text-3xl">{isNew ? "Nuova auto" : `${car.brand} ${car.model}`}</h1>
        <Button onClick={save} className="bg-gradient-brand text-white"><Save className="w-4 h-4 mr-2" />Salva</Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Dati principali">
            <Grid>
              <F label="Marca *"><Input value={car.brand ?? ""} onChange={(e) => set("brand", e.target.value)} /></F>
              <F label="Modello *"><Input value={car.model ?? ""} onChange={(e) => set("model", e.target.value)} /></F>
              <F label="Versione"><Input value={car.version ?? ""} onChange={(e) => set("version", e.target.value)} /></F>
              <F label="Prezzo (€) *"><Input type="number" value={car.price_eur ?? 0} onChange={(e) => set("price_eur", e.target.value)} /></F>
              <F label="Anno *"><Input type="number" value={car.year ?? ""} onChange={(e) => set("year", e.target.value)} /></F>
              <F label="Km *"><Input type="number" value={car.mileage_km ?? 0} onChange={(e) => set("mileage_km", e.target.value)} /></F>
              <F label="Carburante *"><Sel v={car.fuel} on={(v) => set("fuel", v)} opts={FUELS} /></F>
              <F label="Cambio *"><Sel v={car.transmission} on={(v) => set("transmission", v)} opts={TRANSMISSIONS} /></F>
              <F label="Carrozzeria"><Sel v={car.body_type} on={(v) => set("body_type", v)} opts={BODIES} /></F>
              <F label="Condizione"><Sel v={car.condition} on={(v) => set("condition", v)} opts={CONDITIONS} /></F>
            </Grid>
          </Card>

          <Card title="Tecnica">
            <Grid>
              <F label="Potenza (CV)"><Input type="number" value={car.power_hp ?? ""} onChange={(e) => set("power_hp", e.target.value)} /></F>
              <F label="Cilindrata (cc)"><Input type="number" value={car.displacement_cc ?? ""} onChange={(e) => set("displacement_cc", e.target.value)} /></F>
              <F label="Colore"><Input value={car.color ?? ""} onChange={(e) => set("color", e.target.value)} /></F>
              <F label="Porte"><Input type="number" value={car.doors ?? ""} onChange={(e) => set("doors", e.target.value)} /></F>
              <F label="Posti"><Input type="number" value={car.seats ?? ""} onChange={(e) => set("seats", e.target.value)} /></F>
              <F label="Proprietari precedenti"><Input type="number" value={car.previous_owners ?? ""} onChange={(e) => set("previous_owners", e.target.value)} /></F>
              <F label="Località"><Input value={car.location ?? ""} onChange={(e) => set("location", e.target.value)} /></F>
              <F label="VIN"><Input value={car.vin ?? ""} onChange={(e) => set("vin", e.target.value)} /></F>
              <F label="URL Brochure PDF"><Input type="url" placeholder="https://…/scheda.pdf" value={car.brochure_url ?? ""} onChange={(e) => set("brochure_url", e.target.value)} /></F>
            </Grid>
          </Card>

          <Card title="Descrizione & Perizia">
            <div className="space-y-4">
              <F label="Descrizione"><Textarea rows={5} value={car.description ?? ""} onChange={(e) => set("description", e.target.value)} /></F>
              <F label="Note perizia"><Textarea rows={3} value={car.inspection_notes ?? ""} onChange={(e) => set("inspection_notes", e.target.value)} /></F>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Stato">
            <div className="space-y-3">
              <div className="flex justify-between items-center"><span className="text-sm">Pubblicata</span>
                <Switch checked={car.status === "published"} onCheckedChange={(v) => set("status", v ? "published" : "draft")} /></div>
              <div className="flex justify-between items-center"><span className="text-sm">In evidenza</span>
                <Switch checked={car.featured} onCheckedChange={(v) => set("featured", v)} /></div>
              <div className="flex justify-between items-center"><span className="text-sm">Documenti regolari</span>
                <Switch checked={car.has_documents} onCheckedChange={(v) => set("has_documents", v)} /></div>
              <div className="flex justify-between items-center"><span className="text-sm">Perizia disponibile</span>
                <Switch checked={car.has_inspection} onCheckedChange={(v) => set("has_inspection", v)} /></div>
              <div className="flex justify-between items-center"><span className="text-sm">Matching numbers</span>
                <Switch checked={!!car.matching_numbers} onCheckedChange={(v) => set("matching_numbers", v)} /></div>
            </div>
          </Card>

          <Card title={`Foto (${images.length}/40)`}>
            <label className="block border-2 border-dashed border-border rounded-xl p-4 text-center cursor-pointer hover:border-accent transition-smooth">
              <Upload className="w-6 h-6 mx-auto text-muted-foreground mb-1" />
              <div className="text-sm font-medium">{uploading ? "Caricamento..." : "Aggiungi foto"}</div>
              <input type="file" accept="image/*" multiple className="hidden" onChange={upload} disabled={uploading || isNew} />
            </label>
            {isNew && <p className="text-xs text-muted-foreground mt-2">Salva l'auto per caricare foto.</p>}
            <div className="grid grid-cols-3 gap-2 mt-3">
              {images.map((img) => (
                <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden bg-secondary group">
                  <img src={img.url} className="w-full h-full object-cover" alt="" />
                  {img.is_cover && <span className="absolute top-1 left-1 text-[10px] px-1.5 py-0.5 rounded bg-accent text-white">COVER</span>}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1">
                    <button onClick={() => setCover(img)} title="Imposta cover" className="w-7 h-7 rounded bg-white/20 grid place-items-center"><Star className="w-3.5 h-3.5 text-white" /></button>
                    <button onClick={() => removeImage(img)} className="w-7 h-7 rounded bg-white/20 grid place-items-center"><X className="w-3.5 h-3.5 text-white" /></button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, children }: any) => (
  <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
    <h2 className="font-display font-bold text-lg mb-4">{title}</h2>
    {children}
  </div>
);
const Grid = ({ children }: any) => <div className="grid sm:grid-cols-2 gap-4">{children}</div>;
const F = ({ label, children }: any) => (
  <div><Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">{label}</Label>{children}</div>
);
const Sel = ({ v, on, opts }: any) => (
  <Select value={v ?? ""} onValueChange={on}>
    <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
    <SelectContent>{opts.map((o: string) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
  </Select>
);

export default AdminCarEdit;
