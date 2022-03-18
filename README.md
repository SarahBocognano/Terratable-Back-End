# Liste des routes


# Require

- `ExpressJS 4.0`
- `MongoDB`
- `nodemon`

# Run

- `git clone https://github.com/Le-Bocal-Academy/Terratable-Back`
- `npm install`
- `npm start`

# Exemple et validation de la connextion à la DB

Deux routes d'exemple servent à valider l'architecture et la connection à la DB

elles utilisent :

- un `router` : `routes/exemple.js`
- un `controller` : `controllers/exemple.js`
- un `model` : `models/exemple.js`

dans `app.js` les routes d'exemples sont chargées par

```js
app.use("/exemple", exempleRouter);
```

---

------------LISTE DES METHODES GET------------

### GET `/exemple`

Retourne la liste des items de test ajoutés dans la base MongoDB

### GET `/exemple/add`

ajoute une donné de test dans la base de données

### GET `/produits`

Retourne la liste des produits

### GET `/recettes`

Retourne la liste des recettes

### GET `/producteurs`

Retourne la liste des producteurs

### GET `/admin/commandes`

Retourne les informations de commande de l'utilisateur

### GET `/panier`

Retourne les informations de l'utilisateur

---

------------LISTE DES METHODES PUT------------

### PUT `/admin/produits`

Modifie la liste des produits (uniquement par l'admin)

### PUT `/admin/recettes`

Modifie la liste des recettes (uniquement par l'admin)

### PUT `/admin/producteurs`

Modifie la liste des producteurs (uniquement par l'admin)

### PUT `/admin/commandes`

Modifie le status de la commande (uniquement par l'admin)

---

------------LISTE DES METHODES POST------------

### POST `/admin/login`

Login de l'admin

### POST `/admin/produits`

Affiche la liste des produits ajouté par l'admin

### POST `/admin/recettes`

Affiche la liste des recettes ajouté par l'admin

### POST `/admin/producteurs`

Affiche la liste des producteurs ajouté par l'admin

### POST `/admin/commandes`

Affiche le status de la commande ajouté par l'admin

### POST `/admin/register`

Register de l'admin

---

------------LISTE DES METHODES DELETE------------

### DELETE `/admin/produits`

Supprime un ou plusieurs item dans la liste des produits

### DELETE `/admin/recettes`

Supprime un ou plusieurs item dans la liste des recettes

### DELETE `/admin/producteurs`

Supprime un ou plusieurs item dans la liste des producteurs
