import { useState } from "react";
import { updateRecipe } from "@/lib/api-recipes";
import styles from ".././Form.module.css";

export default function UpdateIngredientInRecipeForm({
  editedIngredient: initialIngredient,
  recipeId,
  ingredients,
  onClose,
  onCancel,
  onIngredientUpdate
}) {
  const [editedIngredient, setEditedIngredient] = useState(() => ({
    ...initialIngredient,
    quantité: String(initialIngredient.quantité ?? ''),
    unité: initialIngredient.unité ?? ''
  }));
  
  
  const [error, setError] = useState(null); // ← pour afficher une erreur

  function validateQuantity(input) {
    const value = String(input).trim().replace(',', '.');

    const validNumberPattern = /^\d+(\.\d+)?$/;
  
    if (!validNumberPattern.test(value)) {
      return { error: "Veuillez saisir un nombre valide (ex : 1, 2.5, 0.75)." };
    }
  
    const parsed = parseFloat(value);
    if (isNaN(parsed) || parsed <= 0) {
      return { error: "La quantité doit être un nombre strictement positif." };
    }
  
    return { value: parsed };
  }
  


  const handleSave = async () => {
    const { value: parsedQuantity, error: validationError } = validateQuantity(editedIngredient.quantité);
    if (validationError) {
      setError(validationError);
      return;
    }
    

    let unitValue = editedIngredient.unité?.trim();
if (!unitValue) {
  unitValue = "";
}

  
    try {
      const updatedIngredients = ingredients.map(i =>
        i.id === editedIngredient.id
          ? { ...i, quantité: parsedQuantity, unité: unitValue }
          : i
      );
      
  
      await updateRecipe(recipeId, { ingrédients: updatedIngredients });
      onIngredientUpdate && onIngredientUpdate();
      alert("Modifications enregistrées !");
      onClose && onClose();

    } catch (err) {
      console.error("Erreur modification ingrédient :", err);
      alert("Échec de la modification.");
    }
  };
  

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
      <button type="button" onClick={onCancel}>Annuler</button>
        <h3>Modifier l'ingrédient</h3>

        <label htmlFor="ingredient-nom">
          Nom :
          <input
          id="ingredient-nom"
            type="text"
            value={editedIngredient.nom}
            disabled
          />
        </label>

        <label htmlFor="ingredient-photo">
          Photo (URL) :
          <input
          id="ingredient-photo"
            type="text"
            value={editedIngredient.image}
            disabled
          />
        </label>
        <label htmlFor="ingredient-quantité">
  Quantité :
  <input
  id="ingredient-quantité"
    type="text"
    value={editedIngredient.quantité}
    onChange={e => {
      const raw = e.target.value;
      const validInput = raw.replace(/[^0-9.,]/g, '');
      setEditedIngredient({ ...editedIngredient, quantité: validInput });
      setError(null);
    }}
    
  />
</label>



        <label htmlFor="ingredient-unité">
          Unité :
          <input
            id="ingredient-unité"
            type="text"
            value={editedIngredient.unité}
            onChange={e => setEditedIngredient({ ...editedIngredient, unité: e.target.value })}
          />
        </label>

        {error && <p className={styles.error}>{error}</p>}


          <button onClick={handleSave}>Enregistrer</button>


      </div>
    </div>
  );
}
