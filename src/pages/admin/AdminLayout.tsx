import { ReactNode } from "react";
import { Navigate, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Car, Inbox, LogOut, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const Item = ({ to, icon: Icon, children }: { to: string; icon: any; children: ReactNode }) => (
  <NavLink to={to} end className={({ isActive }) =>
    cn("flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-smooth",
      isActive ? "bg-gradient-brand text-white shadow-glow" : "text-muted-foreground hover:bg-secondary hover:text-foreground")
  }>
    <Icon className="w-4 h-4" /> {children}
  </NavLink>
);

const AdminLayout = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  if (loading) return <div className="container py-20">Caricamento...</div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return (
    <div className="container py-20 text-center">
      <ShieldCheck className="w-12 h-12 mx-auto text-accent mb-4" />
      <h1 className="font-display font-bold text-2xl mb-2">Accesso negato</h1>
      <p className="text-muted-foreground mb-6">Non hai i permessi di amministratore.</p>
      <Button onClick={() => signOut().then(() => navigate("/"))}>Esci</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-soft">
      <div className="container py-8 grid lg:grid-cols-[240px,1fr] gap-8">
        <aside>
          <div className="bg-card border border-border rounded-2xl p-4 shadow-card sticky top-20">
            <div className="text-xs uppercase tracking-wider text-muted-foreground px-3 mb-2">Pannello</div>
            <div className="space-y-1">
              <Item to="/admin" icon={LayoutDashboard}>Dashboard</Item>
              <Item to="/admin/auto" icon={Car}>Auto</Item>
              <Item to="/admin/richieste" icon={Inbox}>Richieste</Item>
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <Button variant="ghost" className="w-full justify-start" onClick={() => signOut().then(() => navigate("/"))}>
                <LogOut className="w-4 h-4 mr-2" /> Esci
              </Button>
            </div>
          </div>
        </aside>
        <div><Outlet /></div>
      </div>
    </div>
  );
};

export default AdminLayout;
