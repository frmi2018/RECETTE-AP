import { useState, useEffect } from "react";
import { fetchRecipes } from "../modules/recipeUtils";

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
    <div>
      {filteredRecipes.map(recipe => (
        <div key={recipe.id}>
          <h3>{recipe.nom}</h3>
          <p>{recipe.instructions}</p>
        </div>
      ))}
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
  );
}
