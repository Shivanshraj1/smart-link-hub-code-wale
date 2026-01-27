const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Hub = require("./models/Hub");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= ROUTES =================

// Health check
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// Create Hub
app.post("/hub/create", async (req, res) => {
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
app.get("/hub/:username", async (req, res) => {
  try {
    const hub = await Hub.findOne({ username: req.params.username });
    if (!hub) {
      return res.status(404).json({ message: "Hub not found" });
    }

    hub.visits += 1;
    await hub.save();

    res.json(hub);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add Link
app.post("/hub/:username/link", async (req, res) => {
  try {
    const { title, url } = req.body;
    const hub = await Hub.findOne({ username: req.params.username });

    if (!hub) {
      return res.status(404).json({ message: "Hub not found" });
    }

    hub.links.push({ title, url, clicks: 0 });
    await hub.save();

    res.json(hub);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Click Tracking
app.get("/hub/:username/click/:index", async (req, res) => {
  try {
    const hub = await Hub.findOne({ username: req.params.username });
    if (!hub) return res.send("Hub not found");

    const link = hub.links[req.params.index];
    if (!link) return res.send("Link not found");

    link.clicks += 1;
    await hub.save();

    res.redirect(link.url);

  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ================= DATABASE + SERVER =================
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000
})
.then(() => {
  console.log("MongoDB connected");

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

})
.catch(err => {
  console.error("MongoDB connection failed:", err);
});
