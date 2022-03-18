const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  mail: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: true,
  },
  updated: { type: Date, default: Date.now },
});

module.exports = Admin = mongoose.model("commandes", adminSchema);
