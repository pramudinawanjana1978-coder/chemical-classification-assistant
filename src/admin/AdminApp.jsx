import { useEffect, useState } from "react";
import AdminLogin from "./AdminLogin.jsx";
import AdminDashboard from "./AdminDashboard.jsx";
import { getToken, clearToken } from "../services/adminApi.js";
import "./admin.css";

export default function AdminApp() {
  const [loggedIn, setLoggedIn] = useState(() => Boolean(getToken()));
  const [loginMessage, setLoginMessage] = useState(null);

  useEffect(() => {
    document.title = "Admin · Chemical Dataset Management";
  }, []);

  const handleLogout = (message = null) => {
    clearToken();
    setLoginMessage(message);
    setLoggedIn(false);
  };

  return (
    <div className="admin-shell">
      {loggedIn ? (
        <AdminDashboard onLogout={handleLogout} />
      ) : (
        <AdminLogin
          notice={loginMessage}
          onLoggedIn={() => {
            setLoginMessage(null);
            setLoggedIn(true);
          }}
        />
      )}
    </div>
  );
}
