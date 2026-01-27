const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

// 🔥 health check (Render needs this)
app.get("/", (req, res) => {
  res.send("Smart Link Hub backend running");
});

// 🔥 test API
app.get("/api/test", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 5000;

// ❗ DO NOT require routes before Mongo connects
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB error:", err);
  });
