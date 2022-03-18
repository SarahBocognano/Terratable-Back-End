let Recettes = require("../models/recettes");

module.exports = {
  list: (req, res) => {
    Recettes.find({})
      .sort({ updated: -1 })
      .then((recettes) => {
        res.status(200).json(recettes);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ message: "Error while fetching recettes" });
        res.status(404).json({ message: "file not found" });
      });
  },
};
