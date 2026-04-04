import React, { useState } from "react";

const BASE_URL = "http://127.0.0.1:8000";

function Dashboard({ user }) {
  const [balance, setBalance] = useState(user?.balance || 1000);
  const [status, setStatus] = useState("No Risk");

  const checkDisaster = async () => {
    const res = await fetch(`${BASE_URL}/detect`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: user.email,
        temp: 46,
        aqi: 400,
        rain: 10
      })
    });

    const data = await res.json();
    setStatus(data.disaster);
    setBalance(data.updated_balance);
  };

  return (
    <div className="dashboard">
      <h2>Welcome {user?.name}</h2>
      <p>Balance: ₹{balance}</p>
      <p>Status: {status}</p>

      <button onClick={checkDisaster}>Check Disaster</button>
    </div>
  );
}

export default Dashboard;
