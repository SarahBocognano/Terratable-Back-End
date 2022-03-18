var express = require("express");
var router = express.Router();

const producteurControler = require("../controllers/producteurs");
/**
 * GET /
 * retourne la liste de producteurs dans la BDD
 */
router.get("/", producteurControler.list);

module.exports = router;
