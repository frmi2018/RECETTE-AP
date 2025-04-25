// pages/recipes/[id].js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Recipe() {
  const router = useRouter();
  const { id } = router.query;
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    if (!id) return; // Assure que l'id est présent

    const fetchRecipe = async () => {
      try {
        const response = await fetch("/api/recipes.json");
        const data = await response.json();
        const selectedRecipe = data.find(r => r.id === parseInt(id));
        setRecipe(selectedRecipe);
      } catch (error) {
        console.error("Erreur lors du chargement de la recette :", error);
      }
    };

    fetchRecipe();
  }, [id]);

  if (!recipe) {
    return <p>Chargement...</p>;
  }

  return (
    <div>
      <h3>{recipe.nom}</h3>
      <p>{recipe.instructions}</p>
    </div>
  );
}
