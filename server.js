const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ---------- MIDDLEWARE ----------
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// ---------- MONGODB ----------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection failed:", err));

// ---------- SCHEMA ----------
const hubSchema = new mongoose.Schema({
  username: String,
  title: String,
  links: [
    {
      title: String,
      url: String,
      clicks: { type: Number, default: 0 }
    }
  ],
  visits: { type: Number, default: 0 }
}, { timestamps: true });

const Hub = mongoose.model("Hub", hubSchema);

// ---------- ROUTES ----------

// GET HUB
app.get("/api/hub/:username", async (req, res) => {
  const hub = await Hub.findOne({ username: req.params.username });
  if (!hub) return res.status(404).json({ message: "Hub not found" });

  hub.visits++;
  await hub.save();
  res.json(hub);
});

// CREATE HUB IF NOT EXISTS
app.post("/api/hub/:username", async (req, res) => {
  const { title } = req.body;

  let hub = await Hub.findOne({ username: req.params.username });
  if (!hub) {
    hub = await Hub.create({
      username: req.params.username,
      title: title || `${req.params.username}'s Hub`,
      links: []
    });
  }
  res.json(hub);
});

// ADD LINK
app.post("/api/hub/:username/link", async (req, res) => {
  const hub = await Hub.findOne({ username: req.params.username });
  hub.links.push({ title: req.body.title, url: req.body.url });
  await hub.save();
  res.json(hub);
});

// UPDATE LINK
app.put("/api/hub/:username/link/:id", async (req, res) => {
  const hub = await Hub.findOne({ username: req.params.username });
  const link = hub.links.id(req.params.id);
  link.title = req.body.title;
  link.url = req.body.url;
  await hub.save();
  res.json(hub);
});

// DELETE LINK
app.delete("/api/hub/:username/link/:id", async (req, res) => {
  const hub = await Hub.findOne({ username: req.params.username });
  hub.links.id(req.params.id).deleteOne();
  await hub.save();
  res.json(hub);
});

// CLICK TRACK
app.patch("/api/hub/:username/link/:id/click", async (req, res) => {
  const hub = await Hub.findOne({ username: req.params.username });
  hub.links.id(req.params.id).clicks++;
  await hub.save();
  res.json({ success: true });
});

// ---------- ROOT ----------
app.get("/", (req, res) => {
  res.send("Smart Link Hub Backend Running");
});

// ---------- PORT ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port", PORT));
