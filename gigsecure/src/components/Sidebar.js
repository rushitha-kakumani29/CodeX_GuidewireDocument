import React from "react";

function Sidebar({ show, setPage }) {
  return (
    <div className={`sidebar ${show ? "active" : ""}`}>
      <button onClick={() => setPage("dashboard")}>Dashboard</button>
      <button onClick={() => setPage("profile")}>Profile</button>
      <button onClick={() => setPage("settings")}>Settings</button>
    </div>
  );
}

export default Sidebar;
