import React, { useState } from "react";

const BASE_URL = "http://127.0.0.1:8000";

function Register({ setUser, setPage }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    bank: "",
    password: ""
  });

  const handleSignup = async () => {
    try {
      const res = await fetch(`${BASE_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (data.msg === "User Registered") {
        alert("✅ Registered Successfully");
        setUser(form);
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
      <h2>Register</h2>

      <input placeholder="Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })} />

      <input placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })} />

      <input placeholder="Phone"
        onChange={(e) => setForm({ ...form, phone: e.target.value })} />

      <input placeholder="Bank"
        onChange={(e) => setForm({ ...form, bank: e.target.value })} />

      <input type="password" placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })} />

      <button onClick={handleSignup}>Register</button>
    </div>
  );
}

export default Register;
