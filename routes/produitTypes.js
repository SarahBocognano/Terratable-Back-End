var express = require("express");
var router = express.Router();

const produitTypesController = require("../controllers/produitTypes");

/**
 * GET /
 * retourne la liste de produitTypes dans la BDD
 */
router.get("/", produitTypesController.list);

module.exports = router;
