const mongoose = require("mongoose");

const ProducteurSchema = new mongoose.Schema({
    // nom du producteur
    name: {
        type: String,
        required: true,
    },
    // Image en mode base64encode
    image: String,
    // Description
    description: String,
    // Description courte
    resume: String,
    // Code Postal, ville
    address: String,
    // champs auto généré indiquant la date de création de l'objet
    created: {
        type: Number,
        required: true,
        default: Date.now,
    },
});

module.exports = Producteur = mongoose.model("producteurs", ProducteurSchema);
