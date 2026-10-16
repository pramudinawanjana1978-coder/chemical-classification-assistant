import { useEffect } from "react";

export default function ConfirmDialog({ chemical, busy, error, onCancel, onConfirm }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && !busy && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [busy, onCancel]);

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && !busy && onCancel()}>
      <div className="modal modal-small" role="alertdialog" aria-modal="true" aria-labelledby="del-title">
        <h2 id="del-title">Delete {chemical.chemical_name}?</h2>
        <p className="modal-text">This will remove the chemical from the project dataset.</p>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
          <button type="button" className="btn btn-danger" onClick={onConfirm} disabled={busy}>
            {busy ? "Deleting..." : "Delete Chemical"}
          </button>
        </div>
      </div>
    </div>
  );
}
