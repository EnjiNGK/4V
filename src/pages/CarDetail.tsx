import { useEffect, useState } from "react";
import { CertiShieldPassport } from "@/components/CertiShieldPassport";
import { Seo } from "@/components/Seo";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { fmtKm, fmtPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Gauge, Fuel, Settings2, Cog, Palette, Users, FileCheck, ShieldCheck, MapPin, Phone, Mail, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/lib/i18n";
import { OWNER_INFO } from "@/lib/ownerInfo";

const CarDetail = () => {
  const { isEnglish } = useLanguage();
  const { id } = useParams();
  const [car, setCar] = useState<any>(null);
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("cars")
        .select("*, car_images(*)")
        .eq("id", id)
        .eq("status", "published")
        .maybeSingle();
      if (error || !data) { setLoading(false); return; }
      setCar(data);
      const imgs = (data.car_images ?? []).sort((a: any, b: any) => a.position - b.position);
      setImages(imgs);
      setLoading(false);
    })();
  }, [id]);

  useEffect(() => {
    if (loading || !car) return;
    if (window.location.hash === "#passaporto-digitale") {
      const t = window.setTimeout(() => {
        document.getElementById("passaporto-digitale")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
      return () => window.clearTimeout(t);
    }
  }, [loading, car]);

  if (loading) return <div className="container py-20"><div className="h-[400px] bg-muted animate-pulse rounded-2xl" /></div>;
  if (!car) return (
    <div className="container py-20 text-center">
      <h1 className="font-display text-3xl mb-4">{isEnglish ? "Car not found" : "Auto non trovata"}</h1>
      <Button asChild><Link to="/catalogo">{isEnglish ? "Back to catalog" : "Torna al catalogo"}</Link></Button>
    </div>
  );

  const next = () => setActiveImg((i) => (i + 1) % Math.max(1, images.length));
  const prev = () => setActiveImg((i) => (i - 1 + images.length) % Math.max(1, images.length));

  const specs = [
    { icon: Calendar, label: isEnglish ? "Year" : "Anno", value: car.year },
    { icon: Gauge, label: isEnglish ? "Mileage" : "Chilometraggio", value: fmtKm(car.mileage_km) },
    { icon: Fuel, label: isEnglish ? "Fuel" : "Carburante", value: car.fuel },
    { icon: Settings2, label: isEnglish ? "Transmission" : "Cambio", value: car.transmission },
    { icon: Cog, label: isEnglish ? "Power" : "Potenza", value: car.power_hp ? `${car.power_hp} ${isEnglish ? "HP" : "CV"}` : "—" },
    { icon: Cog, label: isEnglish ? "Displacement" : "Cilindrata", value: car.displacement_cc ? `${car.displacement_cc} cc` : "—" },
    { icon: Palette, label: isEnglish ? "Color" : "Colore", value: car.color ?? "—" },
    { icon: Users, label: isEnglish ? "Owners" : "Proprietari", value: car.previous_owners ?? "—" },
  ];

  return (
    <div className="container py-8 md:py-12">
      <Seo
        title={`${car.brand} ${car.model}${car.year ? " " + car.year : ""} — ${fmtPrice(car.price_eur)} | V4 Vintage Verified`}
        description={`${car.brand} ${car.model}${car.year ? `, ${car.year}` : ""}${car.mileage_km ? `, ${fmtKm(car.mileage_km)}` : ""}${car.fuel ? `, ${car.fuel}` : ""}. ${car.description?.slice(0, 110) ?? "Auto storica selezionata e verificata da V4 Vintage Verified."}`}
        path={`/auto/${car.id}`}
        type="product"
        image={images[0]?.url}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Car",
          name: `${car.brand} ${car.model}`,
          brand: { "@type": "Brand", name: car.brand },
          model: car.model,
          vehicleModelDate: car.year ? String(car.year) : undefined,
          mileageFromOdometer: car.mileage_km ? { "@type": "QuantitativeValue", value: car.mileage_km, unitCode: "KMT" } : undefined,
          fuelType: car.fuel,
          color: car.color,
          image: images.map((i: any) => i.url),
          offers: {
            "@type": "Offer",
            price: car.price_eur,
            priceCurrency: "EUR",
            availability: "https://schema.org/InStock",
            url: `/auto/${car.id}`,
          },
        }}
      />
      <Link to="/catalogo" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4 mr-1" /> {isEnglish ? "Back to catalog" : "Torna al catalogo"}
      </Link>

      <div className="grid lg:grid-cols-[1.5fr,1fr] gap-8">
        {/* Gallery */}
        <div>
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-secondary shadow-elegant">
            {images[activeImg] ? (
              <img
                src={images[activeImg].url}
                alt={`${car.brand} ${car.model}`}
                className="w-full h-full object-cover cursor-zoom-in"
                onClick={() => setLightbox(true)}
              />
            ) : (
              <div className="w-full h-full grid place-items-center text-muted-foreground">Nessuna immagine</div>
            )}
            {images.length > 1 && (
              <>
                <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur grid place-items-center hover:bg-background"><ChevronLeft /></button>
                <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur grid place-items-center hover:bg-background"><ChevronRight /></button>
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/60 text-white text-xs">{activeImg + 1} / {images.length}</div>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-6 md:grid-cols-8 gap-2 mt-3">
              {images.slice(0, 16).map((img, i) => (
                <button key={img.id} onClick={() => setActiveImg(i)} className={`aspect-square rounded-lg overflow-hidden border-2 transition ${i === activeImg ? "border-accent" : "border-transparent"}`}>
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
              {images.length > 16 && (
                <button onClick={() => setLightbox(true)} className="aspect-square rounded-lg bg-secondary text-xs font-semibold">+{images.length - 16}</button>
              )}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-accent font-semibold mb-2">{car.condition}</div>
          <h1 className="font-display font-bold text-3xl md:text-4xl leading-tight">{car.brand} {car.model}</h1>
          {car.version && <p className="text-muted-foreground mt-1">{car.version}</p>}
          <div className="mt-6 p-6 bg-gradient-card rounded-2xl border border-border shadow-card">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{isEnglish ? "Price" : "Prezzo"}</div>
            <div className="font-display font-bold text-4xl text-gradient-brand">{fmtPrice(car.price_eur)}</div>
            <div className="text-xs text-muted-foreground mt-1">{isEnglish ? "Sale exclusively in person" : "Vendita esclusivamente in presenza"}</div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button size="lg" className="bg-accent hover:bg-accent text-white" onClick={() => { window.location.href = `tel:${OWNER_INFO.phoneE164}`; }}>
              <Phone className="w-4 h-4 mr-2" /> {isEnglish ? "Call" : "Chiama"}
            </Button>
            <Button size="lg" variant="outline" onClick={() => { navigator.clipboard.writeText(OWNER_INFO.pec); toast.success(isEnglish ? "Email copied" : "Email copiata"); }}>
              <Mail className="w-4 h-4 mr-2" /> Email
            </Button>
          </div>

          {car.brochure_url ? (
            <a
              href={car.brochure_url}
              target="_blank"
              rel="noreferrer"
              className="mt-4 flex items-center justify-between gap-3 p-4 border border-foreground/15 hover:border-foreground transition-smooth group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 grid place-items-center bg-brand-red/10 text-brand-red">
                  <Download className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="hairline text-muted-foreground">Brochure</div>
                  <div className="font-display text-base">{isEnglish ? "Download PDF brochure" : "Scarica brochure PDF"}</div>
                </div>
              </div>
              <span className="text-xs text-muted-foreground group-hover:text-foreground">PDF →</span>
            </a>
          ) : (
            <div className="mt-4 flex items-center justify-between gap-3 p-4 border border-dashed border-foreground/10 text-muted-foreground">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 grid place-items-center bg-muted text-muted-foreground">
                  <Download className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="hairline">Brochure</div>
                  <div className="font-display text-base">{isEnglish ? "Not available — request it by email" : "Non disponibile — richiedila via email"}</div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 space-y-2">
            {car.certishield_url && <Badge icon={ShieldCheck} text={isEnglish ? "CertiShield blockchain DVP" : "DVP CertiShield (blockchain)"} />}
            {car.has_documents && <Badge icon={FileCheck} text={isEnglish ? "Documents in order" : "Documenti regolari"} />}
            {car.has_inspection && <Badge icon={ShieldCheck} text={isEnglish ? "Appraisal available" : "Perizia disponibile"} />}
            {car.matching_numbers && <Badge icon={ShieldCheck} text="Matching numbers" />}
            {car.location && <Badge icon={MapPin} text={car.location} />}
          </div>
          <a
            href="#passaporto-digitale"
            className="mt-4 block text-center text-xs font-medium uppercase tracking-[0.15em] text-accent hover:text-foreground border border-accent/30 hover:border-accent py-2.5 transition-smooth"
          >
            {isEnglish ? "Open digital passport ↓" : "Apri passaporto digitale ↓"}
          </a>

        </div>
      </div>

      {/* Specs */}
      <section className="mt-12">
        <h2 className="font-display font-bold text-2xl mb-5">{isEnglish ? "Technical specs" : "Scheda tecnica"}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {specs.map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary grid place-items-center text-primary">
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
                <div className="font-semibold text-sm">{s.value}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {car.description && (
        <section className="mt-10">
          <h2 className="font-display font-bold text-2xl mb-4">{isEnglish ? "Description" : "Descrizione"}</h2>
          <div className="bg-card border border-border rounded-2xl p-6 whitespace-pre-line text-sm leading-relaxed">{car.description}</div>
        </section>
      )}

      {car.inspection_notes && (
        <section className="mt-10">
          <h2 className="font-display font-bold text-2xl mb-4">{isEnglish ? "Appraisal notes" : "Note perizia"}</h2>
          <div className="bg-card border border-border rounded-2xl p-6 whitespace-pre-line text-sm leading-relaxed">{car.inspection_notes}</div>
        </section>
      )}

      <section className="mt-12">
        <CertiShieldPassport
          passportUrl={car.certishield_url}
          isEnglish={isEnglish}
          brand={car.brand}
          model={car.model}
          year={car.year}
        />
      </section>

      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/95 grid place-items-center p-4" onClick={() => setLightbox(false)}>
          <button className="absolute top-4 right-4 text-white text-3xl">×</button>
          <img src={images[activeImg]?.url} className="max-w-full max-h-full object-contain" onClick={(e) => e.stopPropagation()} />
          {images.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 text-white"><ChevronLeft className="w-10 h-10" /></button>
              <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-white"><ChevronRight className="w-10 h-10" /></button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const Badge = ({ icon: Icon, text }: any) => (
  <div className="flex items-center gap-2 text-sm">
    <Icon className="w-4 h-4 text-accent" /> {text}
  </div>
);

export default CarDetail;
