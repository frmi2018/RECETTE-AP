## 🧾 Documentation du composant `IngredientForm`

Ce composant React gère le formulaire de création ou de modification d’un ingrédient. Il utilise un hook personnalisé `useIngredientForm` pour la logique du formulaire, et plusieurs sous-composants pour l’affichage des champs.

## 📦 Importations

```js
import { createIngredient, updateIngredient } from "@/lib/api-ingredients";
import useIngredientForm from "@/hooks/useIngredientForm";
import styles from "./IngredientForm.module.css";
import IngredientNameField from "./IngredientNameField";
import IngredientQuantityField from "./IngredientQuantityField";
import IngredientCategoryField from "./IngredientCategoryField";
import BillingUnitSelect from "./BillingUnitSelect";
import BrandInput from "./BrandInput";
import PricePerStoreField from "./PricePerStoreField";
import { createBrand } from "@/lib/api-brands";
```

Ces lignes importent :

- Les fonctions API pour créer / mettre à jour un ingrédient et ajouter une marque.

- Le hook useIngredientForm, qui contient toute la logique du formulaire.

- Les composants du formulaire (un champ par sous-composant).

- Le fichier CSS pour le style.

## 🧠 Hook useIngredientForm

```js
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
```

Ce hook gère :

- Les valeurs du formulaire (`formData`).

- Les changements dans les champs (ex : quantité, prix, catégorie…).

- La validation des prix.

- L’affichage conditionnel (comme une catégorie personnalisée).

- Les champs prix par magasin dynamiques (ajout/suppression).

## 📤 Fonction handleSubmit (soumission du formulaire)

```js
const handleSubmit = async e => {
  e.preventDefault();
  if (!validatePrices()) {
    alert("Un ou plusieurs prix sont invalides.");
    return;
  }

  try {
    // Vérification et ajout de la marque si nouvelle
    const currentBrand = formData.marque?.trim().toUpperCase();
    if (currentBrand) {
      const brandData = await createBrand(currentBrand);
      if (brandData.added) {
        alert(`Nouvelle marque ajoutée : ${currentBrand}`);
      }
    }

    // Mise à jour ou création de l'ingrédient
    if (ingredient) {
      await updateIngredient(ingredient.id, formData);
    } else {
      const newIngredient = { ...formData, id: Date.now() };
      await createIngredient(newIngredient);
    }

    onSuccess(); // Callback après succès
  } catch (error) {
    console.error(error);
    alert("Erreur lors de la sauvegarde.");
  }
};
```

**Résumé :**

- Empêche l’envoi du formulaire si les prix sont invalides.

- Vérifie si la marque entrée est nouvelle, et la crée si besoin.

- Appelle l’API pour mettre à jour ou créer l’ingrédient.

- Utilise onSuccess() pour signaler que tout s’est bien passé.

## 🧾 Rendu JSX du formulaire

Le formulaire utilise des sous-composants spécialisés pour chaque champ.

```jsx
<form onSubmit={handleSubmit} className={styles.form}>
```

**1. Nom de l’ingrédient**

```jsx
<IngredientNameField value={formData.nom} onChange={handleChange} />
```

**2. Quantité et unité**

```jsx
<IngredientQuantityField
  quantity={formData.quantité}
  unit={formData.unité}
  onChange={handleChange}
/>
```

**3. Catégorie**

```jsx
<IngredientCategoryField
  value={formData.catégorie}
  categories={categories}
  onChange={handleChange}
/>
```

**4. Unité de facturation**

```jsx
<BillingUnitSelect value={formData.unite_facturation} onChange={handleChange} />
```

**5. Marque (avec suggestions auto)**

```jsx
<BrandInput value={formData.marque} onChange={handleChange} />
```

**6. Prix par magasin (champ dynamique)**

```jsx
<PricePerStoreField
  entries={formData.prix_par_magasin}
  onPriceChange={handlePriceChange}
  onPriceInput={handlePriceInput}
  onAdd={addStoreField}
  onRemove={removeStoreField}
  hasPriceErrors={hasPriceErrors}
/>
```

**7. Bouton de soumission**

```jsx
<button type="submit" disabled={hasPriceErrors}>
  {ingredient ? "Mettre à jour" : "Ajouter"}
</button>
```

- Le bouton est désactivé s’il y a des erreurs dans les prix.

- Le texte change selon si on crée ou modifie un ingrédient.

## ✅ Résumé du fonctionnement

| Élément            | Rôle                                                        |
| ------------------ | ----------------------------------------------------------- |
| useIngredientForm  | Gère les données et la logique du formulaire                |
| createBrand()      | Enregistre une marque si elle n'existait pas                |
| createIngredient() | Crée un nouvel ingrédient                                   |
| updateIngredient() | Met à jour un ingrédient existant                           |
| onSuccess()        | Callback de succès à la fin du traitement                   |
| Sous-composants    | Permettent une organisation propre, lisible et réutilisable |
