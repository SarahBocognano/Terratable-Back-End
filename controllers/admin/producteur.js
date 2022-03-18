
const Producer = require("../../models/producteurs");
const Product = require("../../models/produits");

/**
 * Verif des infos d'un producteur
 * @returns false si l'un des chgamps requis n'est pas bien remplit
 * (sinon les données à enregistrer)
 */
let check = async (req, res) => {
    // liste des champs requis
    let requireFields = ["name", "resume", "address"];
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
 * Controller de producteur
 */
const producerController = {
    /**
     * Ajout d'un producteur
     */
    create: async (req, res) => {
        // verif des données fournis par le client
        let datasToSave = await check(req, res);
        if (!datasToSave) {
            // un "response" contenant l'erreur à déja due etre envoyée
            return;
        }

        const producerToAdd = new Producer(datasToSave);
        producerToAdd.save({}, (error, createdProducteur) => {
            if (error) {
                return res
                    .status(500)
                    .json({ message: "Une erreur s'est produite", error });
            }
            return res.status(200).json({
                message: "Votre producteur à été ajouté",
                createdProducteur
            });
        });
    },

    /**
     * modification d'un producteur existant
     */
    update: async (req, res) => {
        // verif des données fournis par le client
        let datasToSave = await check(req, res);

        if (!datasToSave) {
            // un "response" contenant l'erreur à déja due etre envoyée
            return;
        }

        // id du producteur à mettre à jour
        let idProducer = req.body._id;
        if (!idProducer || idProducer.trim().length == 0) {
            return res.status(422).json("missing _id to update.");
        }

        // check if producer._id still exist in DB
        Producer.findOne({ _id: idProducer }, async (error, producerInDB) => {
            if (error) {
                res.status(500).json({
                    message: "Une erreur s'est produite",
                    error,
                });
                return false;
            }
            if (producerInDB === null) {
                // producteur non trouvé
                return res
                    .status(404)
                    .json({ message: "Aucun Producteur ne correspond" });
            }
            // all checks done

            const filters = { _id: idProducer };
            // https://docs.mongodb.com/manual/reference/operator/update/inc/
            const updates = { $set: datasToSave };
            const options = { new: true };
            Producer.findOneAndUpdate(
                filters,
                updates,
                options,
                (error, updatedProducteur) => {
                    // `updatedProducer` is the document _after_ `update` was applied because of
                    // `new: true`
                    // Mongoose's findOneAndUpdate() is slightly different from the MongoDB Node.js driver's findOneAndUpdate()
                    // because it returns the document itself, not a result object
                    if (error) {
                        return res
                            .status(500)
                            .json({ message: "Une erreur s'est produite" });
                    }
                    if (updatedProducteur === null) {
                        return res.status(404).json({
                            message: "Aucun Producteur ne correspond",
                        });
                    }
                    return res.status(200).json({
                        message: "Producteur Mis à jour",
                        updatedProducteur
                    });
                }
            );
        });
    },

    /**
     * Suppression d'un producteur en DB
     */
    delete: async (req, res) => {
        // id du producer à mettre à supprimer
        let idProducer = req.body._id;
        if (!idProducer || idProducer.trim().length == 0) {
            return res.status(422).json("missing _id to delete.");
        }

        // ce producteur a t il encore des produits ?
        const filter = { producer: idProducer };
        const products = await Product.find(filter);

        if (products && products.length) {
            return res.status(422).json({
                message: "Ce producteur possede des produits.",
            });
        }

        const filters = { _id: idProducer };
        Producer.findOneAndDelete(filters, (error, deletedProducteur) => {
            if (error) {
                return res
                    .status(500)
                    .json({ message: "Une erreur s'est produite" });
            }
            if (deletedProducteur === null) {
                return res.status(404).json({
                    message: "Impossible de retrouver le producteur à supprimer." +
                        " Ce producteur n'existe pas ou plus",
                });
            }
            return res.status(200).json({
                message: "Le producteur a été supprimer",
                deletedProducteur
            });
        });
    },
};

module.exports = producerController;