import React, { useState } from "react";

function CreateHub() {
  const [username, setUsername] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const createHub = async () => {
    if (!username || !title) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        "https://smart-link-hub-code-wale.onrender.com/hub/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, title }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to create hub");
        setLoading(false);
        return;
      }

      // 🔐 STORE OWNER KEY
      localStorage.setItem(username, data.ownerKey);

      // 🔁 REDIRECT TO PROFILE PAGE
      window.location.hash = `#/${username}`;
    } catch (err) {
      setError("Server error");
    }

    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={{ color: "#0f0" }}>Create Your Smart Link Hub</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <input
          style={styles.input}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase())}
        />

        <input
          style={styles.input}
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button style={styles.button} onClick={createHub} disabled={loading}>
          {loading ? "Creating..." : "Create Hub"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    background: "#111",
    padding: 30,
    borderRadius: 10,
    width: 350,
    textAlign: "center",
    boxShadow: "0 0 20px rgba(0,255,0,0.3)",
  },
  input: {
    width: "100%",
    padding: 10,
    margin: "10px 0",
    borderRadius: 5,
    border: "1px solid #0f0",
    background: "#000",
    color: "#fff",
  },
  button: {
    width: "100%",
    padding: 10,
    marginTop: 15,
    background: "#0f0",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default CreateHub;
