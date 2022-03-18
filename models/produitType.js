const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProduitTypeSchema = new Schema({
  // Nom du produit
  name: {
    type: String,
    require: true,
  },
  // Image en mode base64encode
  image: String,
  // Description
  description: String,
  // Description courte
  resume: String,
  // Catégorie (fruits, légumes, autre)
  categorie: String,
  // Visibilité sur le site YES / NO
  enable: String,
  // Mis en avant ON / OFF
  promote: String,
  // champs auto généré indiquant la date de création de l'objet
  created: {
    type: Number,
    require: true,
    default: Date.now,
  },
});

module.exports = ProduitType = mongoose.model(
  "produitsType",
  ProduitTypeSchema
);
