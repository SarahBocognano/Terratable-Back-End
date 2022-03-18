const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commandesSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  panier: {
    totalQuantity: {
      type: Number,
      default: 0,
      required: true,
    },
    totalCost: {
      type: Number,
      default: 0,
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Produits",
        },
        quantity: {
          type: Number,
          default: 0,
        },
        title: {
          type: String,
        },
      },
    ],
  },
  paymentId: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isUntreated: {
    type: Boolean,
    default: false,
  },
  inProgress: {
    type: Boolean,
    default: false,
  },
  inProgressAt: {
    type: Date,
  },
  isDelivered: {
    type: Boolean,
    default: false,
  },
  deliveredAt: {
    type: Date,
  },
});

module.exports = Commandes = mongoose.model("Commande", commandesSchema);
