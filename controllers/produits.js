let Produits = require("../models/produits");

const produitsController = {
    /**
     * Retourne la liste du controllers produits
     */
    list: async (req, res) => {
        const filter = {};
        await Produits.find({})
            .sort({ created: -1 })
            .then((produits) => {

                res.status(200).json(
                    produits
                );
            })
            .catch((err) => {
                console.log(err), res.status(500).json({ msg: "Error While fetching List" });
            });
    },
};

module.exports = produitsController;
