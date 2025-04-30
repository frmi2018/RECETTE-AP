import { useState, useEffect } from "react";
import { createIngredient, updateIngredient } from "@/lib/api-ingredients";
import styles from "./IngredientForm.module.css";

export default function IngredientForm({
  categories,
  ingredient,
  onSuccess,
  onCancel,
}) {
  const [formData, setFormData] = useState({
    nom: "",
    quantité: 0,
    quantité_a_acheter: 0,
    unité: "pièce",
    catégorie: "",
    unite_facturation: "unité",
    image: "/images/add-image.png",
    marque: "sans marque",
    prix_par_magasin: [],
  });

  // Dans ton composant :
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  // Fusionner et trier les catégories à afficher
  const allOptions = [...categories];
  if (formData.catégorie && !allOptions.includes(formData.catégorie)) {
    allOptions.push(formData.catégorie);
  }

  const [priceErrors, setPriceErrors] = useState({}); // index → true/false

  const handlePriceInput = (value, index) => {
    const cleanedValue = value.replace(",", ".");
    const isValid =
      /^\d*\.?\d{0,2}$/.test(cleanedValue) &&
      cleanedValue !== "" &&
      parseFloat(cleanedValue) >= 0;

    // Convertir en nombre si valide, sinon conserver tel quel
    const numericValue = parseFloat(cleanedValue);

    // Met à jour le champ
    handlePriceChange(index, "prix", isValid ? numericValue : cleanedValue);

    // Met à jour l'erreur
    setPriceErrors(prev => ({ ...prev, [index]: !isValid }));
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

  const sortedOptions = [...new Set(allOptions)] // évite les doublons
    .sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" }));

  useEffect(() => {
    if (ingredient) {
      // Normaliser les prix en tant que nombres si ce sont des chaînes
      const normalizedIngredient = {
        ...ingredient,
        prix_par_magasin: ingredient.prix_par_magasin.map(entry => ({
          ...entry,
          prix:
            typeof entry.prix === "string"
              ? parseFloat(entry.prix)
              : entry.prix,
        })),
      };

      setFormData(normalizedIngredient);
    } else {
      setFormData(prev => ({
        ...prev,
        prix_par_magasin: [{ magasin: "Autre", prix: 0.0 }],
      }));
    }
  }, [ingredient]);

  useEffect(() => {
    // Nettoie les erreurs automatiquement si les prix sont tous valides
    validatePrices();
  }, [formData.prix_par_magasin]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes("quantité") ? Number(value) : value,
    }));
  };

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
      alert("Erreur lors de la sauvegarde");
      console.error(error);
    }
  };

  const handlePriceChange = (index, field, value) => {
    const updated = [...formData.prix_par_magasin];
    updated[index][field] = value;

    setFormData(prev => ({
      ...prev,
      prix_par_magasin: updated,
    }));
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
    setFormData(prev => ({
      ...prev,
      prix_par_magasin: updated,
    }));
  };

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const hasPriceErrors = Object.values(priceErrors).some(Boolean);

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/*Nom de l'ingrédient*/}
      <div className={`${styles["col-full"]} ${styles["form-field"]}`}>
        <span>Nom</span>
        <input
          className={styles["col-3"]}
          name="nom"
          placeholder="Nom"
          value={formData.nom}
          onChange={handleChange}
          required
        />
      </div>
      {/*Quantité*/}
      <div className={`${styles["col-full"]} ${styles["form-field"]}`}>
        <div className={styles["col-2"]}>
          <span>Qté</span>
          <input
            name="quantité"
            type="number"
            value={formData.quantité}
            onChange={handleChange}
          />
        </div>
        {/*Unité: kilo, litre, ml, pièce, verre...*/}
        <div className={styles["col-2"]}>
          <span>Unité</span>
          <input
            name="unité"
            placeholder="Unité"
            value={formData.unité}
            onChange={handleChange}
          />
        </div>
      </div>
      {/*Catégorie: viandes, pâtes, légumes...*/}
      <div className={`${styles["col-full"]} ${styles["form-field"]}`}>
        <span>Catégorie</span>
        {!showCustomCategory ? (
          <select
            name="catégorie"
            value={formData.catégorie}
            onChange={e => {
              if (e.target.value === "__autre__") {
                setShowCustomCategory(true);
              } else {
                handleChange(e);
              }
            }}
          >
            {/* Placeholder si aucune valeur sélectionnée */}
            {!formData.catégorie && (
              <option value="">Sélectionner une catégorie</option>
            )}

            {/* Afficher la valeur sélectionnée (mais pas dans la liste) */}
            {formData.catégorie && (
              <option value={formData.catégorie}>
                {capitalize(formData.catégorie)}
              </option>
            )}

            {/* Liste des catégories, sans la valeur actuellement sélectionnée */}
            {[...new Set(categories)]
              .filter(
                cat => cat && cat !== formData.catégorie && cat !== "__autre__",
              )
              .sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" }))
              .map(cat => (
                <option key={cat} value={cat}>
                  {capitalize(cat)}
                </option>
              ))}

            <option value="__autre__">➕ Autre...</option>
          </select>
        ) : (
          <div>
            <input
              type="text"
              name="catégorie"
              placeholder="Entrer une nouvelle catégorie"
              value={formData.catégorie}
              onChange={handleChange}
              onBlur={() => {
                if (formData.catégorie.trim()) {
                  setShowCustomCategory(false);
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                setShowCustomCategory(false);
                handleChange({ target: { name: "catégorie", value: "" } });
              }}
            >
              Annuler
            </button>
          </div>
        )}
      </div>
      {/*Unité de facturation: kilo, litre, pièce*/}
      <div className={`${styles["col-full"]} ${styles["form-field"]}`}>
        <span>Unité de facturation</span>
        <select
          name="unite_facturation"
          value={formData.unite_facturation}
          onChange={handleChange}
        >
          {/* Option actuellement sélectionnée */}
          {formData.unite_facturation && (
            <option value={formData.unite_facturation}>
              {formData.unite_facturation === "unité"
                ? "Unité"
                : formData.unite_facturation === "poids"
                ? "Poids"
                : "Volume"}
            </option>
          )}

          {/* Option par défaut si rien n'est sélectionné */}
          {!formData.unite_facturation && (
            <option value="">Sélectionner une unité</option>
          )}

          {/* Autres options filtrées dynamiquement */}
          {["unité", "poids", "volume"]
            .filter(option => option !== formData.unite_facturation)
            .map(option => (
              <option key={option} value={option}>
                {option === "unité"
                  ? "Unité"
                  : option === "poids"
                  ? "Poids"
                  : "Volume"}
              </option>
            ))}
        </select>
      </div>
      {/*Marque*/}
      <div className={`${styles["col-full"]} ${styles["form-field"]}`}>
        <span>Marque</span>
        <input
          className={styles["col-full"]}
          name="marque"
          placeholder="Marque"
          value={formData.marque}
          onChange={handleChange}
        />
      </div>
      {/*Prix*/}
      <div className={styles["col-full"]}>
        <h4 className={`${styles["col-full"]} ${styles["text-center"]}`}>
          Prix par magasin
        </h4>
        {formData.prix_par_magasin.map((entry, index) => (
          <div key={index} className={styles["col-full"]}>
            {/*Nom du magasin*/}
            <div className={`${styles["col-full"]} ${styles["form-field"]}`}>
              <span>Nom</span>
              <input
                type="text"
                placeholder="Nom du magasin"
                value={entry.magasin}
                onChange={e =>
                  handlePriceChange(index, "magasin", e.target.value)
                }
                required
              />
            </div>
            {/*Prix de vente*/}
            <div className={`${styles["col-full"]} ${styles["form-field"]}`}>
              <span>Prix</span>
              <div className={styles["price-input-group"]}>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="Prix"
                  value={entry.prix}
                  onChange={e => handlePriceInput(e.target.value, index)}
                  required
                  className={priceErrors[index] ? styles["input-error"] : ""}
                />
                <span>€</span>
              </div>
              {priceErrors[index] && (
                <div className={styles["error-text"]}>
                  Prix invalide (ex : 2.50)
                </div>
              )}
            </div>
            {/* Bouton supprimer un magasin si > 1 */}
            {formData.prix_par_magasin.length > 1 ? (
              <button type="button" onClick={() => removeStoreField(index)}>
                🗑
              </button>
            ) : (
              <span>{""}</span>
            )}
          </div>
        ))}
        <div className={`${styles["col-full"]} ${styles["text-center"]}`}>
          <button type="button" onClick={addStoreField}>
            ➕ Ajouter un magasin
          </button>
        </div>
      </div>

      <button
        type="submit"
        className={styles["col-full"]}
        disabled={hasPriceErrors}
      >
        {ingredient ? "Mettre à jour" : "Ajouter"}
      </button>
      {ingredient && (
        <button type="button" onClick={onCancel} className={styles["col-full"]}>
          Annuler
        </button>
      )}

      <div className={`${styles["col-full"]} ${styles["text-center"]}`}>
        ID:{formData.id}
      </div>
    </form>
  );
}
