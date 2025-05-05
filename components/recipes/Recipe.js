/**
 * Composant : Recipe
 * Rôle : Affiche une recette contenu dans le fichier recipe.json
 * Utilisé dans : recipes\[id]
 */
//
// extrait objet recipe.json
// {
//   "id": 10,
//   "etapes": [
//     "Préchauffer le four à 180°C.",
//     "Faire fondre le chocolat et le beurre.",
//     "Mélanger avec le sucre, les œufs et la farine.",
//     "Verser dans un moule et cuire pendant 25 minutes."
//   ],
// }
//
// Appel la méthode fetchRecipe du fichier @/lib/api-recipes
// export const fetchRecipe = async id => {
//   const response = await fetch(`${API_BASE_URL}/${id}`);
//   if (!response.ok) {
//     throw new Error(
//       `Erreur lors de la récupération de la recette avec id ${id}`,
//     );
//   }
//   return await response.json();
// };
//
// fetchRecipe utilise le méthode GET du fichier pages/api/recipes/[id]
// pour importer les données de la recette du fichier /data/recipes.json
//
// if (method === "GET") {
//   try {
//     const fileContent = fs.readFileSync(filePath, "utf8");
//     const recipes = JSON.parse(fileContent);

//     const recipe = recipes.find(r => r.id === parseInt(id));
//     if (!recipe) {
//       return res
//         .status(404)
//         .json({ message: `Recette avec id ${id} introuvable` });
//     }

//     res.status(200).json(recipe);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Erreur lors de la récupération de la recette" });
//   }
// }

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { fetchRecipe } from "../../lib/api-recipes";
import { fetchIngredients } from "../../lib/api-ingredients";
import EditEtapes from "./EditEtapes/EditEtapes";
import RecipeIngredients from "./RecipeIngredients/RecipeIngredients";
import styles from "./Recipe.module.css";

export default function Recipe() {
  const router = useRouter();
  const { id } = router.query;
  const recipeId = parseInt(id, 10);
  const [recipe, setRecipe] = useState(null);
  const [ingredientRecipe, setIngredientRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showIngredients, setShowIngredients] = useState(true);

  // 🔧 Définie en dehors du useEffect pour pouvoir être réutilisée
  const loadData = async () => {
    try {
      console.log(id);
      const recipeData = await fetchRecipe(id);
      setRecipe(recipeData);
      const ingredientData = await fetchIngredients();
      setIngredientRecipe(ingredientData);
    } catch (error) {
      console.error("Erreur de chargement :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id || isNaN(parseInt(id, 10))) return;
    loadData();
  }, [id]);

  if (loading) return <p>Chargement...</p>;
  if (!recipe) return <p>Recette introuvable.</p>;

  return (
    <div className={styles.recipeContainer}>
      <h2 style={{ textAlign: "center" }}>{recipe.nom}</h2>

      <div className={styles.switchButtons}>
        <button
          onClick={() => setShowIngredients(true)}
          disabled={showIngredients}
          className={`${styles.switchButton} ${
            showIngredients ? styles.switchButtonActive : ""
          }`}
        >
          Ingrédients
        </button>
        <button
          onClick={() => setShowIngredients(false)}
          disabled={!showIngredients}
          className={`${styles.switchButton} ${
            !showIngredients ? styles.switchButtonActive : ""
          }`}
        >
          Étapes
        </button>
      </div>

      {showIngredients ? (
        <RecipeIngredients
          ingredients={recipe.ingrédients}
          recipeId={recipeId}
          onUpdate={loadData} // ✅ maintenant ça fonctionne
        />
      ) : (
        <EditEtapes
          initialEtapes={recipe.etapes}
          recipeId={recipeId}
          onUpdate={loadData} // ✅ maintenant ça fonctionne
        />
      )}
    </div>
  );
}
