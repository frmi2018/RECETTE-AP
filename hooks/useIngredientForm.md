# 📄 Documentation du hook useIngredientForm

Ce hook personnalisé `useIngredientForm` est conçu pour gérer le **formulaire d'ingrédient** dans une application React (ex. : ajout ou modification d’un ingrédient dans une recette).

## ✅ Objectif

Il permet de :

- Gérer l’état du formulaire (valeurs, champs dynamiques, erreurs),

- Mettre à jour les données à la volée,

- Valider les champs de prix,

- Ajouter/supprimer des champs pour les prix par magasin,

Gérer les catégories d’ingrédients.

## 🔁 Signature du hook

```js
useIngredientForm(initialIngredient, defaultCategories);
```

**Paramètres :**

- `initialIngredient` (objet ou null) : les données d’un ingrédient à modifier (ou `null` si on crée un nouveau).

- `defaultCategories` (tableau de chaînes) : liste de catégories proposées par défaut.

## 🧠 États internes (useState)

`formData`
Contient toutes les données du formulaire, par exemple :

```js
{
  nom: "",
  quantité: 0,
  quantité_a_acheter: 0,
  unité: "pièce",
  catégorie: "",
  unite_facturation: "unité",
  image: "/images/add-image.png",
  marque: "sans marque",
  prix_par_magasin: [{ magasin: "Autre", prix: 0.0 }],
}
```

`priceErrors`
Objet contenant les erreurs de validation des prix, par index.

`showCustomCategory`
Booléen pour afficher ou non un champ de saisie de catégorie personnalisée.

## 🧩 Initialisation avec `useEffect`

Quand `initialIngredient` est fourni, le hook initialise les champs du formulaire avec ses données.
Il s'assure que les prix sont convertis en nombres (`parseFloat` si besoin).

## 🧰 Fonctions utilitaires

`handleChange(e)`
Met à jour un champ du formulaire selon son nom :

- Convertit en nombre si c’est un champ de quantité,

- Sinon, garde la valeur telle quelle.

`handlePriceInput(value, index)`
Met à jour la valeur d’un prix dans `prix_par_magasin`, tout en :

- remplaçant `,` par `.`,

- validant le format (max 2 décimales, positif),

- stockant l’erreur si invalide.

`handlePriceChange(index, field, value)`
Change un champ (prix ou magasin) dans une entrée de prix_par_magasin.

`addStoreField()`
Ajoute un champ vide pour un nouveau magasin.

`removeStoreField(index)`
Supprime un champ de prix pour un magasin à l'index donné.

`validatePrices()`
Vérifie que tous les prix :

- ont un format valide (0.00 par ex),

- sont des nombres positifs, et stocke les erreurs.

## 🔤 `sortedCategories`

Renvoie la liste des catégories triée par ordre alphabétique (avec la catégorie actuelle incluse même si elle ne fait pas partie des catégories par défaut).

## ⚠️ `hasPriceErrors`

Retourne true si au moins une erreur de prix est présente.

## 🔁 Retour du hook

Le hook retourne l’objet suivant :

```js
{
  formData,
  setFormData,
  handleChange,
  handlePriceInput,
  handlePriceChange,
  addStoreField,
  removeStoreField,
  validatePrices,
  sortedCategories,
  showCustomCategory,
  setShowCustomCategory,
  hasPriceErrors,
  priceErrors,
}
```

## 💡 Exemple d'utilisation

```js
const { formData, handleChange, addStoreField, validatePrices } =
  useIngredientForm(null, ["Légumes", "Épices"]);
```

## 🧼 Remarques

- Ce hook suit les bonnes pratiques React : séparation de la logique et de la vue.

- Il peut être utilisé avec un composant formulaire contrôlé (value + onChange).

- L’approche rend l’application plus modulaire et facile à tester.
