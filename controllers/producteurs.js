let Producteur = require("../models/producteurs");

module.exports = {
  list: (req, res) => {
    Producteur.find({})
      .sort({ updated: -1 })
      .exec()
      .then((producteurs) => {
        res.status(200).json(producteurs);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ message: "Error while fetching producteurs" });
      });
  },
};
