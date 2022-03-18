
const Producer = require("../../models/producteurs");
const Product = require("../../models/produits");

/**
 * Verif des infos d'un produit
 * @returns false si l'un des chgamps requis n'est pas bien remplit
 * (sinon les données à enregistrer)
 */
let check = async (req, res) => {
    // liste des champs requis
    let requireFields = [
        "name",
        "sku",
        "resume",
        "productType",
        "producer",
        "price",
        "unit",
        "enable",
        "promote",
    ];
    // les champs optionels
    let optionalFields = ["description", "image"];

    // ce qui sera effectivement sauvegardé
    let datasToSave = {};

    // parcours des champs requis
    for (const fieldName of requireFields) {
        if (
            !Object.hasOwn(req.body, fieldName) ||
            req.body[fieldName].toString().trim().length == 0
        ) {
            // send error to client side
            res.status(422).json('field named "' + fieldName + '" is require.');
            // inutil de checker les autres champs
            return false;
        }
        // use value send by client
        datasToSave[fieldName] = req.body[fieldName].toString().trim();
    }

    // tout les champs requis sont bien présent (et non vide)
    // .. parcours des champs optionels
    for (const fieldName of optionalFields) {
        if (
            !Object.hasOwn(req.body, fieldName) ||
            req.body[fieldName].toString().trim().length == 0
        ) {
            // check next field
            continue;
        }
        // use value send by client
        datasToSave[fieldName] = req.body[fieldName].toString().trim();
    }
    // "." => ","
    datasToSave.price = datasToSave.price.replace(",", ".");

    // check if producer._id still exist in DB
    let producerLoadedFromDB = await Producer.findOne({
        _id: datasToSave.producer,
    }).exec();

    if (producerLoadedFromDB) {
        // all checks done
        return datasToSave;
    }
    res.status(422).json({ message: "unable to find Producer" });
    return false;
};

/**
 * Controller de produit
 */
const productController = {
    /**
     * Ajout d'un produit
     */
    create: async (req, res) => {
        // verif des données fournis par le client
        let datasToSave = await check(req, res);
        if (!datasToSave) {
            // un "response" contenant l'erreur à déja due etre envoyée
            return;
        }

        const productToAdd = new Product(datasToSave);
        productToAdd.save({}, (error, createdProduit) => {
            if (error) {
                return res
                    .status(500)
                    .json({ message: "Une erreur s'est produite", error });
            }
            return res.status(200).json({
                message: "Votre produit à été ajouté",
                createdProduit
            });
        });
    },

    /**
     * modification d'un produit existant
     */
    update: async (req, res) => {
        // verif des données fournis par le client
        let datasToSave = await check(req, res);
        if (!datasToSave) {
            // un "response" contenant l'erreur à déja due etre envoyée
            return;
        }

        // id du product à mettre à jour
        let idProduct = req.body._id;
        if (!idProduct || idProduct.trim().length == 0) {
            return res.status(422).json("missing _id to update.");
        }

        // check if producer._id still exist in DB
        Product.findOne({ _id: idProduct }, async (error, productInDB) => {
            if (error) {
                res.status(500).json({
                    message: "Une erreur s'est produite",
                    error,
                });
                return false;
            }
            if (productInDB === null) {
                // produit non trouvé
                return res.status(404).json({ message: "Aucun produit ne semble correspondre." });
            }
            // all checks done

            const filters = { _id: idProduct };
            // https://docs.mongodb.com/manual/reference/operator/update/inc/
            const updates = { $set: datasToSave };
            const options = { new: true };
            Product.findOneAndUpdate(
                filters,
                updates,
                options,
                (error, updatedProduit) => {
                    // `updatedProduit` is the document _after_ `update` was applied because of
                    // `new: true`
                    // Mongoose's findOneAndUpdate() is slightly different from the MongoDB Node.js driver's findOneAndUpdate()
                    // because it returns the document itself, not a result object
                    if (error) {
                        return res
                            .status(500)
                            .json({ message: "Une erreur s'est produite", error });
                    }
                    if (updatedProduit === null) {
                        return res.status(404).json({
                            message: "Aucun produit ne semble correspondre.",
                        });
                    }
                    return res.status(200).json({
                        message: "Le produit à bien été modifié",
                        updatedProduit
                    });
                }
            );
        });
    },

    /**
     * Suppression d'un produit en DB
     */
    delete: async (req, res) => {
        // id du product à mettre à supprimer
        let idProduct = req.body._id;
        if (!idProduct || idProduct.trim().length == 0) {
            return res.status(422).json("missing _id to delete.");
        }

        console.log("// todo : verif que le produit ne soit dans aucun panier");
        console.log("// todo : verif que le produit ne soit dans aucune recette");

        const filters = { _id: idProduct };
        Product.findOneAndDelete(filters, (error, deletedProduit) => {
            if (error) {
                return res
                    .status(500)
                    .json({ message: "Une erreur s'est produite" });
            }
            if (deletedProduit === null) {
                return res.status(404).json({
                    message: "Aucun produit ne semble correspondre.",
                });
            }
            return res.status(200).json({
                message: "Le produit à été supprimé ",
                deletedProduit,
            });
        });
    },
};
module.exports = productController;
