require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Hub = require("./models/Hub");

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());

/* ================= HEALTH CHECK ================= */
app.get("/api/health", (req, res) => {
  res.json({ status: "Backend running" });
});

/* ================= ROUTES ================= */

// Create Hub
app.post("/api/hub/create", async (req, res) => {
  try {
    const { username, title } = req.body;
    if (!username || !title) {
      return res.status(400).json({ message: "username and title required" });
    }

    const exists = await Hub.findOne({ username });
    if (exists) {
      return res.status(400).json({ message: "username already exists" });
    }

    const hub = new Hub({
      username,
      title,
      links: [],
      visits: 0
    });

    await hub.save();
    res.status(201).json(hub);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Hub
app.get("/api/hub/:username", async (req, res) => {
  try {
    const hub = await Hub.findOne({ username: req.params.username });
    if (!hub) return res.status(404).json({ message: "Hub not found" });

    hub.visits += 1;
    await hub.save();
    res.json(hub);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add Link
app.post("/api/hub/:username/link", async (req, res) => {
  try {
    const { title, url } = req.body;
    const hub = await Hub.findOne({ username: req.params.username });
    if (!hub) return res.status(404).json({ message: "Hub not found" });

    hub.links.push({ title, url, clicks: 0 });
    await hub.save();
    res.json(hub);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Link
app.put("/api/hub/:username/link/:id", async (req, res) => {
  try {
    const { title, url } = req.body;
    const hub = await Hub.findOne({ username: req.params.username });
    if (!hub) return res.status(404).json({ message: "Hub not found" });

    const link = hub.links.id(req.params.id);
    if (!link) return res.status(404).json({ message: "Link not found" });

    link.title = title;
    link.url = url;
    await hub.save();
    res.json(hub);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Link
app.delete("/api/hub/:username/link/:id", async (req, res) => {
  try {
    const hub = await Hub.findOne({ username: req.params.username });
    if (!hub) return res.status(404).json({ message: "Hub not found" });

    hub.links.id(req.params.id).deleteOne();
    await hub.save();
    res.json(hub);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Click Tracking
app.patch("/api/hub/:username/link/:id/click", async (req, res) => {
  try {
    const hub = await Hub.findOne({ username: req.params.username });
    if (!hub) return res.status(404).json({ message: "Hub not found" });

    const link = hub.links.id(req.params.id);
    if (!link) return res.status(404).json({ message: "Link not found" });

    link.clicks += 1;
    await hub.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= DB + SERVER ================= */
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.error("MongoDB connection failed:", err));
