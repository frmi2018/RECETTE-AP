# PAGE RECETTES

Affiche la liste de toutes les recettes.

## page recipes.js

```js
import RecipeList from "../components/RecipeList";

export default function RecipesPage() {
  return (
    <div>
      <h1>Liste des recettes</h1>
      <RecipeList />
    </div>
  );
}
```

## composant RecipeList.js

Utilse fetchRecipes pour importer les recettes du fichier JSON.  
Utilse le composant RecipeCard pour l'affichage de chaque recette.

```js
import { useState, useEffect } from "react";
import { fetchRecipes } from "../modules/recipeUtils";
import RecipeCard from "./RecipeCard";

export default function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(1);
  const recipesPerPage = 5;

  useEffect(() => {
    const loadRecipes = async () => {
      const allRecipes = await fetchRecipes();
      setRecipes(allRecipes);
    };
    loadRecipes();
  }, []);

  const filteredRecipes = recipes.slice(
    (page - 1) * recipesPerPage,
    page * recipesPerPage,
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
        {filteredRecipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
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
          disabled={page * recipesPerPage >= recipes.length}
        >
          Suivant
        </button>
      </div>
    </>
  );
}
```

## ✅ Fonctionnalités actuelles

- ✅ Affichage des recettes
- 📁 Importation de données mockées depuis `/public/api/ingredients.json`
- 🖼️ Support d’images statiques (via `public/images/recipes`)
- 📄 Pagination 5 recettes par page

## 🛠️ Tests

Fichiers de configuration présents pour Jest :

- 🧪 `jest.config.js` — Configuration principale de Jest
- ⚙️ `jest.setup.js` — Setup pour les tests (ex. mocks globaux, etc.)

## 🧠 À venir

- ➕➖ Ajout/suppression recettes
- 🔍 Composant de recherche
- ↕️ Composant de tri
- 🗄️ Connexion à une base de données
