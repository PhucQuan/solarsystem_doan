const API_BASES = {
  apod: "https://api.nasa.gov/planetary/apod",
  images: "https://images-api.nasa.gov",
  mars: "https://api.nasa.gov/mars-photos/api/v1",
  donki: "https://api.nasa.gov/DONKI"
};

export function getNasaApiKey() {
  // Read from Vite env; fallback to undefined so callers can handle nicely
  const key = import.meta.env?.VITE_NASA_API_KEY;
  if (!key && typeof window !== "undefined") {
    // In dev, hint when the env variable wasn't loaded (e.g., dev server not restarted)
    // Only warn once per session
    if (!window.__nasa_env_warned) {
      console.warn("[NASA] VITE_NASA_API_KEY is missing. Using DEMO_KEY as fallback. Did you restart the dev server after creating .env?");
      window.__nasa_env_warned = true;
    }
  }
  return key;
}

export async function nasaFetch(url, params = {}, options = {}) {
  const { retries = 2, timeoutMs = 8000, allowDemoFallback = true } = options;
  const apiKey = getNasaApiKey();
  const makeUrl = (useDemo) => {
    const urlObj = new URL(url);
    // Attach api_key if hostname is api.nasa.gov
    if (urlObj.hostname.endsWith("api.nasa.gov")) {
      const keyToUse = !apiKey && useDemo && allowDemoFallback ? "DEMO_KEY" : apiKey;
      if (keyToUse) {
        urlObj.searchParams.set("api_key", keyToUse);
      }
    }
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") {
        urlObj.searchParams.set(k, String(v));
      }
    });
    return urlObj.toString();
  };

  let attempt = 0;
  let lastError;
  while (attempt <= retries) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(makeUrl(attempt > 0 && !apiKey), { signal: controller.signal });
      clearTimeout(id);
      if (!response.ok) {
        // Retry on transient server errors
        if ([502, 503, 504].includes(response.status) && attempt < retries) {
          attempt += 1;
          await new Promise((r) => setTimeout(r, 600 * attempt));
          continue;
        }
        const text = await response.text().catch(() => "");
        throw new Error(`NASA request failed (${response.status}): ${text || response.statusText}`);
      }
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) return response.json();
      return response.text();
    } catch (err) {
      clearTimeout(id);
      lastError = err;
      // Retry on abort/network
      if (attempt < retries) {
        attempt += 1;
        await new Promise((r) => setTimeout(r, 600 * attempt));
        continue;
      }
      break;
    }
  }
  throw lastError || new Error("NASA request failed");
}

export const NASA_API = {
  BASES: API_BASES,
};



