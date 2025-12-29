

// Using native fetch (Node 18+)

// Target Vietnamese Wikipedia
const WIKI_API_URL = "https://vi.wikipedia.org/w/api.php";

export async function fetchWikiSummary(topic) {
    try {
        console.log(`[WikiService] Searching for topic: ${topic}`);

        // 1. Search for the page title first to get the most relevant result
        const searchParams = new URLSearchParams({
            action: "query",
            list: "search",
            srsearch: topic,
            format: "json",
            utf8: "1",
            srlimit: "1"
        });

        const searchRes = await fetch(`${WIKI_API_URL}?${searchParams.toString()}`);
        const searchData = await searchRes.json();

        if (!searchData.query || !searchData.query.search || searchData.query.search.length === 0) {
            console.log(`[WikiService] No Wikipedia results for: ${topic}`);
            return null;
        }

        const bestMatchTitle = searchData.query.search[0].title;
        console.log(`[WikiService] Best match title: ${bestMatchTitle}`);

        // 2. Fetch the summary (intro) and thumbnail for that title
        const summaryParams = new URLSearchParams({
            action: "query",
            prop: "extracts|pageimages", // Request extracts AND pageimages
            exintro: "1",
            explaintext: "1",
            pithumbsize: "500", // Thumbnail size
            titles: bestMatchTitle,
            format: "json",
            utf8: "1",
            redirects: "1"
        });

        const summaryRes = await fetch(`${WIKI_API_URL}?${summaryParams.toString()}`);
        const summaryData = await summaryRes.json();

        const pages = summaryData.query.pages;
        const pageId = Object.keys(pages)[0];

        if (pageId === "-1") {
            return null;
        }

        const page = pages[pageId];

        return {
            title: page.title,
            summary: page.extract,
            image: page.thumbnail ? page.thumbnail.source : null, // Get thumbnail URL if exists
            url: `https://vi.wikipedia.org/wiki/${encodeURIComponent(page.title)}`,
            source: "Wikipedia (Tiếng Việt)"
        };

    } catch (error) {
        console.error(`[WikiService] Error:`, error.message);
        return null;
    }
}
