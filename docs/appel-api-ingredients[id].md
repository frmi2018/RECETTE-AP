✅ Exemples d’appels client avec /api/ingredients/:id

▶ Voir un ingrédient par ID

```js
const getIngredientById = async id => {
  const response = await fetch(`/api/ingredients/${id}`);
  const data = await response.json();
  console.log(data);
};
```

📝 Mettre à jour un ingrédient

```js
const updateIngredient = async (id, updatedFields) => {
  const response = await fetch(`/api/ingredients/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedFields),
  });
  const data = await response.json();
  console.log(data);
};
```

🗑 Supprimer un ingrédient

```js
const deleteIngredient = async id => {
  const response = await fetch(`/api/ingredients/${id}`, {
    method: "DELETE",
  });
  const data = await response.json();
  console.log(data);
};
```
