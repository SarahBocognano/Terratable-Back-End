var express = require("express");
var router = express.Router();
var upload = require("../middleware/multer");

const importExcelController = require("../controllers/importExcel");

router.post("/", upload, importExcelController.import);

module.exports = router;
