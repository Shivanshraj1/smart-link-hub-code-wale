const express = require("express");
const router = express.Router();
const Hub = require("../models/Hub");

// CREATE HUB
router.post("/create", async (req, res) => {
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

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET PUBLIC HUB
router.get("/:username", async (req, res) => {
  try {
    const hub = await Hub.findOne({ username: req.params.username });
    if (!hub) {
      return res.status(404).json({ message: "Hub not found" });
    }

    hub.visits += 1;
    await hub.save();

    res.json(hub);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
