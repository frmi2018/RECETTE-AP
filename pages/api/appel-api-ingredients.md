## Appels à mettre dans le fichier modules/ingredients.js

✅ Exemples d’appels client avec /api/ingredients

🗑 Supprimer un ingrédient

```js
await fetch("/api/ingredients", {
  method: "DELETE",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ id: 33 }),
});
```

📝 Mettre à jour un ingrédient

```js
await fetch("/api/ingredients", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    id: 33,
    quantité_a_acheter: 2,
    marque: "Bio Village",
    prix_par_magasin: [
      { magasin: "Carrefour", prix: 0.75 },
      { magasin: "Intermarché", prix: 0.8 },
      { magasin: "Autre", prix: 0 },
    ],
  }),
});
```

✅ 1. Voir tous les ingrédients (GET)

```js
const getAllIngredients = async () => {
  const response = await fetch("/api/ingredients");
  const data = await response.json();
  console.log("Tous les ingrédients :", data);
};
```

▶ Voir un ingrédient par ID

Remarque : utiliser /api/ingredients/:id sinon il faut d'abord récupérer tous les ingrédients et filtrer localement :

```js
const getIngredientById = async id => {
  const response = await fetch("/api/ingredients");
  const data = await response.json();
  const ingredient = data.find(item => item.id === id);
  console.log("Ingrédient trouvé :", ingredient);
};
```

✅ Ajouter un nouvel ingrédient (POST)

```js
const addIngredient = async () => {
  const newIngredient = {
    id: Date.now(), // ou une autre logique pour générer l'ID
    nom: "tomate",
    quantité: 0,
    quantité_a_acheter: 1,
    unité: "pièce",
    catégorie: "légumes",
    unite_facturation: "unité",
    prix_par_magasin: [
      { magasin: "Carrefour", prix: 0.6 },
      { magasin: "Intermarché", prix: 0.65 },
      { magasin: "Autre", prix: 0.0 },
    ],
    image: "/images/add-image.png",
    marque: "sans marque",
  };

  const response = await fetch("/api/ingredients", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newIngredient),
  });

  const result = await response.json();
  console.log(result);
};
```

Souhaites-tu que je t’aide à créer une interface React (formulaire ou liste) pour ces appels ?
