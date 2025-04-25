import { useState, useEffect } from "react";
import { fetchRecipes } from "../modules/recipeUtils";

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
          <div
            key={recipe.id}
            style={{
              textAlign: "center",
              border: "2px solid black",
              borderRadius: "5px",
              padding: "10px",
            }}
          >
            <img
              src={recipe.image}
              alt={recipe.nom}
              style={{ width: "200px", height: "200px" }}
            />
            <h3>{recipe.nom}</h3>
          </div>
        ))}
      </div>
    );
  }
}
