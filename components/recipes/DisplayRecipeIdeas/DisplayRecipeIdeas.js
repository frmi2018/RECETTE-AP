import { useState, useEffect } from "react";
import { fetchRecipes } from "@/lib/api-recipes";
import Link from "next/link";
import RecipeCard from "../RecipeCard";
import styles from "./DisplayRecipeIdeas.module.css";

export default function DisplayRecipeIdeas() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const loadRecipes = async () => {
      const allRecipes = await fetchRecipes();
      setRecipes(allRecipes);
    };
    loadRecipes();
  }, []);

  const randomRecipes = () => {
    const shuffled = [...recipes].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  if (recipes.length === 0) {
    return <div>Loading...</div>;
  } else if (recipes.length < 3) {
    return <div>Not enough recipes available.</div>;
  } else {
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
  }
}
