import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero__overlay">
          <h1 className="hero__title">Solar System Exploration</h1>
          <p className="hero__subtitle">Join us as we explore our solar system.</p>
          <div className="hero__actions">
            <Link className="btn btn--primary" to="/planets">Explore the Planets</Link>
            <Link className="btn btn--ghost" to="/explore3d">Open 3D View</Link>
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


