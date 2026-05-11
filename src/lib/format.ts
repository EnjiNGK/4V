export const fmtPrice = (n: number) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
export const fmtKm = (n: number) =>
  new Intl.NumberFormat("it-IT").format(n) + " km";
export const FUELS = ["Benzina", "Diesel", "GPL", "Metano", "Elettrica"];
export const TRANSMISSIONS = ["Manuale", "Automatica", "Semi-automatica"];
export const BODIES = ["Berlina", "Coupé", "Cabrio", "Spider", "Roadster", "Targa", "Station Wagon", "City Car"];
export const CONDITIONS = ["Restaurata", "Conservata", "Originale", "Da restaurare"];
export const ERAS = [
  { label: "Ante Guerra (< 1945)", min: 1900, max: 1944 },
  { label: "Anni '50", min: 1945, max: 1959 },
  { label: "Anni '60", min: 1960, max: 1969 },
  { label: "Anni '70", min: 1970, max: 1979 },
  { label: "Anni '80", min: 1980, max: 1989 },
  { label: "Youngtimer (1990+)", min: 1990, max: 2005 },
];
