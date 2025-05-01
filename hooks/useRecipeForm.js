// Import des hooks React
import { useEffect, useState } from "react";

// Déclaration du hook personnalisé
export default function useIngredientForm(
  initialIngredient,
  defaultCategories,
) {
  // État principal du formulaire avec les valeurs par défaut
  const [formData, setFormData] = useState({
    nom: "",
    quantité: 0,
    quantité_a_acheter: 0,
    unité: "pièce",
    catégorie: "",
    unite_facturation: "unité",
    image: "/images/add-image.png",
    marque: "sans marque",
    prix_par_magasin: [{ magasin: "Autre", prix: 0.0 }],
  });

  // État pour stocker les erreurs de prix (par index)
  const [priceErrors, setPriceErrors] = useState({});

  // Booléen pour afficher ou non un champ de catégorie personnalisée
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  // useEffect s’exécute quand initialIngredient change
  useEffect(() => {
    if (initialIngredient) {
      // On copie les données de l'ingrédient en les normalisant
      const normalized = {
        ...initialIngredient,
        prix_par_magasin: initialIngredient.prix_par_magasin.map(entry => ({
          magasin: entry.magasin,
          prix:
            typeof entry.prix === "string"
              ? parseFloat(entry.prix)
              : entry.prix,
        })),
      };
      setFormData(normalized); // Mise à jour du formulaire avec les données existantes
    }
  }, [initialIngredient]);

  // Fonction générique pour changer un champ (ex: nom, quantité)
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes("quantité") ? Number(value) : value,
    }));
  };

  // Mise à jour d'un prix en direct depuis un input texte
  const handlePriceInput = (value, index) => {
    const cleanedValue = value.replace(",", "."); // Remplace virgule par point
    const isValid =
      /^\d*\.?\d{0,2}$/.test(cleanedValue) &&
      cleanedValue !== "" &&
      parseFloat(cleanedValue) >= 0;

    const updated = [...formData.prix_par_magasin];
    updated[index].prix = cleanedValue;

    setFormData(prev => ({ ...prev, prix_par_magasin: updated }));
    setPriceErrors(prev => ({ ...prev, [index]: !isValid }));
  };

  // Mise à jour d’un champ spécifique dans un prix (ex: magasin ou prix)
  const handlePriceChange = (index, field, value) => {
    const updated = [...formData.prix_par_magasin];
    updated[index][field] = field === "prix" ? parseFloat(value) : value;
    setFormData(prev => ({ ...prev, prix_par_magasin: updated }));
  };

  // Ajoute un nouveau champ de prix pour un magasin
  const addStoreField = () => {
    setFormData(prev => ({
      ...prev,
      prix_par_magasin: [...prev.prix_par_magasin, { magasin: "", prix: 0.0 }],
    }));
  };

  // Supprime un champ de prix à un index donné
  const removeStoreField = index => {
    const updated = [...formData.prix_par_magasin];
    updated.splice(index, 1);
    setFormData(prev => ({ ...prev, prix_par_magasin: updated }));
  };

  // Valide tous les champs de prix (format et valeur)
  const validatePrices = () => {
    let isValid = true;
    const errors = {};

    formData.prix_par_magasin.forEach((entry, index) => {
      const value = entry.prix.toString().replace(",", ".");
      const validFormat = /^\d*\.?\d{0,2}$/.test(value);
      const validNumber = !isNaN(value) && parseFloat(value) >= 0;

      if (!validFormat || !validNumber) {
        errors[index] = true;
        isValid = false;
      }
    });

    setPriceErrors(errors);
    return isValid;
  };

  // Trie les catégories par ordre alphabétique (et ajoute la catégorie en cours si manquante)
  const sortedCategories = [
    ...new Set([...defaultCategories, formData.catégorie].filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" }));

  // Vérifie s’il existe au moins une erreur de prix
  const hasPriceErrors = Object.values(priceErrors).some(Boolean);

  // Toutes les données/fonctions exposées par le hook
  return {
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
    priceErrors,
  };
}
