const ProductType = require("../../models/produitType");
const Product = require("../../models/produits");

/**
 * Verif des infos d'un produit type
 * @returns false si l'un des chgamps requis n'est pas bien remplit
 * (sinon les données à enregistrer)
 */
let check = async (req, res) => {
    // liste des champs requis
    let requireFields = [
        "name",
        "resume",
        "categorie",
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
    // all checks done
    return datasToSave;
};

/**
 * Controller de produit type
 */
const adminProductTypeController = {

    /**
     * Ajout d'un produit type
     */
    create: async (req, res) => {
        // verif des données fournis par le client
        let datasToSave = await check(req, res);
        if (!datasToSave) {
            // un "response" contenant l'erreur à déja due etre envoyée
            return;
        }

        const productTypeToAdd = new ProductType(datasToSave);
        productTypeToAdd.save({}, (error, savedProductTypeInDB) => {
            if (error) {
                return res
                    .status(500)
                    .json({ message: "Une erreur s'est produite", error });
            }
            return res.status(200).json({
                message: "Product Type created",
                productType: savedProductTypeInDB,
            });
        });
    },

    /**
     * modification d'un produitType existant
     */
    update: async (req, res) => {
        // verif des données fournis par le client
        let datasToSave = await check(req, res);
        if (!datasToSave) {
            // un "response" contenant l'erreur à déja due etre envoyée
            return;
        }

        // id du product à mettre à jour
        let idProductType = req.body._id;
        if (!idProductType || idProductType.trim().length == 0) {
            return res.status(422).json("missing productType._id to update.");
        }

        // check if producer._id still exist in DB
        ProductType.findOne({ _id: idProductType }, async (error, productTypeInDB) => {
            if (error) {
                res.status(500).json({
                    message: "Une erreur s'est produite",
                    error,
                });
                return false;
            }
            if (productTypeInDB === null) {
                // produit non trouvé
                return res.status(404).json({ message: "Produit Type non trouvé" });
            }
            // all checks done

            const filters = { _id: idProductType };
            // https://docs.mongodb.com/manual/reference/operator/update/inc/
            const updates = { $set: datasToSave };
            const options = { new: true };
            ProductType.findOneAndUpdate(
                filters,
                updates,
                options,
                (error, updatedProductType) => {
                    // `updatedProductType` is the document _after_ `update` was applied because of
                    // `new: true`
                    // Mongoose's findOneAndUpdate() is slightly different from the MongoDB Node.js driver's findOneAndUpdate()
                    // because it returns the document itself, not a result object
                    if (error) {
                        return res
                            .status(500)
                            .json({ message: "Une erreur s'est produite" });
                    }
                    if (updatedProductType === null) {
                        return res.status(404).json({
                            message: "Aucun produit ne semble correspondre.",
                        });
                    }
                    return res.status(200).json({
                        message: "Produit Type updated.",
                        productType: updatedProductType,
                    });
                }
            );
        });
    },

    /**
     * Suppression d'un produit type en DB
     */
    delete: async (req, res) => {
        // id du product Type à supprimer
        let idProductType = req.body._id;
        if (!idProductType || idProductType.trim().length == 0) {
            return res.status(422).json("missing productType._id to delete.");
        }
        // ce produit type a t il encore des produits ?
        const filterProducts = { productType: idProductType };
        const products = await Product.find(filterProducts);

        if (products && products.length) {
            return res.status(422).json({
                message: "Ce produit type possede des produits.",
            });
        }

        const filters = { _id: idProductType };
        ProductType.findOneAndDelete(filters, (error, deletedProductType) => {
            if (error) {
                return res
                    .status(500)
                    .json({ message: "Une erreur s'est produite" });
            }
            if (deletedProductType === null) {
                return res.status(404).json({
                    message: "Aucun produit Type ne semble correspondre.",
                });
            }
            return res.status(200).json({
                message: "Produit Type deleted.",
                productType: deletedProductType,
            });
        });
    },
};
module.exports = adminProductTypeController;