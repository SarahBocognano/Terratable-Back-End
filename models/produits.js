const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProduitsSchema = new Schema({
  // Nom du produit
  name: {
    type: String,
    require: true,
  },
  // Code produit (unique)
  sku: String,
  // Image en mode base64encode
  image: String,
  // Description
  description: String,
  // Description courte
  resume: String,
  // id pointant vers un Type de produit
  productType: String,
  // Visibilité sur le site YES / NO
  enable: String,
  // Mis en avant ON / OFF
  promote: String,
  // id pointant vers un producer
  producer: String,
  // Prix de vente TTC
  price: Number,
  // Unité de vente (Kg, Ltr, Piece)
  unit: String,
  // champs auto généré indiquant la date de création de l'objet
  created: {
    type: Number,
    require: true,
    default: Date.now,
  },
});
module.exports = mongoose.model("produits", ProduitsSchema);
