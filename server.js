require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Hub = require("./models/Hub");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

/* ---------- DB ---------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

/* ---------- ROUTES ---------- */

// Get hub
app.get("/api/hub/:username", async (req, res) => {
  const hub = await Hub.findOne({ username: req.params.username });
  if (!hub) return res.status(404).json({ message: "Hub not found" });

  hub.visits++;
  await hub.save();
  res.json(hub);
});

// Create hub
app.post("/api/hub", async (req, res) => {
  const hub = await Hub.create(req.body);
  res.json(hub);
});

// Add link
app.post("/api/hub/:username/link", async (req, res) => {
  const hub = await Hub.findOne({ username: req.params.username });
  hub.links.push(req.body);
  await hub.save();
  res.json(hub);
});

// Edit link
app.put("/api/hub/:username/link/:id", async (req, res) => {
  const hub = await Hub.findOne({ username: req.params.username });
  const link = hub.links.id(req.params.id);
  link.title = req.body.title;
  link.url = req.body.url;
  await hub.save();
  res.json(hub);
});

// Delete link
app.delete("/api/hub/:username/link/:id", async (req, res) => {
  const hub = await Hub.findOne({ username: req.params.username });
  hub.links.id(req.params.id).deleteOne();
  await hub.save();
  res.json(hub);
});

// Click tracking
app.patch("/api/hub/:username/link/:id/click", async (req, res) => {
  const hub = await Hub.findOne({ username: req.params.username });
  const link = hub.links.id(req.params.id);
  link.clicks++;
  await hub.save();
  res.json({ success: true });
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
