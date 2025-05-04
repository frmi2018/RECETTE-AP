
# ✅ API Guide – `/api/recipes`

Ce guide décrit comment utiliser l’API RESTful pour gérer les recettes stockées dans `data/recipes.json`.

---

## 📋 Voir toutes les recettes (GET)

```js
const getAllRecipes = async () => {
  const response = await fetch("/api/recipes");
  const data = await response.json();
  console.log("Toutes les recettes :", data);
};
```

---

## ▶ Voir une recette par ID

⚠️ Il faut d'abord récupérer toutes les recettes, puis filtrer :

```js
const getRecipeById = async (id) => {
  const response = await fetch("/api/recipes");
  const data = await response.json();
  const recipe = data.find(item => item.id === id);
  console.log("Recette trouvée :", recipe);
};
```

---

## ➕ Ajouter une nouvelle recette (POST)

```js
const addRecipe = async () => {
  const newRecipe = {
    id: Date.now(), // ou toute logique d’ID unique
    nom: "Salade composée",
    ingrédients: [
      { id: 1, quantité: 2, unité: "pièce" },
      { id: 3, quantité: 100, unité: "g" },
    ],
    instructions: "Mélanger tous les ingrédients.",
    temps_de_preparation: 10,
    image: "/images/recette-salade.png",
  };

  const response = await fetch("/api/recipes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newRecipe),
  });

  const result = await response.json();
  console.log(result);
};
```

---

## 📝 Mettre à jour une recette (PUT)

```js
const updateRecipe = async () => {
  await fetch("/api/recipes", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: 123,
      nom: "Salade revisitée",
      temps_de_preparation: 15,
    }),
  });
};
```

---

## 🗑 Supprimer une recette (DELETE)

```js
await fetch("/api/recipes", {
  method: "DELETE",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ id: 123 }),
});
```

---

## ⚙️ Détails techniques

- **Méthodes supportées :** `GET`, `POST`, `PUT`, `DELETE`
- **Fichier source :** `data/recipes.json`
- **ID requis :** pour `PUT` et `DELETE`
- **Pas de paramètre dans l’URL :** tous les appels passent par `/api/recipes`

---
