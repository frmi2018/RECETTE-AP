import { useState, useEffect } from "react";
import { fetchRandomRecipes } from "@/lib/api-recipes";
import Link from "next/link";
import RecipeCard from "../RecipeCard";
import styles from "./DisplayRecipeIdeas.module.css";

/**
 * Composant : DisplayRecipeIdeas
 * Rôle : Affiche 3 recettes
 */

const DisplayRecipeIdeas = () => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const data = await fetchRandomRecipes();
        setRecipes(data);
      } catch (err) {
        console.error("Erreur lors du chargement des recettes :", err);
        setError(err.message);
      }
    };
    loadRecipes();
  }, []);

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  if (recipes.length === 0) {
    return <div>Chargement des recettes...</div>;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.recipeContainer}>
        {recipes.map(recipe => (
          <Link
            href={`/recipes/${recipe.id}`}
            key={recipe.id} // La key est bien ici
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
