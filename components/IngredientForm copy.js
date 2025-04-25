import { useState } from "react";
import { createIngredient } from "../modules/ingredientUtils";

export default function IngredientForm() {
  const [ingredient, setIngredient] = useState({
    nom: "",
    quantité: 0,
    unité: "",
    catégorie: "",
  });

  const handleSubmit = async e => {
    e.preventDefault();
    await createIngredient(ingredient);
    alert("Ingrédient ajouté avec succès !");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nom de l'ingrédient"
        onChange={e => setIngredient({ ...ingredient, nom: e.target.value })}
      />
      {/* Ajoutez d'autres champs pour la quantité, unité, etc. */}
      <button type="submit">Ajouter</button>
    </form>
  );
}
