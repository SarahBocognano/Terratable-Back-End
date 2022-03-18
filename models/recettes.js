const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecettesSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  shares: {
    type: Number,
    required: true,
    default: 1,
  },
  image: {
    type: String,
  },
  ingredients: [
    { name: String, quantity: Number, unit: String, available: Boolean },
  ],
});

module.exports = Recettes = mongoose.model("recettes", RecettesSchema);
