const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const multer = require("multer");

if (process.env.NODE_ENV !== "production") {
    dotenv.config({ path: "./.env" });
}

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// sets up CORS for Cross-Origin-Resource-Sharing
var corsOptions = {

  origin: process.env.ORIGIN || "http://localhost:3000",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204

};
app.use(cors(corsOptions));

// converts API responses to JSON for easy use
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// initializes our database using the credentials (from .env)
const mongoURI = process.env.mongoURI || "mongodb://127.0.0.1:27017/terratable";
console.log("Try to connect to " + mongoURI);
mongoose
    .connect(mongoURI)
    .then(() => console.log("Mongo Database connected to " + mongoURI))
    .catch((err) => console.log(err));

// Ici sont definies les routes

const produitsRouter = require("./routes/produits");
const produitTypesRouter = require("./routes/produitTypes");
const producteursRouter = require("./routes/producteur");
const recettesRouter = require("./routes/recette");
const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");
const importExcelRouter = require("./routes/importExcel");
const adminOnly = require("./middleware/adminOnly");

// initializes our routes path/controlers

app.use("/produits/list", produitsRouter);
app.use("/produitTypes", produitTypesRouter);
app.use("/producteurs", producteursRouter);
app.use("/recettes", recettesRouter);
app.use("/panier", userRouter);

// les autres routes "/admin/*" sont restreintes aux comptes admin connecté
app.use("/admin", adminOnly);
app.use("/admin", adminRouter);
app.use("/import", importExcelRouter);

module.exports = app;
