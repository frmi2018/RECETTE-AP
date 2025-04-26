# PAGE INGREDIENTS

Affiche la liste de toutes les ingrédients.

## page ingredients.js

```js
import IngredientList from "../components/IngredientList";

export default function IngredientsPage() {
  return (
    <div>
      <h1>Liste des ingrédients</h1>
      <IngredientList />
    </div>
  );
}
```

## composant RecipeList.js

Utilse fetchIngredients pour importer les ingrédients du fichier JSON.  
Utilse le composant IngredientCard pour l'affichage de chaque ingrédient.

```js
import { useState, useEffect } from "react";
import { fetchIngredients } from "../modules/ingredientUtils";
import IngredientCard from "./IngredientCard";

export default function IngredientList() {
  const [ingredients, setIngredients] = useState([]);
  const [page, setPage] = useState(1);
  const ingredientsPerPage = 5;

  useEffect(() => {
    const loadIngredients = async () => {
      const allIngredients = await fetchIngredients();
      setIngredients(allIngredients);
    };
    loadIngredients();
  }, []);

  const filteredIngredients = ingredients.slice(
    (page - 1) * ingredientsPerPage,
    page * ingredientsPerPage,
  );

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        {filteredIngredients.map(ingredient => (
          <IngredientCard key={ingredient.id} ingredient={ingredient} />
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Précédent
        </button>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page * ingredientsPerPage >= ingredients.length}
        >
          Suivant
        </button>
      </div>
    </>
  );
}
```

## ✅ Fonctionnalités actuelles

- ✅ Affichage des ingrédients
- 📁 Importation de données mockées depuis `/public/api/ingredients.json`
- 🖼️ Support d’images statiques (via `public/images/ingredients`)
- 📄 Pagination 5 ingrédients par page

## 🛠️ Tests

Fichiers de configuration présents pour Jest :

- 🧪 `jest.config.js` — Configuration principale de Jest
- ⚙️ `jest.setup.js` — Setup pour les tests (ex. mocks globaux, etc.)

## 🧠 À venir

- ➕➖ Ajout/suppression ingrédients
- 🔍 Composant de recherche
- ↕️ Composant de tri
- 🗄️ Connexion à une base de données
