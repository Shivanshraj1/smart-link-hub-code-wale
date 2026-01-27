const mongoose = require("mongoose");

const LinkSchema = new mongoose.Schema({
  title: String,
  url: String,
  clicks: { type: Number, default: 0 }
});

const HubSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true },
    title: String,
    links: [LinkSchema],
    visits: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hub", HubSchema);
