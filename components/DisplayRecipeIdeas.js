import { useState, useEffect } from "react";
import { fetchRecipes } from "../modules/recipeUtils";
import Link from "next/link";
import RecipeCard from "./RecipeCard";

// Afficher 3 recettes aléatoires
export default function DisplayRecipeIdeas() {
  const [recipes, setRecipes] = useState([]);

  // Récupérer les recettes depuis l'API
  useEffect(() => {
    const loadRecipes = async () => {
      const allRecipes = await fetchRecipes();
      setRecipes(allRecipes);
    };
    loadRecipes();
  }, []);

  // Sélectionner 3 recettes aléatoires
  const randomRecipes = () => {
    const shuffled = [...recipes].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  // Afficher les 3 recettes
  if (recipes.length === 0) {
    return <div>Loading...</div>;
  } else if (recipes.length < 3) {
    return <div>Not enough recipes available.</div>;
  } else {
    const selectedRecipes = randomRecipes();
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
          margin: "20px",
          alignItems: "center",
        }}
      >
        {selectedRecipes.map(recipe => (
          <Link
            href={`/recipes/${recipe.id}`}
            key={recipe.id}
            passHref
            style={{ textDecoration: "none" }}
          >
            <RecipeCard key={recipe.id} recipe={recipe} />
          </Link>
        ))}
      </div>
    );
  }
}
