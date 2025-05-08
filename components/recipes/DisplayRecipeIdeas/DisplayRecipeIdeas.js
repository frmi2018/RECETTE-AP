import { useState, useEffect } from "react";
import { fetchRecipes } from "@/lib/api-recipes";
import Link from "next/link";
import RecipeCard from "../RecipeCard";
import styles from "./DisplayRecipeIdeas.module.css";

/**
 * Composant : DisplayRecipeIdeas
 * Rôle : Affiche 3 recettes contenues dans le fichier recipe.json
 */

const DisplayRecipeIdeas = () => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const allRecipes = await fetchRecipes();
        setRecipes(allRecipes);
      } catch (err) {
        console.error("Erreur lors du chargement des recettes :", err);
        setError(err.message);
      }
    };
    loadRecipes();
  }, []);

  const randomRecipes = () => {
    const shuffled = [...recipes].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  if (recipes.length === 0) {
    return <div>Chargement des recettes...</div>;
  }

  if (recipes.length < 3) {
    return <div>Pas assez de recettes disponibles.</div>;
  }

  const selectedRecipes = randomRecipes();

  return (
    <div className={styles.wrapper}>
      <div className={styles.recipeContainer}>
        {selectedRecipes.map(recipe => (
          <Link
            href={`/recipes/${recipe.id}`}
            key={recipe.id}
            passHref
            className={styles.recipeCardLink}
          >
            <RecipeCard recipe={recipe} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DisplayRecipeIdeas;
