import { useEffect, useState } from "react";

const API = "https://smart-link-hub-code-wale-1.onrender.com";

export default function App() {
  const username =
    window.location.pathname.replace("/", "") || "demo";

  const isOwner =
    new URLSearchParams(window.location.search).get("owner") === "true";

  const [hub, setHub] = useState(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    fetch(`${API}/hub/${username}`)
      .then(res => {
        if (!res.ok) throw new Error("Hub not found");
        return res.json();
      })
      .then(data => setHub(data))
      .catch(err => {
        console.error(err);
        setHub(null);
      });
  }, [username]);

  const addLink = async () => {
    await fetch(`${API}/hub/${username}/link`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, url })
    });
    window.location.reload();
  };

  if (!hub) {
    return (
      <div style={{ background: "#000", color: "#0f0", minHeight: "100vh", padding: 40 }}>
        Hub not found
      </div>
    );
  }

  return (
    <div style={{ background: "#000", minHeight: "100vh", color: "#0f0", padding: 40 }}>
      <h1>{hub.title}</h1>

      {isOwner && (
        <div>
          <input
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <input
            placeholder="URL"
            value={url}
            onChange={e => setUrl(e.target.value)}
          />
          <button onClick={addLink}>Add Link</button>
        </div>
      )}

      <hr />

      {hub.links.map(link => (
        <div key={link._id}>
          <a href={link.url} target="_blank" rel="noreferrer">
            {link.title}
          </a>
        </div>
      ))}
    </div>
  );
}
