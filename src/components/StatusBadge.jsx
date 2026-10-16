export default function StatusBadge({ state }) {
  // state: "checking" | "online" | "offline"
  const label =
    state === "online"
      ? "System Online"
      : state === "offline"
      ? "Backend Offline"
      : "Checking...";

  return (
    <span className={`status-badge status-${state}`} role="status" aria-live="polite">
      <span className="status-dot" />
      {label}
    </span>
  );
}
