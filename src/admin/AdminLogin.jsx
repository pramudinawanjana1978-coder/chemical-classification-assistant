import { useState } from "react";
import BrandIcon from "../components/BrandIcon.jsx";
import NoticeCard from "../components/NoticeCard.jsx";
import { adminLogin, AdminApiError } from "../services/adminApi.js";

export default function AdminLogin({ onLoggedIn, notice }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("Enter your admin username and password.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await adminLogin(username.trim(), password);
      onLoggedIn();
    } catch (err) {
      if (err instanceof AdminApiError && err.status === 0) {
        setError("Backend offline. " + err.message);
      } else {
        setError(err.message || "Login failed.");
      }
      setPassword("");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="login-wrap">
      <form className="login-card" onSubmit={submit} noValidate>
        <span className="login-logo">
          <BrandIcon />
        </span>
        <h1>Admin Login</h1>
        <p className="login-sub">Chemical Dataset Management</p>

        {notice && (
          <NoticeCard type="warning" title="Signed out">
            {notice}
          </NoticeCard>
        )}
        {error && (
          <NoticeCard type="error" title={error} onClose={() => setError(null)} />
        )}

        <label className="field">
          <span>Username</span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            autoFocus
          />
        </label>
        <label className="field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>

        <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
          {busy ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}
