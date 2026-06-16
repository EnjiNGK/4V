import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
    { to: "/certificazione-digitale", label: isEnglish ? "CertiShield" : "CertiShield" },
  ];

  const overHero = location.pathname === "/" || location.pathname === "/chi-siamo" || location.pathname === "/contatti";
  const transparent = overHero && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

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
        <Link
          to="/"
          onClick={(e) => {
            if (location.pathname === "/") { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }
          }}
          className="flex items-center gap-3 group min-w-0 shrink-0"
        >
          <img
            src="/logo-v4.png"
            alt="V4 Vintage Verified — logo"
            width={44}
            height={44}
            className="w-10 h-10 md:w-11 md:h-11 object-contain group-hover:scale-105 transition-smooth shrink-0"
          />

        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              onClick={(e) => {
                if (location.pathname === l.to) { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }
              }}
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

      {open && createPortal(
        <div className="lg:hidden fixed inset-0 z-[100] bg-foreground text-background animate-in fade-in duration-200 flex flex-col">
          {/* Top bar inside menu */}
          <div className="container flex items-center justify-between h-16 md:h-20 border-b border-background/10 shrink-0">
            <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-3">
              <img src="/logo-v4.png" alt="V4 Vintage Verified" width={40} height={40} className="w-10 h-10 object-contain" />
            </Link>

            <button
              onClick={() => setOpen(false)}
              aria-label="Chiudi menu"
              className="p-2 -mr-2 text-background hover:text-background/70 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="container py-10 flex flex-col gap-1">
              <div className="hairline text-background/40 mb-2">— Menu</div>
              {links.map((l, i) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === "/"}
                  onClick={(e) => {
                    if (location.pathname === l.to) { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }
                    setOpen(false);
                  }}
                  style={{ animationDelay: `${i * 60}ms` }}
                  className={({ isActive }) =>
                    cn(
                      "group flex items-center justify-between py-5 border-b border-background/10",
                      "font-serif-display text-3xl md:text-4xl tracking-tight",
                      "animate-in fade-in slide-in-from-left-3 fill-mode-both duration-400",
                      isActive ? "text-background" : "text-background/55 hover:text-background"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className="flex items-center gap-4">
                        <span className={cn("font-mono text-[10px] tracking-widest", isActive ? "text-brand-red" : "text-background/30")}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span>{l.label}</span>
                      </span>
                      <span className={cn("text-background/30 group-hover:translate-x-1 transition-transform", isActive && "text-brand-red")}>→</span>
                    </>
                  )}
                </NavLink>
              ))}

              <div className="mt-10 flex flex-col gap-3">
                <Button
                  className="rounded-none bg-brand-red text-white hover:bg-brand-red/90 h-12 tracking-[0.2em] uppercase text-[11px]"
                  onClick={() => { navigate("/vendi"); setOpen(false); }}
                >
                  {isEnglish ? "Sell your car" : "Proponi la tua auto"}
                </Button>
                {isAdmin && (
                  <Button
                    variant="outline"
                    className="rounded-none border-background/30 bg-transparent text-background hover:bg-background hover:text-foreground h-12"
                    onClick={() => { navigate("/admin"); setOpen(false); }}
                  >
                    <ShieldCheck className="w-4 h-4 mr-2" /> {isEnglish ? "Admin panel" : "Pannello Admin"}
                  </Button>
                )}
                {user && (
                  <Button
                    variant="ghost"
                    className="text-background/70 hover:text-background hover:bg-background/10 h-11"
                    onClick={() => { signOut(); setOpen(false); }}
                  >
                    {isEnglish ? "Logout" : "Esci"}
                  </Button>
                )}
              </div>

              <div className="mt-12 pt-8 border-t border-background/10 flex items-center justify-between">
                <div className="hairline text-background/40">{isEnglish ? "Language" : "Lingua"}</div>
                <div className="flex items-center border border-background/20 px-1 py-1">
                  {(["it", "en"] as const).map((lng) => (
                    <button
                      key={lng}
                      type="button"
                      onClick={() => setLanguage(lng)}
                      className={cn(
                        "px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] transition-colors",
                        language === lng ? "bg-background text-foreground" : "text-background/60 hover:text-background"
                      )}
                    >
                      {lng}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-10 text-[10px] uppercase tracking-[0.25em] text-background/40">
                Vintage · Vehicles · Verified
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
};
