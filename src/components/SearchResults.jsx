import ChemicalCard from "./ChemicalCard.jsx";

export default function SearchResults({ matches, selectedId, onSelect }) {
  return (
    <section className="glass card results-card">
      <h2 className="section-title">Search Results</h2>
      <p className="section-sub">Top matching chemicals based on your input</p>

      <div className="results-grid">
        {matches.map((match, index) => (
          <ChemicalCard
            key={match.id ?? `${match.chemical_name}-${index}`}
            rank={index + 1}
            match={match}
            selected={selectedId !== null && match.id === selectedId}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  );
}
