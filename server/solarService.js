

// Using native fetch (Node 18+)

const BASE_URL = "https://api.le-systeme-solaire.net/rest";

// Map English names to Vietnamese for better search
const NAME_MAP = {
    "mercury": "mercure",
    "venus": "venus",
    "earth": "terre",
    "mars": "mars",
    "jupiter": "jupiter",
    "saturn": "saturne",
    "uranus": "uranus",
    "neptune": "neptune",
    "pluto": "pluton",
    "sun": "soleil",
    "moon": "lune"
};

export async function fetchSolarData(query) {
    try {
        // 1. Try to find direct match in our map or use the query strictly
        let searchId = query.toLowerCase().trim();

        // Check if user typed a Vietnamese name or English name that needs mapping to French ID used by API
        if (searchId === "sao thủy" || searchId === "thủy tinh") searchId = "mercure";
        if (searchId === "sao kim" || searchId === "kim tinh") searchId = "venus";
        if (searchId === "trái đất" || searchId === "địa cầu") searchId = "terre";
        if (searchId === "sao hỏa" || searchId === "hỏa tinh") searchId = "mars";
        if (searchId === "sao mộc" || searchId === "mộc tinh") searchId = "jupiter";
        if (searchId === "sao thổ" || searchId === "thổ tinh") searchId = "saturne";
        if (searchId === "sao thiên vương") searchId = "uranus";
        if (searchId === "sao hải vương") searchId = "neptune";
        if (searchId === "sao diêm vương") searchId = "pluton";
        if (searchId === "mặt trời") searchId = "soleil";
        if (searchId === "mặt trăng") searchId = "lune";

        // If it is in our English map, use that
        if (NAME_MAP[searchId]) {
            searchId = NAME_MAP[searchId];
        }

        console.log(`[SolarService] Searching for: ${searchId}`);

        const response = await fetch(`${BASE_URL}/bodies/${searchId}`);

        if (!response.ok) {
            // If exact match fails, try search
            // Note: The API doesn't have a fuzzy search easily accessible without getting all bodies.
            // For now, return null if not found to allow fallback.
            console.log(`[SolarService] Body not found: ${searchId}`);
            return null;
        }

        const data = await response.json();
        return {
            name: data.englishName, // Use English name for display or mapping
            id: data.id,
            isPlanet: data.isPlanet,
            moons: data.moons ? data.moons.length : 0,
            semimajorAxis: data.semimajorAxis,
            perihelion: data.perihelion,
            aphelion: data.aphelion,
            eccentricity: data.eccentricity,
            inclination: data.inclination,
            mass: data.mass ? `${data.mass.massValue} x 10^${data.mass.massExponent} kg` : "N/A",
            vol: data.vol ? `${data.vol.volValue} x 10^${data.vol.volExponent} km^3` : "N/A",
            density: data.density,
            gravity: data.gravity,
            escape: data.escape,
            meanRadius: data.meanRadius,
            equaRadius: data.equaRadius,
            polarRadius: data.polarRadius,
            sidebar: data.sidebar,
            discoveryDate: data.discoveryDate,
            discoveredBy: data.discoveredBy,
            avgTemp: data.avgTemp,
            source: "Solar System OpenData API"
        };

    } catch (error) {
        console.error(`[SolarService] Error:`, error.message);
        return null;
    }
}
