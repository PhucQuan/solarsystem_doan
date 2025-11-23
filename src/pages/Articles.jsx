const learningTopics = [
  {
    title: "Origins of the Solar System",
    description: "From the protoplanetary disk to the planets we know today."
  },
  {
    title: "How Telescopes Work",
    description: "Breaking down the optics behind the James Webb and Hubble era."
  },
  {
    title: "What is a Habitable Zone?",
    description: "A quick guide to Goldilocks zones around stars of different sizes."
  }
];

export default function Articles() {
  return (
    <section className="page page--placeholder">
      <h1>Learn &amp; Articles</h1>
      <p className="page__lead">
        Long-form explainers, mission deep-dives, and short reads that make space easier
        to understand.
      </p>
      <div className="page__grid">
        {learningTopics.map((topic) => (
          <article key={topic.title} className="card">
            <h2>{topic.title}</h2>
            <p>{topic.description}</p>
            <p className="muted">Full article coming soon.</p>
          </article>
        ))}
      </div>
    </section>
  );
}





