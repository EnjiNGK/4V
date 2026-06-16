import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";
import { toast } from "sonner";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Accesso effettuato");
    navigate("/admin");
  };

  return (
    <div className="container py-20 max-w-md">
      <div className="bg-card border border-border rounded-2xl p-8 shadow-elegant">
        <div className="w-14 h-14 rounded-2xl bg-gradient-brand grid place-items-center mb-5 shadow-glow">
          <Lock className="w-7 h-7 text-white" />
        </div>
        <h1 className="font-display font-bold text-2xl mb-2">Accesso riservato</h1>
        <p className="text-sm text-muted-foreground mb-6">Area riservata al gestore del portale.</p>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider mb-1.5 block">Email</Label>
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider mb-1.5 block">Password</Label>
            <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-gradient-brand text-white">
            {loading ? "..." : "Accedi"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
