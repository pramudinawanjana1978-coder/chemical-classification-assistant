import { useCallback, useEffect, useRef, useState } from "react";
import { SearchIcon, CloseIcon } from "../components/Icons.jsx";
import BrandIcon from "../components/BrandIcon.jsx";
import NoticeCard from "../components/NoticeCard.jsx";
import ChemicalFormModal from "./ChemicalFormModal.jsx";
import ConfirmDialog from "./ConfirmDialog.jsx";
import {
  adminLogout,
  fetchCategories,
  fetchChemicals,
  createChemical,
  updateChemical,
  deleteChemical,
} from "../services/adminApi.js";

const PAGE_SIZE = 20;
const MAX_ALIAS_CHIPS = 3;

export default function AdminDashboard({ onLogout }) {
  const [chemicals, setChemicals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const [modal, setModal] = useState(null); // { mode: "add" | "edit", chemical? }
  const [toDelete, setToDelete] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [toast, setToast] = useState(null);

  const requestId = useRef(0);

  // Returns true when the error was an expired/invalid session (user is sent to login).
  const handleAuthError = useCallback(
    (err) => {
      if (err && err.status === 401) {
        onLogout("Your session has expired. Please log in again.");
        return true;
      }
      return false;
    },
    [onLogout]
  );

  const load = useCallback(
    async (q) => {
      const id = ++requestId.current;
      setLoading(true);
      setLoadError(null);
      try {
        const rows = await fetchChemicals(q);
        if (id !== requestId.current) return; // a newer search superseded this one
        setChemicals(rows);
      } catch (err) {
        if (id !== requestId.current) return;
        if (!handleAuthError(err)) setLoadError(err.message);
      } finally {
        if (id === requestId.current) setLoading(false);
      }
    },
    [handleAuthError]
  );

  // Categories once.
  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch((err) => {
        if (!handleAuthError(err)) setLoadError(err.message);
      });
  }, [handleAuthError]);

  // Debounce the search box.
  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    load(query);
  }, [query, load]);

  // Auto-dismiss success toasts.
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const totalPages = Math.max(1, Math.ceil(chemicals.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = chemicals.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSave = async (payload) => {
    const editing = modal.mode === "edit";
    try {
      if (editing) await updateChemical(modal.chemical.id, payload);
      else await createChemical(payload);
    } catch (err) {
      if (handleAuthError(err)) return;
      throw err; // the modal shows it
    }
    setModal(null);
    setToast(editing ? "Changes saved." : "Chemical added.");
    load(query);
  };

  const confirmDelete = async () => {
    setDeleteBusy(true);
    setDeleteError(null);
    try {
      await deleteChemical(toDelete.id);
      setToDelete(null);
      setToast("Chemical deleted.");
      load(query);
    } catch (err) {
      if (!handleAuthError(err)) setDeleteError(err.message || "Could not delete the chemical.");
    } finally {
      setDeleteBusy(false);
    }
  };

  const logout = async () => {
    await adminLogout();
    onLogout();
  };

  return (
    <div className="dash">
      <header className="dash-header">
        <div className="dash-brand">
          <span className="dash-logo">
            <BrandIcon />
          </span>
          <div>
            <h1>Chemical Dataset Management</h1>
            <p>Admin · changes apply to the student search immediately</p>
          </div>
        </div>
        <button className="btn btn-light" onClick={logout}>
          Logout
        </button>
      </header>

      <main className="dash-main">
        {toast && (
          <div className="toast" role="status">
            {toast}
          </div>
        )}
        {loadError && (
          <NoticeCard type="error" title="Could not load the dataset" onClose={() => setLoadError(null)}>
            {loadError}
          </NoticeCard>
        )}

        <section className="panel">
          <div className="toolbar">
            <div className="admin-search">
              <span className="admin-search-icon">
                <SearchIcon size={18} />
              </span>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search chemicals..."
                aria-label="Search chemicals by name or alias"
              />
              {searchInput && (
                <button className="clear" onClick={() => setSearchInput("")} aria-label="Clear search">
                  <CloseIcon size={16} />
                </button>
              )}
            </div>
            <button
              className="btn btn-primary btn-add"
              onClick={() => setModal({ mode: "add" })}
              disabled={categories.length === 0}
              title={categories.length === 0 ? "Loading categories..." : undefined}
            >
              + Add Chemical
            </button>
          </div>

          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Chemical Name</th>
                  <th>Aliases</th>
                  <th>Primary Project Class</th>
                  <th>Project Waste Category</th>
                  <th className="col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((c) => (
                  <tr key={c.id}>
                    <td data-label="ID">{c.id}</td>
                    <td data-label="Chemical Name" className="cell-name">
                      {c.chemical_name}
                    </td>
                    <td data-label="Aliases">
                      {c.alias_list?.length ? (
                        <span className="chips">
                          {c.alias_list.slice(0, MAX_ALIAS_CHIPS).map((a) => (
                            <span className="chip" key={a}>
                              {a}
                            </span>
                          ))}
                          {c.alias_list.length > MAX_ALIAS_CHIPS && (
                            <span className="chip chip-more" title={c.alias_list.join("; ")}>
                              +{c.alias_list.length - MAX_ALIAS_CHIPS}
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className="muted">—</span>
                      )}
                    </td>
                    <td data-label="Primary Project Class">{c.primary_project_class || "—"}</td>
                    <td data-label="Project Waste Category">
                      {c.project_waste_category ? (
                        <span className="category-pill">{c.project_waste_category}</span>
                      ) : (
                        <span className="muted">Not assigned</span>
                      )}
                    </td>
                    <td data-label="Actions" className="col-actions">
                      <button
                        className="btn btn-small btn-outline"
                        onClick={() => setModal({ mode: "edit", chemical: c })}
                        disabled={categories.length === 0}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-small btn-danger-outline"
                        onClick={() => {
                          setDeleteError(null);
                          setToDelete(c);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {loading && <p className="table-state">Loading chemicals...</p>}
            {!loading && !loadError && chemicals.length === 0 && (
              <p className="table-state">
                {query ? "No chemicals match your search." : "The dataset has no chemicals yet."}
              </p>
            )}
          </div>

          <footer className="table-footer">
            <span>
              {chemicals.length} chemical{chemicals.length === 1 ? "" : "s"}
              {query ? " found" : ""}
            </span>
            {totalPages > 1 && (
              <span className="pager">
                <button className="btn btn-small btn-outline" onClick={() => setPage(currentPage - 1)} disabled={currentPage <= 1}>
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="btn btn-small btn-outline"
                  onClick={() => setPage(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  Next
                </button>
              </span>
            )}
          </footer>
        </section>
      </main>

      {modal && (
        <ChemicalFormModal
          mode={modal.mode}
          initial={modal.chemical}
          categories={categories}
          onSave={handleSave}
          onCancel={() => setModal(null)}
        />
      )}

      {toDelete && (
        <ConfirmDialog
          chemical={toDelete}
          busy={deleteBusy}
          error={deleteError}
          onCancel={() => setToDelete(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
