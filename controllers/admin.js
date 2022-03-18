let Produits = require("../models/produits");
let Admin = require("../models/admin");
let Producteurs = require("../models/producteurs");
let Recettes = require("../models/recettes");
let Commandes = require("../models/commandes");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports = {
  // 1 - Produit
  // @see admin/produit.js

  // 2 - Producteurs
  // @see admin/producteur.js

  // 3 - Recettes

  createRecette: (req, res) => {
    console.log("create ok");

    let { name, description, shares, time, ingredients } = req.body;

    //Si les champs ne sont pas tous rempli, le formulaire ne sera pas envoyé + renvoi erreur 422
    if (!name || !description || !shares || !time || !ingredients) {
      return res
        .status(422)
        .json({ message: "Certains champs sont manquants" });
    }

    // Création du nouveau produit, sur la base du modèle mongoose
    const createdRecette = new Recettes({
      name,
      description,
      shares,
      time,
      ingredients,
    });

    //Verification de connexion de l'admin pour ajouter un produit
    const token = req.get("Authorization").split(" ")[1];

    jwt.verify(token, process.env.SECRET, (error, decoded) => {
      if (error) {
        return res.status(401).json({ message: "Le Token est invalide" });
      }
      Admin.findOne(
        { _id: decoded.adminId },
        createdRecette.save((error, createdRecette) => {
          if (error) {
            console.log(error);
            return res
              .status(500)
              .json({ message: "Une erreur s'est produite" });
          }
          console.log(createdRecette);
          res.status(200).json({
            message: "Votre recette à été ajouté",
            createdRecette,
          });
        })
      );
    });
  },

  modifyRecette: (req, res) => {
    console.log("modify ok");
    const { name, description, shares, time, ingredients } = req.body;

    const token = req.get("Authorization").split(" ")[1];

    jwt.verify(token, process.env.SECRET, async (err, decoded) => {
      if (err) {
        res.status(500).json({ message: "Une erreur s'est produite" });
        return;
      }
      const admin = await Admin.findOne({ _id: decoded.adminId });
      if (!admin) {
        res.status(401).json({ message: " Votre compte admin est invalide " });
        return;
      }

      let updatedRecette = new Recettes({
        _id: req.params.id,
        name: name,
        description: description,
        shares: shares,
        time: time,
        ingredients: ingredients,
      });

      updatedRecette
        .updateOne({ _id: req.params.id }, recette)
        .then(() => {
          res
            .status(200)
            .json({ message: "La recette à bien été modifié", updatedRecette });
        })
        .catch((error) => {
          res.status(400).json({ error: error });
        });
    });
  },

  deleteRecette: (req, res) => {
    console.log("delete ok");

    const { name, description, shares, time, ingredients } = req.body;

    const token = req.get("Authorization").split(" ")[1];

    jwt.verify(token, process.env.SECRET, async (err, decoded) => {
      if (err) {
        res.status(500).json({ message: "Une erreur s'est produite" });
        return;
      }
      const admin = await Admin.findOne({ _id: decoded.adminId });
      if (!admin) {
        res.status(401).json({ message: " Votre compte admin est invalide " });
        return;
      };

      let deletedRecette = new Recettes({
        _id: req.params.id,
        name: name,
        description: description,
        shares: shares,
        time: time,
        ingredients: ingredients,
      });

      deletedRecette
        .deleteOne({ _id: req.params.id })
        .then(() => {
          res.status(200).json({
            message: "La recette à bien été supprimée",
            deletedRecette,
          });
        })
        .catch((error) => {
          res.status(400).json({ error: error });
        });
    });
  },

  // 4 - Commandes

  commandInfo: async (req, res) => {
    console.log("commandInfo ok");
    Commandes.find({})
      .sort({ updated: -1 })
      .exec()
      .then((commandes) => {
        res.status(200).json(commandes);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ message: "Error while fetching commands" });
      });
  },

  createCommand: async (req, res) => {
    console.log("createCommand ok");
    const order = new Commandes({
      productId: req.body.productId,
      quantity: req.body.quantity,
      title: req.body.title,
    });
    const createdOrder = await order.save();
    res.status(200).json({
      message: " Une nouvelle commande à été créer ",
      order: createdOrder,
    });
  },

  commandStatus: async (req, res) => {
    console.log("modifyCommand ok");
    const order = await Commandes.findById(req.body._id);

    console.log(order);

    if (order) {
      if (req.body.isDelivered != false) {
        order.deliveredAt = Date.now();
        const updatedOrder = await order.save();
        return res.status(200).json({
          message: "Votre commande à été livrée",
          order: updatedOrder,
        });
      } else if (req.body.inProgress != false) {
        order.inProgressAt = Date.now();
        const updatedOrder = await order.save();
        return res.status(200).json({
          message: "Votre commande est en cours de préparation",
          order: updatedOrder,
        });
      } else req.body.untreated != false;
      const updatedOrder = await order.save();
      return res.status(200).json({
        message: "Votre commande n'a pas encore été traitée",
        order: updatedOrder,
      });
    } else
      return res
        .status(404)
        .json({ message: "Votre commande n'existe pas ou est introuvable" });
  },

  // 4 - Register

  register: async (req, res) => {
    console.log("register ok");

    let registerData = ({ mail, password } = req.body);

    if (!registerData.mail || !registerData.password) {
      return res
        .status(422)
        .json({ message: "l'un des champ requis est vide" });
    }

    registerData.password = await bcrypt.hash(registerData.password, 10);

    const adminToRegister = new Admin(registerData);

    adminToRegister.save({}, (error, savedAdminInDb) => {
      if (error) {
        return res
          .status(500)
          .json({ message: "Une erreur s'est produite", error });
      }

      jwt.sign(
        { adminId: savedAdminInDb._id },
        process.env.SECRET,
        (err, token) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "Une erreur s'est produite" });
          }
          return res.status(200).json({
            message: "Admin Registered",
            admin: savedAdminInDb,
            token,
          });
        }
      );
    });
  },

  // 5 - Login

  login: (req, res) => {
    console.log("login ok");

    let { mail, password } = req.body;

    Admin.findOne({ mail: mail }, async (error, data) => {
      if (error) {
        return res.status(500).json({ message: "Une erreur s'est produite" });
      }
      if (data === null) {
        return res
          .status(422)
          .json({ message: "Email ou mot de passe invalide" });
      }
      if (!(await bcrypt.compare(password, data.password))) {
        return res
          .status(422)
          .json({ message: "Email ou mot de passe invalide" });
      }

      jwt.sign({ adminId: data._id }, process.env.SECRET, (err, token) => {
        if (err) {
          return res.status(500).json({ message: "Une erreur s'est produite" });
        }
        return res
          .status(200)
          .json({ message: "Vous êtes connectée", admin: data, token });
      });
    });
  },
};
