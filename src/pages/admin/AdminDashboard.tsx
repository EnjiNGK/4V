import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Car, Inbox, CheckCircle, Clock } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ cars: 0, published: 0, requests: 0, newReq: 0 });

  useEffect(() => {
    (async () => {
      const [a, b, c, d] = await Promise.all([
        supabase.from("cars").select("id", { count: "exact", head: true }),
        supabase.from("cars").select("id", { count: "exact", head: true }).eq("status", "published"),
        supabase.from("listing_requests").select("id", { count: "exact", head: true }),
        supabase.from("listing_requests").select("id", { count: "exact", head: true }).eq("status", "new"),
      ]);
      setStats({ cars: a.count ?? 0, published: b.count ?? 0, requests: c.count ?? 0, newReq: d.count ?? 0 });
    })();
  }, []);

  const cards = [
    { icon: Car, label: "Auto totali", value: stats.cars },
    { icon: CheckCircle, label: "Pubblicate", value: stats.published },
    { icon: Inbox, label: "Richieste", value: stats.requests },
    { icon: Clock, label: "Da gestire", value: stats.newReq, accent: true },
  ];

  return (
    <div>
      <h1 className="font-display font-bold text-3xl mb-6">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className={`rounded-2xl p-6 border shadow-card ${c.accent ? "bg-gradient-brand text-white border-transparent shadow-glow" : "bg-card border-border"}`}>
            <c.icon className={`w-6 h-6 mb-3 ${c.accent ? "text-white" : "text-accent"}`} />
            <div className="text-3xl font-display font-bold">{c.value}</div>
            <div className={`text-sm ${c.accent ? "text-white/80" : "text-muted-foreground"}`}>{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
