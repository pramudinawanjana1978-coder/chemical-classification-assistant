import { useEffect, useRef } from "react";
import { AtomIcon, FlaskIcon, InfoIcon } from "./Icons.jsx";

function Field({ label, value }) {
  return (
    <div className="detail-field">
      <span className="detail-label">{label}</span>
      <span className="detail-value">{value ?? "—"}</span>
    </div>
  );
}

export default function ChemicalDetails({ chemical }) {
  const sectionRef = useRef(null);

  // Whenever a different chemical is selected, bring the result into view.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // Wait one frame so the card has been laid out before measuring it.
    const frame = requestAnimationFrame(() => {
      // Centre the card. If it is taller than the screen (small phones),
      // align its top instead so the Project Waste Category stays visible.
      const tallerThanViewport = el.getBoundingClientRect().height > window.innerHeight * 0.92;
      el.scrollIntoView({
        behavior: "smooth",
        block: tallerThanViewport ? "start" : "center",
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [chemical]);

  const hasScore = chemical.match_score !== undefined && chemical.match_score !== null;
  const category = chemical.project_waste_category;

  return (
    <section ref={sectionRef} className="glass card details-card" aria-live="polite">
      <h2 className="section-title">Selected Chemical Details</h2>

      <div className="waste-hero">
        <span className="waste-hero-icon">
          <FlaskIcon size={30} />
        </span>
        <span className="waste-hero-label">Project Waste Category</span>
        <p className="waste-hero-category">{category ?? "Not provided"}</p>
        <p className="waste-hero-chemical">{chemical.chemical_name ?? "—"}</p>
        <span className="waste-hero-tag">Project Classification</span>
      </div>

      <div className="detail-fields">
        <Field label="Chemical Name" value={chemical.chemical_name} />
        <Field label="Chemical ID" value={chemical.id} />
        <Field label="Match Score" value={hasScore ? `${chemical.match_score}%` : "—"} />
      </div>

      <div className="info-cards">
        <div className="info-card">
          <span className="info-icon teal">
            <AtomIcon />
          </span>
          <div>
            <span className="detail-label">Primary Project Class</span>
            <p className="info-value">{chemical.primary_project_class ?? "—"}</p>
          </div>
        </div>
      </div>

      <div className="classification-notice">
        <span className="notice-icon">
          <InfoIcon />
        </span>
        <div>
          <strong>Project Classification Notice</strong>
          <p>
            This classification is based on the project's chemical dataset and is intended for demonstration and
            academic use. It should not be treated as official laboratory disposal guidance.
          </p>
        </div>
      </div>
    </section>
  );
}
