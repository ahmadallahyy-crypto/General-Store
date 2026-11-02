"use client";

import { useCallback, useState } from "react";
import { CITY_CENTERS, nearestCity, type LatLng } from "@/lib/geo";
import { usePersistentState } from "@/lib/use-persistent-state";

export type UserLocation = LatLng & { source: "gps" | "city"; label: string };
export type LocationStatus = "idle" | "asking" | "denied" | "unavailable" | "timeout" | "unsupported";

// Round to about 100 m. Plenty for "near me", and we never keep more precision than we need.
const round = (n: number) => Math.round(n * 1000) / 1000;

/**
 * The shopper's chosen location: from the browser's GPS (they are asked first) or by picking a city.
 * It is saved ONLY in this browser (localStorage) and never sent anywhere. Needs HTTPS in production.
 * When there is a back end, the same value can be sent with a search request so the server does the sorting.
 */
export function useUserLocation() {
  const [location, setLocation, isHydrated] = usePersistentState<UserLocation | null>("generalstore-location", null);
  const [status, setStatus] = useState<LocationStatus>("idle");

  const requestGps = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return setStatus("unsupported");
    setStatus("asking");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const point = { lat: round(pos.coords.latitude), lng: round(pos.coords.longitude) };
        setLocation({ ...point, source: "gps", label: nearestCity(point).name });
        setStatus("idle");
      },
      (err) => setStatus(err.code === 1 ? "denied" : err.code === 3 ? "timeout" : "unavailable"),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 10 * 60 * 1000 }
    );
  }, [setLocation]);

  const chooseCity = useCallback(
    (name: string) => {
      const city = CITY_CENTERS.find((c) => c.name === name);
      if (city) {
        setLocation({ lat: city.lat, lng: city.lng, source: "city", label: city.name });
        setStatus("idle");
      }
    },
    [setLocation]
  );

  const clear = useCallback(() => {
    setLocation(null);
    setStatus("idle");
  }, [setLocation]);

  return { location, isHydrated, status, requestGps, chooseCity, clear };
}
