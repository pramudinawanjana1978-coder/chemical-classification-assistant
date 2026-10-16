import { useEffect, useState } from "react";
import NoticeCard from "../components/NoticeCard.jsx";
import { getStatus, API_BASE_URL } from "../services/api.js";
import { DatabaseIcon, ServerIcon, HashIcon } from "../components/Icons.jsx";

// The status payload shape isn't fixed, so we only read well-known keys if they
// exist and otherwise show nothing for them (no invented values).
function pick(obj, keys) {
  for (const k of keys) {
    if (obj && obj[k] !== undefined && obj[k] !== null) return obj[k];
  }
  return undefined;
}

function display(value) {
  if (value === undefined) return null;
  if (typeof value === "boolean") return value ? "Connected" : "Unavailable";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export default function Database() {
  const [state, setState] = useState({ loading: true, data: null, error: null });

  useEffect(() => {
    let active = true;
    getStatus()
      .then((data) => active && setState({ loading: false, data, error: null }))
      .catch((err) => active && setState({ loading: false, data: null, error: err.message }));
    return () => {
      active = false;
    };
  }, []);

  const { loading, data, error } = state;
  const isObject = data && typeof data === "object" && !Array.isArray(data);

  const dbStatus = isObject
    ? display(pick(data, ["database_status", "database", "db_status", "db", "database_connected"]))
    : null;
  const total = isObject
    ? display(pick(data, ["total_chemicals", "chemical_count", "total", "count", "chemicals"]))
    : null;
  const backend = error ? "Offline" : loading ? "Checking..." : "Online";

  const extra = isObject
    ? Object.entries(data).filter(([, v]) => v === null || typeof v !== "object")
    : [];

  return (
    <div className="page">
      <section className="glass card">
        <h1 className="section-title">Database</h1>
        <p className="section-sub">Information reported by the backend status endpoint</p>

        {error && (
          <NoticeCard type="error" title="Backend offline">
            {error}
          </NoticeCard>
        )}

        <div className="stat-grid">
          <div className="stat-card">
            <span className="info-icon teal"><DatabaseIcon /></span>
            <div>
              <span className="detail-label">Database Status</span>
              <p className="info-value">{loading ? "Checking..." : dbStatus ?? "Not provided by API"}</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="info-icon navy"><HashIcon /></span>
            <div>
              <span className="detail-label">Total Chemicals</span>
              <p className="info-value">{loading ? "Checking..." : total ?? "Not provided by API"}</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="info-icon teal"><ServerIcon /></span>
            <div>
              <span className="detail-label">Backend Status</span>
              <p className="info-value">{backend}</p>
            </div>
          </div>
        </div>

        {extra.length > 0 && (
          <>
            <h2 className="subheading">Status response</h2>
            <dl className="kv-list">
              {extra.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{String(v)}</dd>
                </div>
              ))}
            </dl>
          </>
        )}

        <p className="muted small">Backend URL: {API_BASE_URL}</p>
      </section>
    </div>
  );
}
