// Earth Imagery API
import { NASA_API, nasaFetch } from "./client";

const EARTH_BASE = "https://api.nasa.gov/planetary/earth";

export async function fetchEarthImagery({ lat, lon, date, dim = 0.1 } = {}) {
  if (!lat || !lon) throw new Error("lat and lon are required");
  
  return nasaFetch(
    `${EARTH_BASE}/imagery`,
    {
      lat,
      lon,
      date, // YYYY-MM-DD
      dim
    },
    { retries: 2, timeoutMs: 12000 }
  );
}

export async function fetchEarthAssets({ lat, lon, date, dim = 0.1 } = {}) {
  if (!lat || !lon) throw new Error("lat and lon are required");
  
  return nasaFetch(
    `${EARTH_BASE}/assets`,
    {
      lat,
      lon,
      date,
      dim
    },
    { retries: 2, timeoutMs: 10000 }
  );
}
