export const OWNER_INFO = {
  legalName: "Federico Volontè",
  addressStreet: "Via Cascina Restelli 18",
  addressZipCity: "22070 Limido Comasco (CO)",
  get fullAddress() {
    return `${this.addressStreet}, ${this.addressZipCity}`;
  },
  piva: "03849530138",
  cf: "VLNFRC82L05B639E",
  pec: "Federico.volonte@pec.it",
  phoneE164: "+393808645012",
  phoneDisplay: "+39 380 864 5012",
  mapsQuery: "Via Cascina Restelli 18, 22070 Limido Comasco CO Italia",
} as const;

export const OWNER_MAPS_URL = `https://maps.google.com/?q=${encodeURIComponent(OWNER_INFO.mapsQuery)}`;
