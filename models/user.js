const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  lastname: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  adresseLivraison: {
    type: String,
    required: true,
  },
  adresseFacturation: {
    type: String,
    required: true,
  },
  sameBillAdress: {
    type: Boolean,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

module.exports = User = mongoose.model("user", userSchema);
