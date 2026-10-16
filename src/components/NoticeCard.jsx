import { AlertIcon, InfoIcon, CloseIcon } from "./Icons.jsx";

// type: "error" | "info" | "warning"
export default function NoticeCard({ type = "info", title, children, onClose }) {
  return (
    <div className={`notice notice-${type}`} role={type === "error" ? "alert" : "status"}>
      <span className="notice-icon">
        {type === "info" ? <InfoIcon /> : <AlertIcon />}
      </span>
      <div className="notice-body">
        {title && <strong>{title}</strong>}
        {children && <p>{children}</p>}
      </div>
      {onClose && (
        <button className="notice-close" onClick={onClose} aria-label="Dismiss">
          <CloseIcon size={16} />
        </button>
      )}
    </div>
  );
}
