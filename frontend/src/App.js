import { useEffect, useState } from "react";

const API = "https://smart-link-hub-code-wale-1.onrender.com";

export default function App() {
  const username = window.location.pathname.replace("/", "") || "demo";
  const isOwner = new URLSearchParams(window.location.search).get("owner") === "true";

  const [hub, setHub] = useState(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API}/hub/${username}`)
      .then(res => {
        if (!res.ok) throw new Error("Backend not reachable");
        return res.json();
      })
      .then(setHub)
      .catch(() => setError("Backend not reachable"));
  }, [username]);

  const saveLink = async () => {
    const endpoint = editingId
      ? `${API}/hub/${username}/link/${editingId}`
      : `${API}/hub/${username}/link`;

    await fetch(endpoint, {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, url })
    });

    window.location.reload();
  };

  const deleteLink = async id => {
    await fetch(`${API}/hub/${username}/link/${id}`, { method: "DELETE" });
    window.location.reload();
  };

  const clickLink = link => {
    window.open(link.url, "_blank");
  };

  if (error) {
    return <h2 style={{ color: "red", textAlign: "center" }}>{error}</h2>;
  }

  if (!hub) {
  return <div style={{ color: "#fff" }}>Loading...</div>;
}

if (hub.error) {
  return <div style={{ color: "#fff" }}>Backend not reachable</div>;
}


  return (
    <div style={{ background: "#000", minHeight: "100vh", color: "#fff", padding: 30 }}>
      <h1>{hub.title}</h1>

      {isOwner && (
        <div>
          <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <input placeholder="URL" value={url} onChange={e => setUrl(e.target.value)} />
          <button onClick={saveLink}>{editingId ? "Update" : "Add"}</button>
        </div>
      )}

      <hr />

      {hub.links.map(link => (
        <div key={link._id}>
          <button onClick={() => clickLink(link)}>{link.title}</button>

          {isOwner && (
            <>
              <button onClick={() => {
                setEditingId(link._id);
                setTitle(link.title);
                setUrl(link.url);
              }}>Edit</button>

              <button onClick={() => deleteLink(link._id)}>Delete</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
