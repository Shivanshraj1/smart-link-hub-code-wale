const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Hub = require("../models/Hub");

const router = express.Router();
const SECRET = "smartlinksecret";

/* LOGIN / REGISTER */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  let hub = await Hub.findOne({ username });

  if (!hub) {
    const hash = await bcrypt.hash(password, 10);
    hub = await Hub.create({
      username,
      password: hash,
      title: `${username}'s Hub`,
      links: []
    });
  }

  const valid = await bcrypt.compare(password, hub.password);
  if (!valid) return res.status(401).json({ error: "Invalid password" });

  const token = jwt.sign({ username }, SECRET);
  res.json({ token });
});

/* GET HUB */
router.get("/:username", async (req, res) => {
  const hub = await Hub.findOne({ username: req.params.username });
  res.json(hub);
});

/* SAVE HUB */
router.post("/:username", async (req, res) => {
  const { token, title, links } = req.body;
  const decoded = jwt.verify(token, SECRET);

  if (decoded.username !== req.params.username)
    return res.status(403).json({ error: "Forbidden" });

  const hub = await Hub.findOneAndUpdate(
    { username: decoded.username },
    { title, links },
    { new: true }
  );

  res.json(hub);
});

module.exports = router;
