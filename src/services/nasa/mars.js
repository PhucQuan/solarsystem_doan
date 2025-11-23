// Mars Rover Photos API
import { NASA_API, nasaFetch } from "./client";

export async function fetchMarsPhotos({ rover = 'curiosity', sol, earthDate, camera, page = 1 } = {}) {
  const params = { page };
  
  if (sol !== undefined) {
    params.sol = sol;
  } else if (earthDate) {
    params.earth_date = earthDate;
  } else {
    params.sol = 1000; // default
  }
  
  if (camera) params.camera = camera;
  
  return nasaFetch(
    `${NASA_API.BASES.mars}/rovers/${rover}/photos`,
    params,
    { retries: 2, timeoutMs: 12000 }
  );
}

export async function fetchMarsManifest(rover = 'curiosity') {
  return nasaFetch(
    `${NASA_API.BASES.mars}/manifests/${rover}`,
    {},
    { retries: 2, timeoutMs: 10000 }
  );
}
