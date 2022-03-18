const express = require("express");
const router = express.Router();

const adminControler = require("../controllers/admin");
const adminRecetteController = require("../controllers/admin/recette");
const adminProduitTypeControler = require("../controllers/admin/produitType");
const adminProduitControler = require("../controllers/admin/produit");
const adminProducteurControler = require("../controllers/admin/producteur");

//-------Login-------//

router.post("/login", adminControler.login);

//-------Produit Types-------//

router.post("/produitTypes", adminProduitTypeControler.create);
router.put("/produitTypes", adminProduitTypeControler.update);
router.delete("/produitTypes", adminProduitTypeControler.delete);

//-------Produits-------//

router.post("/produits", adminProduitControler.create);
router.put("/produits", adminProduitControler.update);
router.delete("/produits", adminProduitControler.delete);

//-------Recettes-------//

router.post("/recettes", adminRecetteController.create);
router.put("/recettes", adminRecetteController.update);
router.delete("/recettes", adminRecetteController.delete);

//-------Producteurs-------//

router.post("/producteurs", adminProducteurControler.create);
router.put("/producteurs", adminProducteurControler.update);
router.delete("/producteurs", adminProducteurControler.delete);

//-------Commandes-------//

router.get("/commandes", adminControler.commandInfo);
router.put("/commandes", adminControler.commandStatus);
router.post("/commandes", adminControler.createCommand);

//-------Register-------//

router.post("/register", adminControler.register);

module.exports = router;
