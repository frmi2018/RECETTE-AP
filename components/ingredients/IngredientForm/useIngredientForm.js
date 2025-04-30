import { useEffect, useState } from "react";

export default function useIngredientForm(
  initialIngredient,
  defaultCategories,
) {
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

  const [priceErrors, setPriceErrors] = useState({});
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  // Initialisation
  useEffect(() => {
    if (initialIngredient) {
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
      setFormData(normalized);
    }
  }, [initialIngredient]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes("quantité") ? Number(value) : value,
    }));
  };

  const handlePriceInput = (value, index) => {
    const cleanedValue = value.replace(",", ".");
    const isValid =
      /^\d*\.?\d{0,2}$/.test(cleanedValue) &&
      cleanedValue !== "" &&
      parseFloat(cleanedValue) >= 0;

    const updated = [...formData.prix_par_magasin];
    updated[index].prix = cleanedValue;
    setFormData(prev => ({ ...prev, prix_par_magasin: updated }));
    setPriceErrors(prev => ({ ...prev, [index]: !isValid }));
  };

  const handlePriceChange = (index, field, value) => {
    const updated = [...formData.prix_par_magasin];
    updated[index][field] = field === "prix" ? parseFloat(value) : value;
    setFormData(prev => ({ ...prev, prix_par_magasin: updated }));
  };

  const addStoreField = () => {
    setFormData(prev => ({
      ...prev,
      prix_par_magasin: [...prev.prix_par_magasin, { magasin: "", prix: 0.0 }],
    }));
  };

  const removeStoreField = index => {
    const updated = [...formData.prix_par_magasin];
    updated.splice(index, 1);
    setFormData(prev => ({ ...prev, prix_par_magasin: updated }));
  };

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

  const sortedCategories = [
    ...new Set([...defaultCategories, formData.catégorie].filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" }));

  const hasPriceErrors = Object.values(priceErrors).some(Boolean);

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
