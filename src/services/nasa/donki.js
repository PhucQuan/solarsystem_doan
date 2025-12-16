// DONKI - Space Weather Database API
import { NASA_API, nasaFetch } from "./client";

// Solar Flares
export async function fetchSolarFlares({ startDate, endDate } = {}) {
  const end = new Date().toISOString().split('T')[0];
  const start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  return nasaFetch(
    `${NASA_API.BASES.donki}/FLR`,
    {
      startDate: startDate || start,
      endDate: endDate || end
    },
    { retries: 2, timeoutMs: 10000 }
  );
}

// Coronal Mass Ejections
export async function fetchCME({ startDate, endDate } = {}) {
  const end = new Date().toISOString().split('T')[0];
  const start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  return nasaFetch(
    `${NASA_API.BASES.donki}/CME`,
    {
      startDate: startDate || start,
      endDate: endDate || end
    },
    { retries: 2, timeoutMs: 10000 }
  );
}

// Geomagnetic Storms
export async function fetchGeomagneticStorms({ startDate, endDate } = {}) {
  const end = new Date().toISOString().split('T')[0];
  const start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  return nasaFetch(
    `${NASA_API.BASES.donki}/GST`,
    {
      startDate: startDate || start,
      endDate: endDate || end
    },
    { retries: 2, timeoutMs: 10000 }
  );
}
