const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Hub = require("./models/Hub");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// mongodb
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB error:", err));

// root check
app.get("/", (req, res) => {
  res.send("Backend running");
});

// ✅ CREATE HUB (DIRECT – GUARANTEED)
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

// ✅ GET HUB
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
