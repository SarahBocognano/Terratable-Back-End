var express = require("express");
var router = express.Router();

const recetteControler = require("../controllers/recettes");
/**
 * GET /
 * retourne la liste de recettes dans la BDD
 */
router.get("/", recetteControler.list);

module.exports = router;
