let ProduitType = require("../models/produitType");

const produitTypesController = {
    /**
     * Retourne la liste du controllers produitTypes
     */
    list: async (req, res) => {
        const filter = {};
        await ProduitType.find(filter)
            .sort({ created: -1 })
            .then((produitTypes) => {
                res.status(200).json(
                    produitTypes
                );
            })
            .catch((err) => {
                console.log(err), res.status(500).json({ msg: "Error While fetching List" });
            });
    },
};

module.exports = produitTypesController;
