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
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API}/hub/${username}`)
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          setError(data.message);
        } else {
          setHub(data);
        }
      })
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
    await fetch(`${API}/hub/${username}/link/${id}`, {
      method: "DELETE"
    });
    window.location.reload();
  };

  const clickLink = link => {
    window.open(link.url, "_blank");
  };

  if (error) {
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: 100 }}>
        {error}
      </div>
    );
  }

  if (!hub) {
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: 100 }}>
        Loading hub...
      </div>
    );
  }

  return (
    <div style={{
      background: "#000",
      minHeight: "100vh",
      color: "#fff",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingTop: 40
    }}>
      <h1 style={{
        background: "#fff",
        color: "#000",
        padding: "12px 30px",
        borderRadius: 999
      }}>
        {hub.title}
      </h1>

      {isOwner && (
        <div style={{
          background: "#111",
          padding: 20,
          borderRadius: 16,
          marginTop: 20
        }}>
          <input
            placeholder="Link title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{ padding: 10, borderRadius: 999, marginBottom: 10 }}
          />
          <br />
          <input
            placeholder="https://example.com"
            value={url}
            onChange={e => setUrl(e.target.value)}
            style={{ padding: 10, borderRadius: 999 }}
          />
          <br />
          <button
            onClick={saveLink}
            style={{
              marginTop: 10,
              background: "#22c55e",
              padding: "10px 20px",
              borderRadius: 999,
              border: "none",
              cursor: "pointer"
            }}>
            {editingId ? "Update Link" : "Add Link"}
          </button>
        </div>
      )}

      <div style={{ marginTop: 30 }}>
        {hub.links.map(link => (
          <div key={link._id} style={{ marginBottom: 12 }}>
            <button
              onClick={() => clickLink(link)}
              style={{
                background: "#22c55e",
                padding: "12px 30px",
                borderRadius: 999,
                border: "none",
                cursor: "pointer"
              }}>
              {link.title}
            </button>

            {isOwner && (
              <>
                <button onClick={() => {
                  setEditingId(link._id);
                  setTitle(link.title);
                  setUrl(link.url);
                }}> ✏️ </button>

                <button onClick={() => deleteLink(link._id)}> 🗑️ </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
