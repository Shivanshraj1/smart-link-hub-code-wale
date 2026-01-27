import { useEffect, useState } from "react";

const API = "https://smart-link-hub-code-wale-1.onrender.com/api";

export default function App() {
  const username =
    window.location.pathname.replace("/", "") || "demo";

  const isOwner =
    new URLSearchParams(window.location.search).get("owner") === "true";

  const [hub, setHub] = useState(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
  const loadHub = async () => {
    try {
      const res = await fetch(`${API}/hub/${username}`);

      if (!res.ok) {
        throw new Error("Backend not ready");
      }

      const data = await res.json();
      setHub(data);

    } catch (err) {
      console.log("Backend waking up...");
      setTimeout(loadHub, 5000); // retry after 5s
    }
  };

  loadHub();
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

  const clickLink = async link => {
    await fetch(
      `${API}/hub/${username}/link/${link._id}/click`,
      { method: "PATCH" }
    );
    window.open(link.url, "_blank");
  };

  if (!hub) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#000",
      color: "#22c55e",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 18
    }}>
      Waking up server… ⏳
    </div>
  );
}


  return (
    <div style={{ background: "#000", minHeight: "100vh", color: "#fff", padding: 30 }}>
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
          <button onClick={saveLink}>
            {editingId ? "Update Link" : "Add Link"}
          </button>
        </div>
      )}

      <hr />

      {hub.links.map(link => (
        <div key={link._id}>
          <button onClick={() => clickLink(link)}>
            {link.title} ({link.clicks})
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
