import { useState, useEffect } from "react";
import { fetchRecipes } from "../modules/recipeUtils";
import RecipeCard from "./RecipeCard"; // Assurez-vous que le chemin est correct

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
