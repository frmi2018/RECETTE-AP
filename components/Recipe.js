import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { fetchRecipe } from "../modules/recipeUtils";

export default function Recipe() {
  const router = useRouter();
  const { id } = router.query;
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const loadRecipe = async () => {
      try {
        const data = await fetchRecipe(id);
        setRecipe(data);
      } catch (error) {
        console.error("Erreur de chargement :", error);
      } finally {
        setLoading(false);
      }
    };

    loadRecipe();
  }, [id]);

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (!recipe) {
    return <p>Recette introuvable.</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>{recipe.nom}</h2>
      <p>{recipe.instructions}</p>
    </div>
  );
}
