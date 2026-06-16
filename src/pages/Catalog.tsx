import { Seo } from "@/components/Seo";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CarCard, CarCardData } from "@/components/CarCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { FUELS, TRANSMISSIONS, BODIES, ERAS, CONDITIONS, fmtPrice, fmtKm } from "@/lib/format";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const Catalog = () => {
  const { isEnglish } = useLanguage();
  const [cars, setCars] = useState<CarCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [fuel, setFuel] = useState<string>("all");
  const [transmission, setTransmission] = useState<string>("all");
  const [body, setBody] = useState<string>("all");
  const [era, setEra] = useState<string>("all");
  const [condition, setCondition] = useState<string>("all");
  const [priceMax, setPriceMax] = useState(300000);
  const [priceMin, setPriceMin] = useState(0);
  const [yearMin, setYearMin] = useState(1900);
  const [yearMax, setYearMax] = useState(new Date().getFullYear());
  const [kmMax, setKmMax] = useState(500000);
  const [powerMin, setPowerMin] = useState(0);
  const [onlyInspection, setOnlyInspection] = useState(false);
  const [onlyDocuments, setOnlyDocuments] = useState(false);
  const [onlyMatching, setOnlyMatching] = useState(false);
  const [onlyBrochure, setOnlyBrochure] = useState(false);
  const [sort, setSort] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("cars")
        .select("id, brand, model, version, year, mileage_km, price_eur, fuel, transmission, body_type, condition, power_hp, has_inspection, has_documents, matching_numbers, brochure_url, featured, created_at, car_images(url, is_cover, position)")
        .eq("status", "published");
      const mapped = (data ?? []).map((c: any) => ({
        ...c,
        cover: (c.car_images?.find((i: any) => i.is_cover) ?? c.car_images?.[0])?.url ?? null,
      }));
      setCars(mapped);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    let res = cars.filter((c: any) => {
      if (q && !`${c.brand} ${c.model} ${c.version ?? ""}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (fuel !== "all" && c.fuel !== fuel) return false;
      if (transmission !== "all" && c.transmission !== transmission) return false;
      if (body !== "all" && c.body_type !== body) return false;
      if (condition !== "all" && c.condition !== condition) return false;
      if (era !== "all") {
        const e = ERAS.find((x) => x.label === era);
        if (e && (c.year < e.min || c.year > e.max)) return false;
      }
      if (c.price_eur > priceMax || c.price_eur < priceMin) return false;
      if (c.year < yearMin || c.year > yearMax) return false;
      if ((c.mileage_km ?? 0) > kmMax) return false;
      if (powerMin > 0 && (c.power_hp ?? 0) < powerMin) return false;
      if (onlyInspection && !c.has_inspection) return false;
      if (onlyDocuments && !c.has_documents) return false;
      if (onlyMatching && !c.matching_numbers) return false;
      if (onlyBrochure && !c.brochure_url) return false;
      return true;
    });
    if (sort === "price-asc") res = [...res].sort((a, b) => a.price_eur - b.price_eur);
    if (sort === "price-desc") res = [...res].sort((a, b) => b.price_eur - a.price_eur);
    if (sort === "km-asc") res = [...res].sort((a, b) => a.mileage_km - b.mileage_km);
    if (sort === "year-desc") res = [...res].sort((a, b) => b.year - a.year);
    if (sort === "year-asc") res = [...res].sort((a, b) => a.year - b.year);
    return res;
  }, [cars, q, fuel, transmission, body, era, condition, priceMin, priceMax, yearMin, yearMax, kmMax, powerMin, onlyInspection, onlyDocuments, onlyMatching, onlyBrochure, sort]);

  const reset = () => {
    setQ(""); setFuel("all"); setTransmission("all"); setBody("all"); setEra("all"); setCondition("all");
    setPriceMin(0); setPriceMax(300000);
    setYearMin(1900); setYearMax(new Date().getFullYear());
    setKmMax(500000); setPowerMin(0);
    setOnlyInspection(false); setOnlyDocuments(false); setOnlyMatching(false); setOnlyBrochure(false);
  };

  return (
    <div className="container py-10 md:py-16">
      <Seo
        title={isEnglish ? "Catalog of classic cars for sale | V4 Vintage Verified" : "Catalogo auto storiche in vendita | V4 Vintage Verified"}
        description={isEnglish ? "Browse our catalog of classic, youngtimer and collectible cars verified by V4 and certified on blockchain with CertiShield." : "Sfoglia il catalogo di auto storiche, youngtimer e da collezione verificate da V4 e certificate su blockchain con CertiShield."}
        path="/catalogo"
      />
      <div className="mb-8">
        <div className="text-xs uppercase tracking-[0.3em] text-accent font-semibold mb-3">{isEnglish ? "Catalog" : "Catalogo"}</div>
        <h1 className="font-serif-display text-4xl md:text-6xl mb-2">{isEnglish ? "Our classic cars" : "Le nostre auto storiche"}</h1>
        <p className="text-muted-foreground">{filtered.length} {isEnglish ? (filtered.length === 1 ? "vehicle available" : "vehicles available") : (filtered.length === 1 ? "vettura disponibile" : "vetture disponibili")}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters */}
        <aside className={`lg:w-72 lg:block ${showFilters ? "block" : "hidden"}`}>
          <div className="bg-card rounded-lg p-6 border border-border shadow-card sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif-display text-xl">{isEnglish ? "Filters" : "Filtri"}</h3>
              <Button variant="ghost" size="sm" onClick={reset}><X className="w-4 h-4 mr-1" />Reset</Button>
            </div>
            <div className="space-y-5">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">{isEnglish ? "Search" : "Cerca"}</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={isEnglish ? "Make, model..." : "Marca, modello..."} className="pl-9" />
                </div>
              </div>
              <FilterSelect label={isEnglish ? "Era" : "Epoca"} value={era} onChange={setEra} options={ERAS.map((e) => e.label)} />
              <FilterSelect label={isEnglish ? "Body" : "Carrozzeria"} value={body} onChange={setBody} options={BODIES} />
              <FilterSelect label={isEnglish ? "Fuel" : "Carburante"} value={fuel} onChange={setFuel} options={FUELS} />
              <FilterSelect label={isEnglish ? "Transmission" : "Cambio"} value={transmission} onChange={setTransmission} options={TRANSMISSIONS} />
              <FilterSelect label={isEnglish ? "Condition" : "Stato vettura"} value={condition} onChange={setCondition} options={CONDITIONS} />
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">{isEnglish ? "Price" : "Prezzo"}: {fmtPrice(priceMin)} – {fmtPrice(priceMax)}</label>
                <Slider min={0} max={500000} step={1000} value={[priceMin, priceMax]} onValueChange={(v) => { setPriceMin(v[0]); setPriceMax(v[1]); }} />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">{isEnglish ? "Year" : "Anno"}: {yearMin} – {yearMax}</label>
                <Slider min={1900} max={new Date().getFullYear()} step={1} value={[yearMin, yearMax]} onValueChange={(v) => { setYearMin(v[0]); setYearMax(v[1]); }} />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">{isEnglish ? "Max km" : "Km max"}: {fmtKm(kmMax)}</label>
                <Slider min={0} max={500000} step={5000} value={[kmMax]} onValueChange={(v) => setKmMax(v[0])} />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">{isEnglish ? "Min power" : "Potenza min"}: {powerMin} {isEnglish ? "HP" : "CV"}</label>
                <Slider min={0} max={800} step={10} value={[powerMin]} onValueChange={(v) => setPowerMin(v[0])} />
              </div>
              <div className="pt-3 border-t border-border space-y-3">
                <FilterToggle label={isEnglish ? "Appraisal available" : "Perizia disponibile"} checked={onlyInspection} onChange={setOnlyInspection} />
                <FilterToggle label={isEnglish ? "Documents in order" : "Documenti regolari"} checked={onlyDocuments} onChange={setOnlyDocuments} />
                <FilterToggle label={isEnglish ? "Matching numbers" : "Matching numbers"} checked={onlyMatching} onChange={setOnlyMatching} />
                <FilterToggle label={isEnglish ? "With PDF brochure" : "Con brochure PDF"} checked={onlyBrochure} onChange={setOnlyBrochure} />
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex items-center justify-between gap-3 mb-6">
            <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal className="w-4 h-4 mr-2" /> {isEnglish ? "Filters" : "Filtri"}
            </Button>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-56 ml-auto"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{isEnglish ? "Newest" : "Più recenti"}</SelectItem>
                <SelectItem value="price-asc">{isEnglish ? "Price ascending" : "Prezzo crescente"}</SelectItem>
                <SelectItem value="price-desc">{isEnglish ? "Price descending" : "Prezzo decrescente"}</SelectItem>
                <SelectItem value="km-asc">{isEnglish ? "Lowest mileage" : "Meno km"}</SelectItem>
                <SelectItem value="year-asc">{isEnglish ? "Oldest year" : "Anno più antico"}</SelectItem>
                <SelectItem value="year-desc">{isEnglish ? "Newest year" : "Anno più recente"}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-5 md:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] rounded-xl md:rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 border-2 border-dashed border-border rounded-2xl">
              <Search className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">{isEnglish ? "No cars found. Try adjusting the filters." : "Nessuna auto trovata. Prova a modificare i filtri."}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-5 md:gap-6">
              {filtered.map((c) => <CarCard key={c.id} car={c} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FilterSelect = ({ label, value, onChange, options }: any) => (
  <div>
    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">{label}</label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger><SelectValue /></SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{typeof window !== "undefined" && document.documentElement.lang === "en" ? "All" : "Tutti"}</SelectItem>
        {options.map((o: string) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
      </SelectContent>
    </Select>
  </div>
);

const FilterToggle = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
  <div className="flex items-center justify-between">
    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
    <Switch checked={checked} onCheckedChange={onChange} />
  </div>
);

export default Catalog;
