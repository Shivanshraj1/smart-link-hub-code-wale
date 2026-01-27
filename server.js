const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ health route (Render checks this)
app.get("/", (req, res) => {
  res.status(200).send("Backend is alive");
});

// ✅ prevent crash on bad routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;

// 🔒 HARDENED Mongo + Server startup
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    // ⛔ DO NOT exit process — keep app alive
    setTimeout(() => {}, 1000 * 60 * 60);
  }
})();
