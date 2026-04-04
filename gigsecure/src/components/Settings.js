import React, { useState } from "react";

function Settings({ user }) {
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState("");

  const handleSave = () => {
    alert("Settings saved (UI only)");
  };

  return (
    <div className="form">
      <h2>Settings</h2>

      <input
        placeholder="Update Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Update Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <button onClick={handleSave}>Save Changes</button>
    </div>
  );
}

export default Settings;
