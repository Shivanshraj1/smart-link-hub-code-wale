import express from "express";
import Hub from "../models/Hub.js";

const router = express.Router();

/* GET HUB */
router.get("/:username", async (req, res) => {
  const hub = await Hub.findOne({ username: req.params.username });
  if (!hub) return res.status(404).json({ message: "Hub not found" });

  hub.visits++;
  await hub.save();
  res.json(hub);
});

/* CREATE HUB (AUTO) */
router.post("/:username", async (req, res) => {
  const hub = await Hub.create({
    username: req.params.username,
    title: `${req.params.username}'s Hub`,
    links: []
  });
  res.json(hub);
});

/* ADD LINK */
router.post("/:username/link", async (req, res) => {
  const hub = await Hub.findOne({ username: req.params.username });
  hub.links.push(req.body);
  await hub.save();
  res.json(hub);
});

/* UPDATE LINK */
router.put("/:username/link/:id", async (req, res) => {
  const hub = await Hub.findOne({ username: req.params.username });
  const link = hub.links.id(req.params.id);
  link.title = req.body.title;
  link.url = req.body.url;
  await hub.save();
  res.json(hub);
});

/* DELETE LINK */
router.delete("/:username/link/:id", async (req, res) => {
  const hub = await Hub.findOne({ username: req.params.username });
  hub.links.id(req.params.id).deleteOne();
  await hub.save();
  res.json(hub);
});

/* CLICK TRACK */
router.patch("/:username/link/:id/click", async (req, res) => {
  const hub = await Hub.findOne({ username: req.params.username });
  const link = hub.links.id(req.params.id);
  link.clicks++;
  await hub.save();
  res.json({ success: true });
});

export default router;
