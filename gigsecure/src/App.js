import React, { useEffect, useState } from "react";
import "./App.css";
import jsPDF from "jspdf";

const BASE_URL = "http://127.0.0.1:8000";

function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);

  return (
    <div className="app-container">
      <Navbar setPage={setPage} user={user} setUser={setUser} />

      <main className="main-content">
        {page === "home" && <Home />}
        {page === "signup" && <Signup setPage={setPage} />}
        {page === "login" && <Login setUser={setUser} setPage={setPage} />}
        {page === "dashboard" && <Dashboard user={user} />}
        {page === "profile" && <Profile user={user} />}
        {page === "settings" && <Settings user={user} setUser={setUser} />}
        {page === "history" && <History user={user} />}
      </main>

      <Footer />
    </div>
  );
}

function Navbar({ setPage, user, setUser }) {
  const [open, setOpen] = useState(false);

  const goPage = (p) => {
    setPage(p);
    setOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        {!user && (
          <>
            <h2 className="navbar-title" onClick={() => goPage("home")}>
              GigSecure
            </h2>

            <div className="navbar-right">
              <button onClick={() => goPage("login")}>Login</button>
              <button onClick={() => goPage("signup")}>Register</button>
            </div>
          </>
        )}

        {user && (
          <>
            <span className="menu-icon" onClick={() => setOpen(!open)}>
              ☰
            </span>

            <h2 className="navbar-title">GigSecure</h2>

            <button
              onClick={() => {
                setUser(null);
                setPage("home");
                setOpen(false);
              }}
            >
              Logout
            </button>
          </>
        )}
      </nav>

      {user && open && (
        <div className="overlay" onClick={() => setOpen(false)}></div>
      )}

      {user && (
        <div className={`sidebar ${open ? "active" : ""}`}>
          <button onClick={() => goPage("dashboard")}>Dashboard</button>
          <button onClick={() => goPage("profile")}>Profile</button>
          <button onClick={() => goPage("settings")}>Bank Details</button>
          <button onClick={() => goPage("history")}>History</button>
        </div>
      )}
    </>
  );
}

function Home() {
  return (
    <div className="home">
      <section className="hero-section">
        <div className="hero-text">
          <h1>GigSecure</h1>
          <p className="hero-subtitle">
            Insurance support for gig workers when disasters interrupt income.
          </p>
          <p className="desc">
            GigSecure is built for delivery partners, drivers, and other gig
            workers whose earnings are affected by real-world conditions such as
            heatwaves, heavy rain, floods, and severe pollution.
          </p>
          <p className="desc">
            The platform keeps worker protection simple by combining identity,
            bank details, history, and insurance-linked activity in one place.
          </p>
        </div>

        <div className="hero-image-card">
          <img
            src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=1200&q=80"
            alt="Gig worker support"
          />
        </div>
      </section>

      <section className="info-grid">
        <div className="info-card">
          <img
            src="https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=1000&q=80"
            alt="Delivery worker"
          />
          <h3>Worker Focused</h3>
          <p>
            Designed for people whose daily work and pay depend on road and
            weather conditions.
          </p>
        </div>

        <div className="info-card">
          <img
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1000&q=80"
            alt="Financial process"
          />
          <h3>Simple Financial Tracking</h3>
          <p>
            View balances, bank details, and policy-related transaction records
            clearly.
          </p>
        </div>

        <div className="info-card">
          <img
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80"
            alt="Digital monitoring"
          />
          <h3>Digital Monitoring</h3>
          <p>
            Supports a system where environmental risks can trigger automated
            insurance actions.
          </p>
        </div>
      </section>
    </div>
  );
}

function Signup({ setPage }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    bank: "",
    account_type: "Savings",
    account_number: "",
    ifsc_code: "",
    upi_id: "",
    password: "",
    otp: "",
    plan: "weekly",
  });

  const sendOtp = async () => {
    try {
      const res = await fetch(`${BASE_URL}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });

      const data = await res.json();
      alert(data.msg || data.detail || "OTP process failed");
      if (res.ok) setStep(2);
    } catch {
      alert("Error sending OTP ❌");
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await fetch(`${BASE_URL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      alert(data.msg || data.detail || "Verification failed");

      if ((data.msg || "").includes("Registered")) {
        setPage("login");
      }
    } catch {
      alert("Verification failed ❌");
    }
  };

  return (
    <div className="form">
      <h2>Register</h2>

      <input
        placeholder="Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        placeholder="Phone"
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />
      <input
        placeholder="Bank Name"
        onChange={(e) => setForm({ ...form, bank: e.target.value })}
      />

      <select
        value={form.account_type}
        onChange={(e) => setForm({ ...form, account_type: e.target.value })}
      >
        <option value="Savings">Savings</option>
        <option value="Current">Current</option>
      </select>

      <input
        placeholder="Account Number"
        onChange={(e) => setForm({ ...form, account_number: e.target.value })}
      />
      <input
        placeholder="IFSC Code"
        onChange={(e) => setForm({ ...form, ifsc_code: e.target.value })}
      />
      <input
        placeholder="UPI ID"
        onChange={(e) => setForm({ ...form, upi_id: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <select
        value={form.plan}
        onChange={(e) => setForm({ ...form, plan: e.target.value })}
      >
        <option value="weekly">Weekly</option>
        <option value="biweekly">Biweekly</option>
        <option value="monthly">Monthly</option>
      </select>

      {step === 1 && <button onClick={sendOtp}>Send OTP</button>}

      {step === 2 && (
        <>
          <input
            placeholder="Enter OTP"
            onChange={(e) => setForm({ ...form, otp: e.target.value })}
          />
          <button onClick={verifyOtp}>Verify & Register</button>
        </>
      )}
    </div>
  );
}

function Login({ setUser, setPage }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.msg === "Login Success") {
        setUser(data.user);
        setPage("dashboard");
      } else {
        alert(data.msg || "Invalid credentials ❌");
      }
    } catch {
      alert("Backend error ❌");
    }
  };

  return (
    <div className="form">
      <h2>Login</h2>

      <input
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

function Dashboard({ user }) {
  if (!user) return <h2>Please login</h2>;

  return (
    <div className="dashboard">
      <h2>Welcome, {user.name}</h2>

      <div className="card"><h3>Email</h3><p>{user.email}</p></div>
      <div className="card"><h3>Balance</h3><p>₹{user.balance}</p></div>
      <div className="card"><h3>Status</h3><p>Active ✅</p></div>
      <div className="card"><h3>Plan</h3><p>{user.plan || "Registered plan"}</p></div>
      <div className="card"><h3>Bank</h3><p>{user.bank || "Not added"}</p></div>
      <div className="card"><h3>Account Type</h3><p>{user.account_type || "Not added"}</p></div>
    </div>
  );
}

function Profile({ user }) {
  const [file, setFile] = useState(null);
  const [imageVersion, setImageVersion] = useState(Date.now());
  const [previewError, setPreviewError] = useState(false);

  if (!user) return <h2>Please login</h2>;

  const handleUpload = async () => {
    if (!file) {
      alert("Please choose an image first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${BASE_URL}/upload/${user.email}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      alert(data.msg || "Image uploaded");
      setPreviewError(false);
      setImageVersion(Date.now());
    } catch {
      alert("Image upload failed ❌");
    }
  };

  return (
    <div className="dashboard">
      <h2>Profile</h2>

      <div className="card profile-card">
        {!previewError ? (
          <img
            src={`${BASE_URL}/image/${user.email}?t=${imageVersion}`}
            alt="Profile"
            className="profile-pic"
            onError={() => setPreviewError(true)}
          />
        ) : (
          <img
            src="https://via.placeholder.com/140?text=Profile"
            alt="Profile placeholder"
            className="profile-pic"
          />
        )}

        <p><b>Name:</b> {user.name}</p>
        <p><b>Email:</b> {user.email}</p>
        <p><b>Balance:</b> ₹{user.balance}</p>
        <p><b>Plan:</b> {user.plan || "N/A"}</p>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button onClick={handleUpload}>Upload Profile Picture</button>
      </div>
    </div>
  );
}

function Settings({ user, setUser }) {
  const [form, setForm] = useState({
    bank: user?.bank || "",
    account_type: user?.account_type || "Savings",
    account_number: user?.account_number || "",
    ifsc_code: user?.ifsc_code || "",
    upi_id: user?.upi_id || "",
    phone: user?.phone || "",
  });

  const updateDetails = async () => {
    try {
      const res = await fetch(`${BASE_URL}/bank-details/${user.email}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      alert(data.msg || "Bank details updated");

      setUser({ ...user, ...form });
    } catch {
      alert("Failed to update bank details");
    }
  };

  return (
    <div className="dashboard">
      <h2>Bank Details</h2>

      <div className="form">
        <input
          placeholder="Bank Name"
          value={form.bank}
          onChange={(e) => setForm({ ...form, bank: e.target.value })}
        />

        <select
          value={form.account_type}
          onChange={(e) => setForm({ ...form, account_type: e.target.value })}
        >
          <option value="Savings">Savings</option>
          <option value="Current">Current</option>
        </select>
        <h3>Account Number</h3>
        <input
          placeholder="Account Number"
          value={form.account_number}
          onChange={(e) => setForm({ ...form, account_number: e.target.value })}
        />
        <h3>IFSC Code</h3>
        <input
          placeholder="IFSC Code"
          value={form.ifsc_code}
          onChange={(e) => setForm({ ...form, ifsc_code: e.target.value })}
        />
        <h3>UPI ID</h3>
        <input
          placeholder="UPI ID"
          value={form.upi_id}
          onChange={(e) => setForm({ ...form, upi_id: e.target.value })}
        />
        <h3>Phone Number</h3>
        <input
          placeholder="Phone Number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <button onClick={updateDetails}>Save Bank Details</button>
      </div>
    </div>
  );
}

function History({ user }) {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;

      try {
        const res = await fetch(`${BASE_URL}/transactions/${user.email}`);
        const data = await res.json();
        setTransactions(Array.isArray(data) ? data : []);
      } catch {
        setTransactions([]);
      }
    };

    fetchHistory();
  }, [user]);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("GigSecure Transaction History", 20, 20);

    let y = 35;

    if (transactions.length === 0) {
      doc.text("No transaction history available.", 20, y);
    } else {
      transactions.forEach((tx, index) => {
        doc.text(
          `${index + 1}. ${tx.type} | ₹${tx.amount} | ${tx.reason}`,
          20,
          y
        );
        y += 10;
      });
    }

    doc.save("gigsecure-history.pdf");
  };

  return (
    <div className="dashboard">
      <h2>Transaction History</h2>

      {transactions.length === 0 ? (
        <div className="card">
          <p>No transaction history available.</p>
        </div>
      ) : (
        transactions.map((tx) => (
          <div className="card" key={tx.id}>
            <p><b>Type:</b> {tx.type}</p>
            <p><b>Amount:</b> ₹{tx.amount}</p>
            <p><b>Reason:</b> {tx.reason}</p>
          </div>
        ))
      )}

      <button className="download-btn" onClick={downloadPDF}>
        Download PDF
      </button>
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <p>© 2026 GigSecure | AI Insurance Platform</p>
      <p>Contact: gigsecureai-insurance@gmail.com</p>
    </footer>
  );
}

export default App;