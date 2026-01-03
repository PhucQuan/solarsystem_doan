import { useEffect, useState } from "react";

const API_BASE = "http://localhost:3001";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadGallery() {
      try {
        // Fetch APOD images từ dedicated endpoint
        const response = await fetch(`${API_BASE}/api/apod/gallery`);
        if (!response.ok) throw new Error("Failed to fetch APOD gallery");

        const apodImages = await response.json();

        // Filter chỉ lấy images (không phải videos)
        const imageOnly = apodImages.filter(img => img.media_type === "image");

        if (isMounted) {
          setImages(imageOnly);
          console.log(`[Gallery] Loaded ${imageOnly.length} NASA APOD images`);
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || "Failed to load gallery");
          console.error("[Gallery] error:", err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadGallery();
    return () => { isMounted = false; };
  }, []);

  return (
    <section className="page">
      <div className="section__header">
        <h1>NASA APOD Gallery</h1>
        <p className="page__lead">
          Astronomy Picture of the Day - Recent stunning space imagery from NASA
        </p>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading NASA APOD images...</p>
        </div>
      )}

      {error && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#ff6b6b' }}>
          <p>Error: {error}</p>
          <p style={{ fontSize: '14px', marginTop: '8px' }}>
            Make sure backend server is running (npm run server)
          </p>
        </div>
      )}

      {!loading && !error && images.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>No images found</p>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '24px',
        padding: '24px 0'
      }}>
        {images.map((img, idx) => (
          <article key={idx} className="card" style={{ overflow: 'hidden' }}>
            <img
              src={img.url}
              alt={img.title}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '8px 8px 0 0'
              }}
              onError={(e) => {
                console.error(`[Gallery] Failed to load image: ${img.title}`, img.url);
                e.target.style.display = 'none';
              }}
            />
            <div style={{ padding: '16px' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>{img.title}</h3>
              <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
                {img.date}
              </p>
              <p style={{
                fontSize: '14px',
                lineHeight: '1.5',
                maxHeight: '4.5em',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {img.explanation}
              </p>
              <a
                href={img.hdurl || img.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-block',
                  marginTop: '12px',
                  color: '#4a9eff',
                  textDecoration: 'none',
                  fontSize: '14px'
                }}
              >
                View Full Size →
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
