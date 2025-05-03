# Composants de la page `ingredients.jsx`

## 🌿 Arborescence des composants

- `pages/ingredients.jsx`
  - `components/IngredientList/IngredientList.jsx`
    - `IngredientFilters.jsx` ← filtres (texte + catégories)
    - `IngredientGrid.jsx` ← grille de cartes
      - `IngredientCard.jsx` ← carte individuelle
    - `IngredientModals.jsx` ← gestion modales
      - `AddIngredientModal.jsx`
      - `EditIngredientModal.jsx`

## 🔁 Fonctions principales et communication

- `IngredientList.jsx`

  - Gère les états (`ingredients`, `search`, `showModal`, etc.)
  - Charge les données via `fetchIngredients`
  - Passe les callbacks à `IngredientModals`

- `IngredientFilters`

  - Met à jour `search` et `categoryFilter` via props

- `IngredientCard`

  - Affiche un ingrédient
  - Appelle `setShowEditIngredientModal(true)` + `handleDelete(id)`

- `AddIngredientModal`, `EditIngredientModal`
  - Gèrent les formulaires
  - Appellent `onIngredientAdded()` ou `onIngredientUpdated()`
