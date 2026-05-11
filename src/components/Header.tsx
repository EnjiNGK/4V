import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";

export const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAdmin, user, signOut } = useAuth();
  const { language, setLanguage, isEnglish } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const links = [
    { to: "/", label: isEnglish ? "Home" : "Home" },
    { to: "/catalogo", label: isEnglish ? "Catalog" : "Catalogo" },
    { to: "/chi-siamo", label: isEnglish ? "About" : "Chi siamo" },
    { to: "/contatti", label: isEnglish ? "Contact" : "Contatti" },
  ];

  // Routes where the page starts with a dark hero (header floats over image)
  const overHero = location.pathname === "/" || location.pathname === "/chi-siamo" || location.pathname === "/contatti";
  const transparent = overHero && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close mobile on route change
  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500",
        transparent
          ? "bg-gradient-to-b from-black/55 via-black/25 to-transparent text-white border-b border-transparent"
          : "bg-background/85 backdrop-blur-xl text-foreground border-b border-border/60 supports-[backdrop-filter]:bg-background/70"
      )}
    >
      <div className={cn("container flex items-center justify-between gap-3 md:gap-6 transition-all", transparent ? "h-20 md:h-24" : "h-16 md:h-20")}>
        <Link to="/" className="flex items-center gap-3 group min-w-0 shrink-0">
          <div
            className="relative w-10 h-10 md:w-11 md:h-11 grid place-items-center overflow-hidden group-hover:scale-105 transition-smooth shrink-0 ring-1 ring-white/10"
            style={{ background: "linear-gradient(135deg, #28295b 50%, #e52729 50%)" }}
          >
            <span className="font-serif-display font-bold text-base md:text-lg tracking-tight text-white">V4</span>
          </div>
          <div className="leading-tight min-w-0">
            <div className={cn("font-serif-display font-bold text-lg md:text-xl tracking-wide truncate", transparent && "text-white")}>V4</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                cn(
                  "px-4 py-2 text-[12px] font-medium tracking-[0.18em] uppercase transition-colors",
                  transparent
                    ? isActive ? "text-white" : "text-white/70 hover:text-white"
                    : isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  "relative after:absolute after:left-4 after:right-4 after:bottom-1 after:h-px after:bg-current after:scale-x-0 after:transition-transform",
                  "hover:after:scale-x-100"
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <div className={cn("flex items-center border px-1 py-1", transparent ? "border-white/20 bg-white/5" : "border-border bg-card")}>
            {(["it", "en"] as const).map((lng) => (
              <button
                key={lng}
                type="button"
                onClick={() => setLanguage(lng)}
                className={cn(
                  "px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] transition-smooth",
                  language === lng
                    ? transparent ? "bg-white text-black" : "bg-foreground text-background"
                    : transparent ? "text-white/70 hover:text-white" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {lng}
              </button>
            ))}
          </div>
          {isAdmin && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/admin")}
              className={cn("rounded-none border", transparent ? "border-white/40 bg-transparent text-white hover:bg-white hover:text-foreground" : "")}
            >
              <ShieldCheck className="w-4 h-4 mr-1" /> Admin
            </Button>
          )}
          {user && (
            <Button variant="ghost" size="sm" onClick={() => signOut()} className={cn(transparent && "text-white hover:bg-white/10")}>
              {isEnglish ? "Logout" : "Esci"}
            </Button>
          )}
          <Button
            size="sm"
            onClick={() => navigate("/vendi")}
            className={cn(
              "rounded-none px-5 h-10 text-[11px] tracking-[0.18em] uppercase font-medium",
              transparent
                ? "bg-white text-black hover:bg-white/90"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            {isEnglish ? "Sell your car" : "Proponi la tua auto"}
          </Button>
        </div>

        <button
          className={cn("lg:hidden p-2 rounded transition-colors", transparent ? "text-white" : "text-foreground")}
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <>
          {/* Backdrop blur overlay */}
          <button
            aria-label="Chiudi menu"
            onClick={() => setOpen(false)}
            className="lg:hidden fixed inset-0 top-[var(--mh,5rem)] bg-foreground/35 backdrop-blur-xl animate-in fade-in duration-300"
            style={{ ['--mh' as any]: transparent ? '5rem' : '4rem' }}
          />
          <div className="lg:hidden absolute inset-x-3 top-[calc(100%+0.75rem)] overflow-hidden border border-white/10 bg-background/72 text-foreground shadow-2xl backdrop-blur-2xl supports-[backdrop-filter]:bg-background/60 animate-in fade-in slide-in-from-top-3 duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-background/85 via-background/70 to-secondary/70" />
            <div className="container relative py-5 flex flex-col gap-1">
              <div className="mb-3 flex items-center justify-between gap-4 border-b border-border/40 pb-4">
                <div className="hairline text-muted-foreground">Menu</div>
                <div className="flex items-center border border-border bg-card/70 px-1 py-1">
                  {(["it", "en"] as const).map((lng) => (
                    <button
                      key={lng}
                      type="button"
                      onClick={() => setLanguage(lng)}
                      className={cn("px-2.5 py-1 text-[10px] uppercase tracking-[0.18em]", language === lng ? "bg-foreground text-background" : "text-muted-foreground")}
                    >
                      {lng}
                    </button>
                  ))}
                </div>
              </div>
              {links.map((l, i) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === "/"}
                  onClick={() => setOpen(false)}
                  style={{ animationDelay: `${i * 50}ms` }}
                  className={({ isActive }) =>
                    cn(
                      "px-4 py-4 text-sm font-medium uppercase tracking-[0.22em] border-b border-border/30 animate-in fade-in slide-in-from-left-2 fill-mode-both duration-300 flex items-center justify-between",
                      isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span>{l.label}</span>
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-brand-red" />}
                    </>
                  )}
                </NavLink>
              ))}
              <div className="flex flex-col gap-3 mt-5">
                {isAdmin && (
                  <Button variant="outline" size="sm" className="rounded-none h-11" onClick={() => { navigate("/admin"); setOpen(false); }}>
                    {isEnglish ? "Admin panel" : "Pannello Admin"}
                  </Button>
                )}
                <Button className="rounded-none bg-primary text-primary-foreground h-11 tracking-[0.18em] uppercase text-[11px]" onClick={() => { navigate("/vendi"); setOpen(false); }}>
                  {isEnglish ? "Sell your car" : "Proponi la tua auto"}
                </Button>
                {user && (
                  <Button variant="ghost" size="sm" onClick={() => { signOut(); setOpen(false); }}>{isEnglish ? "Logout" : "Esci"}</Button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
};
