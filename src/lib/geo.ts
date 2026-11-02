// Distance and opening-hours helpers for "shops near you". Pure functions, no browser APIs.
// With a real database, distance is better done in the database itself (PostGIS ST_Distance / ST_DWithin);
// these functions then only format what comes back.

export type LatLng = { lat: number; lng: number };

/** Big-city centres, used when the shopper would rather pick a city than share their location. */
export const CITY_CENTERS: (LatLng & { name: string })[] = [
  { name: "Lagos", lat: 6.5244, lng: 3.3792 },
  { name: "Abuja", lat: 9.0765, lng: 7.3986 },
  { name: "Port Harcourt", lat: 4.8156, lng: 7.0498 },
  { name: "Ibadan", lat: 7.3775, lng: 3.947 },
];

const toRad = (deg: number) => (deg * Math.PI) / 180;

/** Straight-line distance in kilometres (haversine). Roads are longer, so treat it as "about". */
export function distanceKm(a: LatLng, b: LatLng): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.max(50, Math.round((km * 1000) / 50) * 50)} m`;
  return `${km < 10 ? km.toFixed(1) : Math.round(km)} km`;
}

export function nearestCity(point: LatLng) {
  return CITY_CENTERS.reduce((best, city) => (distanceKm(point, city) < distanceKm(point, best) ? city : best));
}

const minutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export const formatHour = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  return `${h % 12 || 12}${m ? `:${String(m).padStart(2, "0")}` : ""}${suffix}`;
};

/** "Open until 8pm" / "Closed · opens 8am", from opening hours like "08:00" and "20:00". */
export function openStatus(opens: string, closes: string, now: Date): { open: boolean; label: string } {
  const current = now.getHours() * 60 + now.getMinutes();
  const open = current >= minutes(opens) && current < minutes(closes);
  return open ? { open, label: `Open until ${formatHour(closes)}` } : { open, label: `Closed · opens ${formatHour(opens)}` };
}
