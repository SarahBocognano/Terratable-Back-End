
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
let Admin = require("../models/admin");

/**
 * Controle que la requete est bien demandé par un admin qui est connecté
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {*} next
 */
const adminOnly = function (req, res, next) {

    if (req.originalUrl == "/admin/login") {
        // La connexion ne require pas d'étre connecté
        next();
        return;
    }
    
    if (
        // pas de header "Authorization"
        !req.get("Authorization")
        // contenut non conforme (mot requis : "Bearer" puis "espace" et le token)
        || req.get("Authorization").indexOf(" ") == -1
        || req.get("Authorization").indexOf("Bearer") !== 0
        // token vide
        || !req.get("Authorization").split(" ")[1]
        || !req.get("Authorization").split(" ")[1].trim())
    {
        // 401 Unauthorized
        return res.status(401).send({ message: "Missing Bearer Token" });
    }
    
    // Reccup du token envoyé par le client
    const token = req.get("Authorization").split(" ")[1].trim();
    
    // Verification du token
    jwt.verify(token, process.env.SECRET, async (error, decoded) => {
        if (error) {
            // 403 Forbidden
            return res.status(403).json({ message: "Le Token est invalide" });
        }
        // recherche de ce compte admin en BDD
        const admin = await Admin.findOne({ _id: decoded.adminId });
        if (!admin) {
            // 403 Unauthorized
            return res.status(403).json({ message: "Votre compte admin est invalide" });
        }
        // All check done (you are now allowed)
        next();
    });
};

module.exports = adminOnly;