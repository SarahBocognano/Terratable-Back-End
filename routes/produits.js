var express = require("express");
var router = express.Router();

const produitsController = require("../controllers/produits");

/**
 * GET /
 * retourne la liste de produits dans la BDD
 */
router.get("/", produitsController.list);

module.exports = router;
