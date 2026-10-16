const TECH = [
  "React",
  "Vite",
  "JavaScript",
  "Flask",
  "Python",
  "SQLite",
  "Speech Recognition",
  "Fuzzy Matching",
];

export default function About() {
  return (
    <div className="page">
      <section className="glass card">
        <h1 className="section-title">About</h1>
        <p className="body-text">
          Chemical Classification Assistant is an academic software project that demonstrates chemical-name
          recognition, fuzzy matching, voice-assisted search and dataset-based chemical classification.
        </p>

        <h2 className="subheading">Technologies</h2>
        <ul className="tech-list">
          {TECH.map((t) => (
            <li key={t} className="tech-chip">
              {t}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
