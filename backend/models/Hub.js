const mongoose = require("mongoose");

// Schema for individual links
const LinkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  clicks: {
    type: Number,
    default: 0
  },

  // Rule-based fields
  showFrom: String, // example: "09"
  showTo: String    // example: "18"
});

// Main Hub schema
const HubSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  links: [LinkSchema],

  visits: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Hub", HubSchema);
