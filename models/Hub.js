const mongoose = require("mongoose");

const HubSchema = new mongoose.Schema({
  username: String,
  password: String,
  title: String,
  links: [
    {
      title: String,
      url: String,
      clicks: { type: Number, default: 0 }
    }
  ]
});

module.exports = mongoose.model("Hub", HubSchema);
