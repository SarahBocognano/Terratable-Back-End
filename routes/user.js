var express = require("express");
var router = express.Router();

const userControler = require("../controllers/user");
/**
 * GET /
 * retourne les infos utilisateurs dans la BDD
 */
router.get("/", userControler.infoUser);

module.exports = router;
