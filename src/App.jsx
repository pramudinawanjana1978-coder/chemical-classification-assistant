
import { useCallback, useEffect, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import AdminApp from "./admin/AdminApp.jsx";
import { getStatus } from "./services/api.js";

const PAGES = {
  home: Home,
};

function pageFromHash() {
  const id = window.location.hash.replace("#", "");
  return PAGES[id] ? id : "home";
}

function StudentApp() {
  const [page, setPage] = useState(pageFromHash);
  const [backendState, setBackendState] = useState("checking");

  const navigate = useCallback((id) => {
    const nextPage = PAGES[id] ? id : "home";

    window.location.hash = nextPage;
    setPage(nextPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    const onHash = () => {
      setPage(pageFromHash());
    };

    window.addEventListener("hashchange", onHash);

    return () => {
      window.removeEventListener("hashchange", onHash);
    };
  }, []);

  useEffect(() => {
    let active = true;

    const check = () => {
      getStatus()
        .then(() => {
          if (active) {
            setBackendState("online");
          }
        })
        .catch(() => {
          if (active) {
            setBackendState("offline");
          }
        });
    };

    check();

    const timer = setInterval(check, 15000);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  const Page = PAGES[page] || Home;

  return (
    <div className="app-shell">
      <div className="bg-layer" aria-hidden="true" />

      <Navbar
        page={page}
        onNavigate={navigate}
        backendState={backendState}
      />

      <main className="container">
        <Page />
      </main>

      <footer className="footer">
        Chemical Classification Assistant 
      </footer>
    </div>
  );
}

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, "");

  const isAdmin =
    path === "/admin" || path.startsWith("/admin/");

  return isAdmin ? <AdminApp /> : <StudentApp />;
}
