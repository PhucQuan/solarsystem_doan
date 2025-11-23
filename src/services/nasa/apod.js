import { NASA_API, nasaFetch } from "./client";

export async function fetchApod({ date, hd } = {}) {
  return nasaFetch(
    NASA_API.BASES.apod,
    {
      date, // YYYY-MM-DD
      hd: hd ? "true" : undefined
    },
    { retries: 2, timeoutMs: 10000, allowDemoFallback: true }
  );
}



