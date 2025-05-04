/**
 * Composant : RecipeGrid
 * Rôle : Affiche la grille de cartes de recettes
 * Utilisé dans : RecipeList
 */
import Link from "next/link";
import RecipeCard from "../RecipeCard";
import styles from "./RecipeGrid.module.css";

export default function RecipeGrid({ items }) {
  return (
    <div className={styles.grid}>
      {items.map(recipe => (
        <Link
          key={recipe.id}
          href={`/recipes/${recipe.id}`}
          className={styles.link}
        >
          <RecipeCard recipe={recipe} />
        </Link>
      ))}
    </div>
  );
}

