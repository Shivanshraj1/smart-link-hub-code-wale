import { useEffect, useState } from "react";

const API = "https://smart-link-hub-code-wale-1.onrender.com";

export default function App() {
  const username =
    window.location.pathname.length > 1
      ? window.location.pathname.slice(1)
      : "demo";

  const isOwner =
    new URLSearchParams(window.location.search).get("owner") === "true";

  const [hub, setHub] = useState(null);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetch(`${API}/hub/${username}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Hub not found");
        }
        return res.json();
      })
      .then((data) => {
        setHub(data);
        setError("");
      })
      .catch(() => {
        setError("Backend reachable, but hub not found");
      });
  }, [username]);

  const saveLink = async () => {
    const endpoint = editingId
      ? `${API}/hub/${username}/link/${editingId}`
      : `${API}/hub/${username}/link`;

    await fetch(endpoint, {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, url }),
    });

    window.location.reload();
  };

  const deleteLink = async (id) => {
    await fetch(`${API}/hub/${username}/link/${id}`, {
      method: "DELETE",
    });
    window.location.reload();
  };

  const clickLink = async (link) => {
    await fetch(`${API}/hub/${username}/link/${link._id}/click`, {
      method: "PATCH",
    });
    window.open(link.url, "_blank");
  };

  if (error) {
    return (
      <div style={{ color: "#fff", padding: 40 }}>
        <h2>Smart Link Hub</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!hub) {
    return (
      <div style={{ color: "#fff", padding: 40 }}>
        Loading hub...
      </div>
    );
  }

  return (
    <div style={{ background: "#000", minHeight: "100vh", color: "#fff", padding: 30 }}>
      <h1>{hub.title}</h1>

      {isOwner && (
        <div>
          <input
            placeholder="Link title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            placeholder="Link URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button onClick={saveLink}>
            {editingId ? "Update Link" : "Add Link"}
          </button>
        </div>
      )}

      <hr />

      {hub.links.map((link) => (
        <div key={link._id} style={{ marginBottom: 10 }}>
          <button onClick={() => clickLink(link)}>
            {link.title}
          </button>

          {isOwner && (
            <>
              <button
                onClick={() => {
                  setEditingId(link._id);
                  setTitle(link.title);
                  setUrl(link.url);
                }}
              >
                Edit
              </button>
              <button onClick={() => deleteLink(link._id)}>
                Delete
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
