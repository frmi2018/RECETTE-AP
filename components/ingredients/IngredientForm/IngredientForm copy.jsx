import { useState, useEffect } from "react";
// import API du formulaire
import { createIngredient, updateIngredient } from "@/lib/api-ingredients";
// import de la logique du formulaire
import useIngredientForm from "@/hooks/useIngredientForm";
// import du style du formulaire
import styles from "./IngredientForm.module.css";
// import des sous-composants du formulaire
import IngredientNameField from "./IngredientNameField";
import IngredientQuantityField from "./IngredientQuantityField";
import IngredientCategoryField from "./IngredientCategoryField";
import BillingUnitSelect from "./BillingUnitSelect";
import BrandInput from "./BrandInput";
import PricePerStoreField from "./PricePerStoreField";


export default function IngredientForm({ categories, ingredient, onSuccess, onCancel }) {
  const {
    formData,
    setFormData,
    handleChange,
    handlePriceInput,
    handlePriceChange,
    addStoreField,
    removeStoreField,
    validatePrices,
    sortedCategories,
    showCustomCategory,
    setShowCustomCategory,
    hasPriceErrors,
  } = useIngredientForm(ingredient, categories);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validatePrices()) {
      alert("Un ou plusieurs prix sont invalides.");
      return;
    }

    try {
      if (ingredient) {
        await updateIngredient(ingredient.id, formData);
      } else {
        const newIngredient = { ...formData, id: Date.now() };
        await createIngredient(newIngredient);
      }
      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la sauvegarde.");
    }
  };

   return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* Nom */}
      <IngredientNameField value={formData.nom} onChange={handleChange} />

      {/* Quantité & Unité */}
      <IngredientQuantityField
  quantity={formData.quantité}
  unit={formData.unité}
  onChange={handleChange}
/>

      {/* Catégorie */}
      <IngredientCategoryField
  value={formData.catégorie}
  categories={categories}
  onChange={handleChange}
/>

      {/* Unité de facturation */}
      <div className={`${styles["col-full"]} ${styles["form-field"]}`}>
  <BillingUnitSelect
    value={formData.unite_facturation}
    onChange={handleChange}
  />
</div>


      {/* Marque */}
      <div className={`${styles["col-full"]} ${styles["form-field"]}`}>
  <BrandInput value={formData.marque} onChange={handleChange} />
</div>

<PricePerStoreField
  entries={formData.prix_par_magasin}
  onPriceChange={handlePriceChange}
  onPriceInput={handlePriceInput}
  onAdd={addStoreField}
  onRemove={removeStoreField}
  hasPriceErrors={hasPriceErrors} // Utilisation de `hasPriceErrors` à la place de `priceErrors`
/>





      {/* Boutons */}
      <button type="submit" className={styles["col-full"]} disabled={hasPriceErrors}>
        {ingredient ? "Mettre à jour" : "Ajouter"}
      </button>
      {ingredient && (
        <button type="button" onClick={onCancel} className={styles["col-full"]}>
          Annuler
        </button>
      )}
    </form>
  );
}
