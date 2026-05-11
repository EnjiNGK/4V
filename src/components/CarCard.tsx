import { Link } from "react-router-dom";
import { Calendar, Gauge, Fuel, Settings2 } from "lucide-react";
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
    className="group block bg-gradient-card rounded-2xl overflow-hidden shadow-card hover:shadow-elegant transition-smooth border border-border/60 hover:border-accent/30"
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
        <div className="w-full h-full grid place-items-center text-muted-foreground text-sm">Nessuna immagine</div>
      )}
      {car.featured && (
        <span className="absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-gradient-brand text-white shadow-glow">
          In evidenza
        </span>
      )}
    </div>
    <div className="p-5">
      <div className="flex items-start justify-between gap-3 mb-1">
        <div>
          <h3 className="font-display font-bold text-lg leading-tight">{car.brand} {car.model}</h3>
          {car.version && <p className="text-xs text-muted-foreground line-clamp-1">{car.version}</p>}
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-y-1.5 gap-x-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{car.year}</span>
        <span className="flex items-center gap-1.5"><Gauge className="w-3.5 h-3.5" />{fmtKm(car.mileage_km)}</span>
        <span className="flex items-center gap-1.5"><Fuel className="w-3.5 h-3.5" />{car.fuel}</span>
        <span className="flex items-center gap-1.5"><Settings2 className="w-3.5 h-3.5" />{car.transmission}</span>
      </div>
      <div className="mt-4 pt-4 border-t border-border/60 flex items-baseline justify-between">
        <span className="text-2xl font-display font-bold text-gradient-brand">{fmtPrice(car.price_eur)}</span>
        <span className="text-xs font-medium text-accent group-hover:translate-x-1 transition-smooth">Vedi →</span>
      </div>
    </div>
  </Link>
);
