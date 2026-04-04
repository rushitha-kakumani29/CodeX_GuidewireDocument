import React, { useState } from "react";

const BASE_URL = "http://127.0.0.1:8000";

function Login({ setUser, setPage }) {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleLogin = async () => {
    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (data.msg === "Login Success") {
        alert("✅ Login Success");
        setUser(data.user);
        setPage("dashboard");
      } else {
        alert(data.msg);
      }

    } catch (err) {
      alert("❌ Backend not connected");
    }
  };

  return (
    <div className="form">
      <h2>Login</h2>

      <input placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })} />

      <input type="password" placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })} />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
