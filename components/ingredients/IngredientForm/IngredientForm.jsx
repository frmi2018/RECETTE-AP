// Importation des fonctions API pour créer ou mettre à jour un ingrédient
import { createIngredient, updateIngredient } from "@/lib/api-ingredients";

// Import du hook personnalisé pour gérer l’état et la logique du formulaire
import useIngredientForm from "@/hooks/useIngredientForm";

// Importation des styles CSS pour le formulaire
import styles from "./IngredientForm.module.css";

// Importation des sous-composants pour chaque champ du formulaire
import IngredientNameField from "./IngredientNameField";
import IngredientQuantityField from "./IngredientQuantityField";
import IngredientCategoryField from "./IngredientCategoryField";
import BillingUnitSelect from "./BillingUnitSelect";
import BrandInput from "./BrandInput";
import PricePerStoreField from "./PricePerStoreField";

// Importation de la fonction pour créer une nouvelle marque si besoin
import { createBrand } from "@/lib/api-brands";

// Composant principal qui affiche le formulaire d'ingrédient
export default function IngredientForm({ categories, ingredient, onSuccess, onCancel }) {
  // Utilisation du hook personnalisé pour gérer les champs, erreurs et interactions du formulaire
  const {
    formData,                // Toutes les valeurs actuelles du formulaire
    setFormData,             // Fonction pour modifier les valeurs
    handleChange,            // Fonction générique pour les champs texte / select
    handlePriceInput,        // Gestion du formatage et validation des prix
    handlePriceChange,       // Modification de la valeur d'un champ prix
    addStoreField,           // Ajoute un champ "prix par magasin"
    removeStoreField,        // Supprime un champ "prix par magasin"
    validatePrices,          // Vérifie si tous les prix sont valides
    sortedCategories,        // Liste des catégories triées
    hasPriceErrors,          // Booléen : y a-t-il des erreurs de prix ?
  } = useIngredientForm(ingredient, categories);

  // Fonction appelée lors de la soumission du formulaire
  const handleSubmit = async e => {
    e.preventDefault(); // Empêche le rechargement de la page

    // Vérifie les prix : si au moins un est invalide, on bloque la soumission
    if (!validatePrices()) {
      alert("Un ou plusieurs prix sont invalides.");
      return;
    }

    try {
      // On récupère la marque, en la nettoyant (majuscules, suppression des espaces)
      const currentBrand = formData.marque?.trim().toUpperCase();

      // Si une marque est fournie, on tente de l'enregistrer (même si elle existe déjà, c’est géré côté API)
      if (currentBrand) {
        const brandData = await createBrand(currentBrand);
        if (brandData.added) {
          alert(`Nouvelle marque ajoutée : ${currentBrand}`);
        }
      }

      // Si on modifie un ingrédient existant
      if (ingredient) {
        await updateIngredient(ingredient.id, formData);
      } else {
        // Sinon, on crée un nouvel ingrédient avec un id temporaire
        const newIngredient = { ...formData, id: Date.now() };
        await createIngredient(newIngredient);
      }

      // Callback pour signaler que tout s'est bien passé (mise à jour de la liste, navigation, etc.)
      onSuccess();
    } catch (error) {
      // Gestion des erreurs réseau ou serveur
      console.error(error);
      alert("Erreur lors de la sauvegarde.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* Champ : nom de l'ingrédient */}
      <IngredientNameField value={formData.nom} onChange={handleChange} />

      {/* Champs : quantité et unité */}
      <IngredientQuantityField
        quantity={formData.quantité}
        unit={formData.unité}
        onChange={handleChange}
      />

      {/* Champ : catégorie (menu déroulant + option personnalisée) */}
      <IngredientCategoryField
        value={formData.catégorie}
        categories={sortedCategories}
        onChange={handleChange}
      />

      {/* Champ : unité de facturation */}
      <div className={`${styles["col-full"]} ${styles["form-field"]}`}>
        <BillingUnitSelect
          value={formData.unite_facturation}
          onChange={handleChange}
        />
      </div>

      {/* Champ : marque (avec suggestions automatiques) */}
      <div className={`${styles["col-full"]} ${styles["form-field"]}`}>
        <BrandInput value={formData.marque} onChange={handleChange} />
      </div>

      {/* Champ : prix par magasin (ajout/suppression dynamique) */}
      <PricePerStoreField
        entries={formData.prix_par_magasin}
        onPriceChange={handlePriceChange}
        onPriceInput={handlePriceInput}
        onAdd={addStoreField}
        onRemove={removeStoreField}
        hasPriceErrors={hasPriceErrors}
      />

      {/* Bouton de soumission, désactivé si des prix sont invalides */}
      <button type="submit" className={styles["col-full"]} disabled={hasPriceErrors}>
        {ingredient ? "Mettre à jour" : "Ajouter"}
      </button>
    </form>
  );
}
