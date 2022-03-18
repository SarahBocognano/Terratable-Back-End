const multer = require("multer");

const multerExcel = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "toDelete"); //important this is a direct path from our current file to storage location
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "--" + file.originalname);
    },
});

module.exports = multer({
    storage: multerExcel,
}).single("file");
