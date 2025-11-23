const featuredMissions = [
  {
    name: "Voyager",
    status: "Active",
    blurb: "Twin probes exploring interstellar space after touring the outer planets."
  },
  {
    name: "Perseverance Rover",
    status: "Active",
    blurb: "Collecting Mars rock samples and testing MOXIE for future human missions."
  },
  {
    name: "Artemis",
    status: "In Development",
    blurb: "NASA's program to return humans to the Moon and build a lunar gateway."
  }
];

export default function Missions() {
  return (
    <section className="page page--placeholder">
      <h1>NASA &amp; International Missions</h1>
      <p className="page__lead">
        Snapshot updates on the spacecraft pushing our exploration boundaries.
      </p>
      <div className="page__timeline">
        {featuredMissions.map((mission) => (
          <article key={mission.name} className="timeline-card">
            <header className="timeline-card__header">
              <span className="timeline-card__dot" aria-hidden="true" />
              <div>
                <h2>{mission.name}</h2>
                <p className="timeline-card__status">{mission.status}</p>
              </div>
            </header>
            <p>{mission.blurb}</p>
            <p className="muted">Detailed mission brief coming soon.</p>
          </article>
        ))}
      </div>
    </section>
  );
}





