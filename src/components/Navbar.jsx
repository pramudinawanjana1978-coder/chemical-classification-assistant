
import BrandIcon from "./BrandIcon.jsx";
import StatusBadge from "./StatusBadge.jsx";

const LINKS = [
  { id: "home", label: "Home" },
];

export default function Navbar({ page, onNavigate, backendState }) {
  return (
    <header className="navbar glass">
      <button
        className="brand"
        onClick={() => onNavigate("home")}
        aria-label="Go to home"
      >
        <span className="brand-logo">
          <BrandIcon />
        </span>

        <span className="brand-text">
          <span className="brand-title">
            Chemical Classification Assistant
          </span>
          <span className="brand-subtitle">
            Voice-Assisted Chemical Classification Project
          </span>
        </span>
      </button>

      <nav className="nav-right">
        <ul className="nav-links">
          {LINKS.map((link) => (
            <li key={link.id}>
              <button
                className={`nav-link ${
                  page === link.id ? "active" : ""
                }`}
                onClick={() => onNavigate(link.id)}
                aria-current={
                  page === link.id ? "page" : undefined
                }
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        <a
          href="/admin"
          className="admin-login-btn"
          aria-label="Open Admin Login"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect
              x="3"
              y="11"
              width="18"
              height="11"
              rx="2"
            />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>

          <span>Admin Login</span>
        </a>

        <StatusBadge state={backendState} />
      </nav>
    </header>
  );
}
