import { useState } from "react";
import { createRecipe } from "../modules/recipeUtils";

export default function RecipeForm() {
  const [recipe, setRecipe] = useState({
    nom: "",
    ingrédients: [],
    instructions: "",
    temps_préparation: 0,
    temps_cuisson: 0,
    portions: 0,
  });

  const handleSubmit = async e => {
    e.preventDefault();
    await createRecipe(recipe);
    alert("Recette ajoutée avec succès !");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nom de la recette"
        onChange={e => setRecipe({ ...recipe, nom: e.target.value })}
      />
      {/* Ajoutez d'autres champs pour les ingrédients, instructions, etc. */}
      <button type="submit">Ajouter</button>
    </form>
  );
}
