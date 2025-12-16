// Near Earth Objects API - Thiên thạch gần Trái Đất
import { NASA_API, nasaFetch } from "./client";

export async function fetchNeoFeed({ startDate, endDate } = {}) {
  const today = new Date().toISOString().split('T')[0];
  return nasaFetch(
    `${NASA_API.BASES.donki}/../neo/rest/v1/feed`,
    {
      start_date: startDate || today,
      end_date: endDate || today
    },
    { retries: 2, timeoutMs: 10000 }
  );
}

export async function fetchNeoLookup(asteroidId) {
  return nasaFetch(
    `${NASA_API.BASES.donki}/../neo/rest/v1/neo/${asteroidId}`,
    {},
    { retries: 2, timeoutMs: 10000 }
  );
}
