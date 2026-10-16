import { useState } from "react";
import SearchPanel from "../components/SearchPanel.jsx";
import SearchResults from "../components/SearchResults.jsx";
import ChemicalDetails from "../components/ChemicalDetails.jsx";
import NoticeCard from "../components/NoticeCard.jsx";
import { searchChemical, ApiError } from "../services/api.js";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState([]);
  const [selected, setSelected] = useState(null);
  const [notice, setNotice] = useState(null); // { type, title, text }

  const runSearch = async (chemicalName) => {
    setLoading(true);
    setNotice(null);
    setSelected(null);
    setMatches([]);

    try {
      const data = await searchChemical(chemicalName);
      const found = Array.isArray(data.matches) ? data.matches : [];

      if (data.found === false || found.length === 0) {
        setNotice({
          type: "warning",
          title: "No matching chemical found.",
          text: "Try entering a more complete chemical name.",
        });
      } else {
        setMatches(found);
      }
    } catch (err) {
      if (err instanceof ApiError && err.kind === "network") {
        setNotice({ type: "error", title: "Backend offline", text: err.message });
      } else if (err instanceof ApiError && err.kind === "invalid") {
        setNotice({ type: "error", title: "Invalid response", text: err.message });
      } else {
        setNotice({
          type: "error",
          title: "Search failed",
          text: err?.message || "Something went wrong while searching.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page home-page">
      <SearchPanel onSearch={runSearch} loading={loading} />

      {loading && (
        <div className="glass card loading-card" role="status">
          <span className="spinner" />
          <span>Searching chemical database...</span>
        </div>
      )}

      {notice && (
        <NoticeCard type={notice.type} title={notice.title} onClose={() => setNotice(null)}>
          {notice.text}
        </NoticeCard>
      )}

      {matches.length > 0 && (
        <SearchResults
          matches={matches}
          selectedId={selected ? selected.id ?? null : null}
          onSelect={(match) => setSelected({ ...match })}
        />
      )}

      {selected && <ChemicalDetails chemical={selected} />}
    </div>
  );
}
