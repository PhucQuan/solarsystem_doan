import { useEffect, useState } from "react";
import { fetchApod } from "../services/nasa/apod";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    
    async function loadGallery() {
      try {
        // Fetch APOD for the last 12 days
        const promises = [];
        const today = new Date();
        
        for (let i = 0; i < 12; i++) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          promises.push(fetchApod({ date: dateStr, hd: false }));
        }
        
        const results = await Promise.allSettled(promises);
        const successfulImages = results
          .filter(r => r.status === 'fulfilled' && r.value?.media_type === 'image')
          .map(r => r.value);
        
        if (isMounted) {
          setImages(successfulImages);
          // eslint-disable-next-line no-console
          console.log(`[Gallery] Loaded ${successfulImages.length} images`);
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || "Failed to load gallery");
          // eslint-disable-next-line no-console
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
        <h1>Space Gallery</h1>
        <p className="page__lead">
          NASA Astronomy Pictures of the Day - A collection of stunning space imagery
        </p>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading gallery...</p>
        </div>
      )}

      {error && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#ff6b6b' }}>
          <p>Error: {error}</p>
          <p style={{ fontSize: '14px', marginTop: '8px' }}>
            Check console (F12) for details. Make sure your NASA API key is valid.
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
                // eslint-disable-next-line no-console
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





