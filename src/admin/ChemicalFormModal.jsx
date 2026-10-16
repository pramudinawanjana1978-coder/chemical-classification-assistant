import { useEffect, useRef, useState } from "react";

// mode: "add" | "edit". onSave(payload) must throw on failure (AdminApiError with optional .fields).
export default function ChemicalFormModal({ mode, initial, categories, onSave, onCancel }) {
  const [form, setForm] = useState({
    chemical_name: initial?.chemical_name ?? "",
    aliases: initial?.aliases ?? "",
    primary_project_class: initial?.primary_project_class ?? "",
    project_waste_category: initial?.project_waste_category ?? "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);
  const firstRef = useRef(null);

  useEffect(() => {
    firstRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && !saving && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [saving, onCancel]);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setFieldErrors((fe) => ({ ...fe, [key]: undefined }));
  };

  const validate = () => {
    const errs = {};
    if (!form.chemical_name.trim()) errs.chemical_name = "Chemical name is required.";
    if (!form.primary_project_class.trim()) errs.primary_project_class = "Primary project class is required.";
    if (!form.project_waste_category) errs.project_waste_category = "Please choose a project waste category.";
    return errs;
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setFieldErrors(errs);
    setFormError(null);
    if (Object.keys(errs).length) return;

    setSaving(true);
    try {
      await onSave({
        chemical_name: form.chemical_name.trim(),
        aliases: form.aliases.trim(),
        primary_project_class: form.primary_project_class.trim(),
        project_waste_category: form.project_waste_category,
      });
    } catch (err) {
      if (err.fields) setFieldErrors(err.fields);
      setFormError(err.message || "Could not save the chemical.");
      setSaving(false);
    }
  };

  const title = mode === "edit" ? "Edit Chemical" : "Add Chemical";

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && !saving && onCancel()}>
      <form className="modal" onSubmit={submit} noValidate role="dialog" aria-modal="true" aria-labelledby="form-title">
        <h2 id="form-title">{title}</h2>

        {formError && <p className="form-error" role="alert">{formError}</p>}

        <label className={`field ${fieldErrors.chemical_name ? "has-error" : ""}`}>
          <span>Chemical Name *</span>
          <input ref={firstRef} type="text" value={form.chemical_name} onChange={set("chemical_name")} maxLength={200} />
          {fieldErrors.chemical_name && <em>{fieldErrors.chemical_name}</em>}
        </label>

        <label className={`field ${fieldErrors.aliases ? "has-error" : ""}`}>
          <span>Aliases</span>
          <input
            type="text"
            value={form.aliases}
            onChange={set("aliases")}
            placeholder="copper sulphate;cupric sulfate"
          />
          <small>Separate aliases with semicolons.</small>
          {fieldErrors.aliases && <em>{fieldErrors.aliases}</em>}
        </label>

        <label className={`field ${fieldErrors.primary_project_class ? "has-error" : ""}`}>
          <span>Primary Project Class *</span>
          <input
            type="text"
            value={form.primary_project_class}
            onChange={set("primary_project_class")}
            maxLength={200}
          />
          {fieldErrors.primary_project_class && <em>{fieldErrors.primary_project_class}</em>}
        </label>

        <label className={`field ${fieldErrors.project_waste_category ? "has-error" : ""}`}>
          <span>Project Waste Category *</span>
          <select value={form.project_waste_category} onChange={set("project_waste_category")}>
            <option value="">Select a category...</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {fieldErrors.project_waste_category && <em>{fieldErrors.project_waste_category}</em>}
        </label>

        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={saving}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : mode === "edit" ? "Save Changes" : "Add Chemical"}
          </button>
        </div>
      </form>
    </div>
  );
}
