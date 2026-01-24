import React, { useEffect, useState } from "react";

function App() {
  const [hub, setHub] = useState(null);
  const [error, setError] = useState(null);

  // ✅ CORRECT HUB USERNAME
  const USERNAME = "demo";

  useEffect(() => {
    // ⭐ CHANGED: localhost → Render backend
    fetch(`https://smart-link-hub-code-wale.onrender.com/hub/${USERNAME}`)
      .then(res => {
        if (!res.ok) {
          throw new Error("Hub not found");
        }
        return res.json();
      })
      .then(data => setHub(data))
      .catch(err => setError(err.message));
  }, []);

  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <h2>{error}</h2>
      </div>
    );
  }

  if (!hub) {
    return (
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "420px",
        margin: "50px auto",
        padding: "20px",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        border: "1px solid #ddd",
        borderRadius: "8px"
      }}
    >
      <h1>{hub.title}</h1>
      <p>Total Visits: {hub.visits}</p>

      {hub.links.length === 0 && (
        <p>No links added yet.</p>
      )}

      {hub.links.map((link, index) => (
        <a
          key={index}
          // ⭐ CHANGED: localhost → Render backend
          href={`https://smart-link-hub-code-wale.onrender.com/hub/${USERNAME}/click/${index}`}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "block",
            margin: "12px 0",
            padding: "12px",
            backgroundColor: "#000",
            color: "#fff",
            textDecoration: "none",
            borderRadius: "6px"
          }}
        >
          {link.title}
        </a>
      ))}
    </div>
  );
}

export default App;
