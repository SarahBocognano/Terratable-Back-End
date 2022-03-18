const Recettes = require("../../models/recettes");

/**
 * Verif des infos d'un produit
 * @returns false si l'un des chgamps requis n'est pas bien remplit
 * (sinon les données à enregistrer)
 */
let check = async (req, res) => {
  // liste des champs requis
  let requireFields = ["name", "description", "shares", "time", "ingredients"];
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
};

/**
 * Controller de produit
 */
const adminRecetteController = {
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

    const recetteToAdd = new Recettes(datasToSave);
    recetteToAdd.save({}, (error, createdRecette) => {
      if (error) {
        return res
          .status(500)
          .json({ message: "Une erreur s'est produite", error });
      }
      return res.status(200).json({
        message: "Recette à été ajouté",
        createdRecette,
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
    Recettes.findOne({ _id: idRecette }, async (error, recetteInDB) => {
      if (error) {
        res.status(500).json({
          message: "Une erreur s'est produite",
          error,
        });
        return false;
      }
      if (recetteInDB === null) {
        // produit non trouvé
        return res
          .status(404)
          .json({ message: "Aucune recette ne semble correspondre." });
      }
      // all checks done

      const filters = { _id: idRecette };
      // https://docs.mongodb.com/manual/reference/operator/update/inc/
      const updates = { $set: datasToSave };
      const options = { new: true };
      Recettes.findOneAndUpdate(
        filters,
        updates,
        options,
        (error, updatedRecette) => {
          // `updatedProduit` is the document _after_ `update` was applied because of
          // `new: true`
          // Mongoose's findOneAndUpdate() is slightly different from the MongoDB Node.js driver's findOneAndUpdate()
          // because it returns the document itself, not a result object
          if (error) {
            return res
              .status(500)
              .json({ message: "Une erreur s'est produite", error });
          }
          if (updatedRecette === null) {
            return res.status(404).json({
              message: "Aucune recette ne semble correspondre.",
            });
          }
          return res.status(200).json({
            message: "La recette à bien été modifié",
            updatedRecette,
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
    let idRecette = req.body._id;
    if (!idRecette || idRecette.trim().length == 0) {
      return res.status(422).json("missing _id to delete.");
    }

    const filters = { _id: idRecette };
    Recettes.findOneAndDelete(filters, (error, deletedRecette) => {
      if (error) {
        return res.status(500).json({ message: "Une erreur s'est produite" });
      }
      if (deletedRecette === null) {
        return res.status(404).json({
          message: "Aucune recette ne semble correspondre.",
        });
      }
      return res.status(200).json({
        message: "La recette à été supprimé ",
        deletedRecette,
      });
    });
  },
};

module.exports = adminRecetteController;
