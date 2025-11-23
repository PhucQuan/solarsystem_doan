import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchApod } from "../services/nasa/apod";

export default function Home() {
  const [apod, setApod] = useState(null);
  const [apodError, setApodError] = useState("");
  const [apodLoading, setApodLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const data = await fetchApod({ hd: true });
        if (isMounted) {
          setApod(data);
          // Log detailed info for debugging
          // eslint-disable-next-line no-console
          console.log("[APOD] Full data:", data);
          // eslint-disable-next-line no-console
          console.log("[APOD] Image URL:", data?.url);
          // eslint-disable-next-line no-console
          console.log("[APOD] HD URL:", data?.hdurl);
        }
      } catch (err) {
        if (isMounted) setApodError(err?.message || "Failed to load APOD");
        // eslint-disable-next-line no-console
        console.error("[APOD] error:", err);
      } finally {
        if (isMounted) setApodLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  const isVideo = apod?.media_type === "video";

  return (
    <div className="home">
      <section className="hero" style={apod && !isVideo ? { backgroundImage: `url(${apod.hdurl || apod.url})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}>
        <div className="hero__overlay">
          <h1 className="hero__title">{apod?.title || "Solar System Exploration"}</h1>
          <p className="hero__subtitle">{apod?.date ? `NASA Astronomy Picture of the Day — ${apod.date}` : "Join us as we explore our solar system."}</p>
          {apodLoading && <p className="muted">Loading NASA APOD…</p>}
          {apodError && (
            <p className="muted">
              {apodError} — Check console (F12 → Console) and ensure .env is loaded.
            </p>
          )}
          {apod && isVideo && (
            <div style={{ margin: "16px auto", maxWidth: 800 }}>
              <iframe
                src={apod.url}
                title={apod.title}
                style={{ width: "100%", aspectRatio: "16 / 9", border: 0, borderRadius: 12 }}
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
          <div className="hero__actions">
            <Link className="btn btn--primary" to="/planets">Explore the Planets</Link>
            <a className="btn btn--ghost" href={apod?.hdurl || apod?.url || "#"} target="_blank" rel="noreferrer">Open APOD</a>
          </div>
        </div>
      </section>

      <section className="highlights">
        <div className="section__header">
          <h2>10 Things about our solar system</h2>
          <p className="muted">Quick facts inspired by NASA’s Solar System Exploration.</p>
        </div>
        <div className="cards">
          <article className="card">
            <h3>1. Many Worlds</h3>
            <p>Eight planets and five dwarf planets.</p>
          </article>
          <article className="card">
            <h3>2. Small Worlds, Too</h3>
            <p>About 1.4M asteroids and ~4,000 comets.</p>
          </article>
          <article className="card">
            <h3>3. Lots of Moons</h3>
            <p>Hundreds of moons across the solar system.</p>
          </article>
          <article className="card">
            <h3>4. Milky Way Home</h3>
            <p>We live in the Orion Spur of the Milky Way.</p>
          </article>
        </div>
      </section>

      <section className="planets">
        <div className="section__header">
          <h2>Planets</h2>
          <p className="muted">Inner planets, outer giants, and distant dwarfs.</p>
        </div>
        <div className="planet-grid">
          {[
            { name: "Mercury" },
            { name: "Venus" },
            { name: "Earth" },
            { name: "Mars" },
            { name: "Jupiter" },
            { name: "Saturn" },
            { name: "Uranus" },
            { name: "Neptune" },
          ].map((p) => (
            <Link key={p.name} to={`/planets`} className="planet-card">
              <div className="planet-card__thumb" aria-hidden="true" />
              <div className="planet-card__name">{p.name}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="missions">
        <div className="section__header">
          <h2>Featured Missions</h2>
          <p className="muted">NEO Surveyor · Europa Clipper · Psyche · VERITAS</p>
        </div>
        <div className="cards">
          {[
            { title: "NEO Surveyor", desc: "Hunts near‑Earth objects (asteroids/comets)." },
            { title: "Europa Clipper", desc: "Investigates Jupiter’s icy moon Europa." },
            { title: "Psyche", desc: "Visits a metal‑rich asteroid named Psyche." },
            { title: "VERITAS", desc: "Future radar mapper of Venus’ surface." },
          ].map((m) => (
            <article key={m.title} className="card">
              <h3>{m.title}</h3>
              <p>{m.desc}</p>
              <Link className="card__link" to="/planets">Learn more →</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="cta">
        <div className="cta__box">
          <h3>Ready to fly through space?</h3>
          <p className="muted">Try the interactive 3D exploration now.</p>
          <Link className="btn btn--primary" to="/explore3d">Launch 3D</Link>
        </div>
      </section>
    </div>
  );
}


