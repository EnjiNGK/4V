import { Link } from "react-router-dom";
import { Calendar, Gauge, Fuel, Settings2, ShieldCheck } from "lucide-react";
import { fmtKm, fmtPrice } from "@/lib/format";

export type CarCardData = {
  id: string;
  brand: string;
  model: string;
  version?: string | null;
  year: number;
  mileage_km: number;
  price_eur: number;
  fuel: string;
  transmission: string;
  cover?: string | null;
  featured?: boolean;
};

export const CarCard = ({ car }: { car: CarCardData }) => (
  <Link
    to={`/auto/${car.id}`}
    className="group block bg-gradient-card rounded-xl md:rounded-2xl overflow-hidden shadow-card hover:shadow-elegant transition-smooth border border-border/60 hover:border-accent/30"
  >
    <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
      {car.cover ? (
        <img
          src={car.cover}
          alt={`${car.brand} ${car.model}`}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-smooth duration-700"
        />
      ) : (
        <div className="w-full h-full grid place-items-center text-muted-foreground text-xs">—</div>
      )}
      <span className="absolute top-2 right-2 md:top-3 md:right-3 text-[8px] md:text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 md:px-2 py-1 rounded-full bg-black/70 backdrop-blur text-white border border-white/20 flex items-center gap-1">
        <ShieldCheck className="w-3 h-3 text-brand-red" />
        DVI
      </span>
      {car.featured && (
        <span className="absolute top-2 left-2 md:top-3 md:left-3 text-[9px] md:text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 md:px-2.5 md:py-1 rounded-full bg-gradient-brand text-white shadow-glow">
          In evidenza
        </span>
      )}
    </div>
    <div className="p-3 md:p-5">
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="min-w-0">
          <h3 className="font-display font-bold text-sm md:text-lg leading-tight truncate">{car.brand} {car.model}</h3>
          {car.version && <p className="text-[11px] md:text-xs text-muted-foreground line-clamp-1">{car.version}</p>}
        </div>
      </div>
      <div className="mt-2 md:mt-3 grid grid-cols-2 gap-y-1 md:gap-y-1.5 gap-x-2 md:gap-x-3 text-[10.5px] md:text-xs text-muted-foreground">
        <span className="flex items-center gap-1 md:gap-1.5"><Calendar className="w-3 h-3 md:w-3.5 md:h-3.5 shrink-0" />{car.year}</span>
        <span className="flex items-center gap-1 md:gap-1.5 truncate"><Gauge className="w-3 h-3 md:w-3.5 md:h-3.5 shrink-0" />{fmtKm(car.mileage_km)}</span>
        <span className="flex items-center gap-1 md:gap-1.5 truncate"><Fuel className="w-3 h-3 md:w-3.5 md:h-3.5 shrink-0" />{car.fuel}</span>
        <span className="flex items-center gap-1 md:gap-1.5 truncate"><Settings2 className="w-3 h-3 md:w-3.5 md:h-3.5 shrink-0" />{car.transmission}</span>
      </div>
      <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-border/60 flex items-baseline justify-between gap-2">
        <span className="text-base md:text-2xl font-display font-bold text-gradient-brand truncate">{fmtPrice(car.price_eur)}</span>
        <span className="text-[10px] md:text-xs font-medium text-accent group-hover:translate-x-1 transition-smooth shrink-0">→</span>
      </div>
    </div>
  </Link>
);
