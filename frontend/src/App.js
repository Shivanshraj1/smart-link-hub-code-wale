import React, { useEffect, useState } from "react";
import CreateHub from "./CreateHub";

function App() {
  const [hub, setHub] = useState(null);
  const [error, setError] = useState(null);

  // ✅ Track hash in state
  const [route, setRoute] = useState(
    window.location.hash.replace("#/", "") || "demo"
  );

  // ✅ Listen to hash changes
  useEffect(() => {
    const onHashChange = () => {
      setRoute(window.location.hash.replace("#/", "") || "demo");
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const isCreatePage = route === "create";
  const username = route;

  // ✅ Fetch hub when route changes
  useEffect(() => {
    if (isCreatePage) return;

    fetch(`https://smart-link-hub-code-wale.onrender.com/hub/${username}`)
      .then((res) => {
        if (!res.ok) throw new Error("Hub not found");
        return res.json();
      })
      .then((data) => {
        setHub(data);
        setError(null);
      })
      .catch((err) => {
        setHub(null);
        setError(err.message);
      });
  }, [username, isCreatePage]);

  // ✅ Render create page
  if (isCreatePage) {
    return <CreateHub />;
  }

  if (error) {
    return <h2 style={{ textAlign: "center" }}>{error}</h2>;
  }

  if (!hub) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  return (
    <div
      style={{
        maxWidth: 420,
        margin: "50px auto",
        padding: "20px",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        border: "1px solid #ddd",
        borderRadius: "8px",
      }}
    >
      <h1>{hub.title}</h1>
      <p>Total Visits: {hub.visits}</p>

      {hub.links.length === 0 && <p>No links added yet.</p>}

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
            backgroundColor: "#000",
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
