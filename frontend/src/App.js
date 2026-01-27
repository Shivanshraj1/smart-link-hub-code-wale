import { useEffect, useState } from "react";

const API = "https://smart-link-hub-code-wale-1.onrender.com";

export default function App() {
  const username = window.location.pathname.replace("/", "") || "demo";
  const isOwner = new URLSearchParams(window.location.search).get("owner") === "true";

  const [hub, setHub] = useState(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    fetch(`${API}/hub/${username}`)
      .then(res => res.json())
      .then(data => setHub(data))
      .catch(() => setHub(null));
  }, [username]);

  const addLink = async () => {
    await fetch(`${API}/hub/${username}/link`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, url })
    });
    window.location.reload();
  };

  if (!hub) return <h2 style={{ color: "#fff" }}>Hub not found</h2>;

  return (
    <div style={{ background: "#000", minHeight: "100vh", color: "#0f0", padding: 30 }}>
      <h1>{hub.title}</h1>

      {isOwner && (
        <>
          <input placeholder="Link title" onChange={e => setTitle(e.target.value)} />
          <input placeholder="URL" onChange={e => setUrl(e.target.value)} />
          <button onClick={addLink}>Add Link</button>
        </>
      )}

      <hr />

      {hub.links.map((link, i) => (
        <div key={i}>
          <a href={link.url} target="_blank" rel="noreferrer">
            {link.title}
          </a>
        </div>
      ))}
    </div>
  );
}
