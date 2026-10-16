// Visual tier only; the numeric score itself is displayed exactly as returned.
function matchTier(score) {
  const n = Number(score);
  if (Number.isNaN(n)) return "low";
  if (n >= 90) return "high";
  if (n >= 70) return "medium";
  return "low";
}

export default function ChemicalCard({ rank, match, selected, onSelect }) {
  const tier = matchTier(match.match_score);
  const hasScore = match.match_score !== undefined && match.match_score !== null;

  return (
    <article className={`result-card ${selected ? "selected" : ""}`}>
      <div className="result-head">
        <span className="rank">{rank}</span>
        <h3 className="result-name">{match.chemical_name ?? "Unnamed chemical"}</h3>
        {hasScore && <span className={`match-badge ${tier}`}>{String(match.match_score)}% Match</span>}
      </div>

      <dl className="result-fields">
        <div>
          <dt>Primary Project Class</dt>
          <dd>{match.primary_project_class ?? "—"}</dd>
        </div>
        <div>
          <dt>Project Waste Category</dt>
          <dd>{match.project_waste_category ?? "—"}</dd>
        </div>
      </dl>

      <button className={selected ? "secondary-btn is-selected" : "secondary-btn"} onClick={() => onSelect(match)}>
        {selected ? "Selected" : "Select"}
      </button>
    </article>
  );
}
