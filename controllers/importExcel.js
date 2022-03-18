const XLSX = require("xlsx");
const Produits = require("../models/produits");
const Producteurs = require("../models/producteurs");
const ProduitsTypes = require("../models/produitType");
const fsPromises = require("fs/promises");

const importExcelController = {
    import: async (req, res) => {
        if (!req.file) {
            return res.status(400).json({
                message: "Erreur dans le fichier Excel, fichier vide ou au mauvais format",
            });
        }
        let sheetData = req.file.path;
        let workbook = XLSX.readFile(sheetData);
        let sheet_name_list = workbook.SheetNames;
        let xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

        const idProducteur = req.body._id;
        Producteurs.findById({ _id: idProducteur }, async (error, producerInDb) => {
            if (producerInDb === null) {
                return res
                    .status(400)
                    .json({ message: "Ce producteur n'existe pas, Merci de le créer dans le formulaire dédié", error });
            } else {
                const results = await Promise.allSettled(
                    xlData.map((productData, index) => {
                        const productResults = Produits.updateOne(
                            { sku: productData.sku },
                            {
                                $set: {
                                    name: productData.Name,
                                    sku: productData.Sku,
                                    resume: productData.Resume,
                                    categorie: productData.Categorie,
                                    unit: productData.Unit,
                                    producer: productData.Producteurs,
                                    price: productData.PrixAverage,
                                    enable: productData.Enable,
                                    promote: productData.Promote,
                                    productType: productData.Product_types,
                                },
                            },
                            { upsert: true }
                        );

                        // FONCTION d'ajout d'un produit_types si inexistant lors de l'import
                        const filter2 = productData.product_types;
                        const content2 = { $set: { name: filter2 } };
                        const options2 = { upsert: true, setDefaultOnInsert: true };

                        const productTypesResults = ProduitsTypes.updateOne((filter2, content2, options2));

                        return Promise.all([productResults, productTypesResults]);
                    })
                );
                // PURGE du fichier tampon après Upload
                const insertedCount = results.filter((result) => result.status === "fulfilled").length;
                try {
                    await fsPromises.unlink(sheetData);
                    console.log("Fichier tampon supprimer ");

                    res.status(200).json({ message: insertedCount + " produits insérés" });
                } catch (error) {
                    res.json({ message: insertedCount + " produits insérés attention Fichier tampon non supprimer" });
                }
            }
        });
    },
};

module.exports = importExcelController;
