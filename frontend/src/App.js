import React, { useEffect, useState } from "react";

function App() {
  const [hub, setHub] = useState(null);
  const [error, setError] = useState(null);

  const username = window.location.pathname.replace("/", "") || "demo";

  useEffect(() => {
    fetch(`https://smart-link-hub-code-wale.onrender.com/hub/${username}`)
      .then((res) => {
        if (!res.ok) throw new Error("Hub not found");
        return res.json();
      })
      .then((data) => setHub(data))
      .catch((err) => setError(err.message));
  }, [username]);

  if (error) return <h2 style={{ textAlign: "center" }}>{error}</h2>;
  if (!hub) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  return (
    <div style={{ maxWidth: 420, margin: "50px auto", textAlign: "center" }}>
      <h1>{hub.title}</h1>
      <p>Total Visits: {hub.visits}</p>

      {hub.links.map((link, index) => (
        <a
          key={index}
          href={`https://smart-link-hub-code-wale.onrender.com/hub/${username}/click/${index}`}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "block",
            margin: "12px 0",
            padding: "12px",
            background: "#000",
            color: "#fff",
            textDecoration: "none",
            borderRadius: "6px",
          }}
        >
          {link.title}
        </a>
      ))}
    </div>
  );
}

export default App;
