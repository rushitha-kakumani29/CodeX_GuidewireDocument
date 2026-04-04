import React, { useState } from "react";

function Navbar({ setPage, user, setUser }) {
  const [open, setOpen] = useState(false);

  const handleNavigate = (page) => {
    setPage(page);
    setOpen(false); // ✅ CLOSE AFTER CLICK
  };

  return (
    <>
      {/* 🔷 NAVBAR */}
      <nav className="navbar">
        <span className="menu-icon" onClick={() => setOpen(!open)}>
          ☰
        </span>

        <h2>GigSecure</h2>

        {user ? (
          <button
            onClick={() => {
              localStorage.removeItem("token");
              setUser(null);
              setPage("login");
              setOpen(false); // ✅ CLOSE
            }}
          >
            Logout
          </button>
        ) : (
          <div>
            <button onClick={() => setPage("login")}>Login</button>
            <button onClick={() => setPage("signup")}>Register</button>
          </div>
        )}
      </nav>

      {/* 🔷 OVERLAY (CLICK OUTSIDE TO CLOSE) */}
      {open && (
        <div
          className="overlay"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* 🔷 SIDEBAR */}
      <div className={`sidebar ${open ? "active" : ""}`}>
        <button onClick={() => handleNavigate("dashboard")}>Dashboard</button>
        <button onClick={() => handleNavigate("profile")}>Profile</button>
        <button onClick={() => handleNavigate("settings")}>Settings</button>
      </div>
    </>
  );
}

export default Navbar;
