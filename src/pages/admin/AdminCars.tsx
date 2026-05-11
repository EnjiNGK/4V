import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { fmtPrice } from "@/lib/format";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const AdminCars = () => {
  const [cars, setCars] = useState<any[]>([]);

  const load = async () => {
    const { data } = await supabase.from("cars").select("*, car_images(url, is_cover, position)").order("created_at", { ascending: false });
    setCars(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const togglePublish = async (id: string, status: string) => {
    const next = status === "published" ? "draft" : "published";
    const { error } = await supabase.from("cars").update({ status: next }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(next === "published" ? "Pubblicata" : "Bozza");
    load();
  };
  const remove = async (id: string) => {
    if (!confirm("Eliminare questa auto?")) return;
    const { error } = await supabase.from("cars").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Eliminata");
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display font-bold text-3xl">Auto</h1>
        <Button asChild className="bg-gradient-brand text-white"><Link to="/admin/auto/nuova"><Plus className="w-4 h-4 mr-2" />Nuova auto</Link></Button>
      </div>
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-card">
        {cars.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">Nessuna auto. Aggiungi la prima!</div>
        ) : (
          <div className="divide-y divide-border">
            {cars.map((c: any) => {
              const cover = (c.car_images?.find((i: any) => i.is_cover) ?? c.car_images?.[0])?.url;
              return (
                <div key={c.id} className="flex items-center gap-4 p-4">
                  <div className="w-20 h-16 rounded-lg bg-secondary overflow-hidden shrink-0">
                    {cover && <img src={cover} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{c.brand} {c.model}</div>
                    <div className="text-xs text-muted-foreground">{c.year} • {c.fuel} • {fmtPrice(c.price_eur)}</div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${c.status === "published" ? "bg-green-100 text-green-700" : "bg-secondary text-muted-foreground"}`}>
                    {c.status === "published" ? "Pubblicata" : "Bozza"}
                  </span>
                  <Button variant="ghost" size="icon" onClick={() => togglePublish(c.id, c.status)} title="Pubblica/Bozza">
                    {c.status === "published" ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" asChild><Link to={`/admin/auto/${c.id}`}><Edit className="w-4 h-4" /></Link></Button>
                  <Button variant="ghost" size="icon" onClick={() => remove(c.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCars;
