import React, { useState } from "react";

const BASE_URL = "http://127.0.0.1:8000";

function Profile({ user }) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(
    `${BASE_URL}/image/${user?.email}`
  );

  if (!user) return <h2>Login First</h2>;

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", image);

    try {
      await fetch(`${BASE_URL}/upload/${user.email}`, {
        method: "POST",
        body: formData,
      });

      alert("Image uploaded!");

      // Refresh image
      setPreview(`${BASE_URL}/image/${user.email}?t=${new Date().getTime()}`);

    } catch {
      alert("Upload failed");
    }
  };

  return (
    <div className="dashboard">
      <h2>Profile</h2>

      {/* IMAGE */}
      <img
        src={preview}
        alt="profile"
        width="120"
        height="120"
        style={{ borderRadius: "50%", marginBottom: "10px" }}
      />

      <br />

      <input type="file" onChange={(e) => setImage(e.target.files[0])} />

      <br />
      <button onClick={handleUpload}>Upload</button>

      <hr />

      <p><b>Name:</b> {user.name}</p>
      <p><b>Email:</b> {user.email}</p>
      <p><b>Balance:</b> ₹{user.balance}</p>
    </div>
  );
}

export default Profile;
