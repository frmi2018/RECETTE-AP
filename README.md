
# 🍲 RECETTE-APP

Application Next.js pour gérer des recettes de cuisine et les ingrédients associés, avec fonctionnalités d'édition, de pagination, et d'affichage dynamique.

---

## 📁 Structure du projet

app/ api/ # Routes API pour recettes et ingrédients cooking-recipe.js ingredients.js

components/ # Composants UI (ex: à venir : Pagination, IngredientList, etc.) layout.js # Layout principal

data/ cooking-recipe.json # Données mockées pour les recettes ingredients.json # Données mockées pour les ingrédients

pages/ edit-ingredient/ # Pages pour modifier un ingrédient [id].js

edit-recipe/ # Pages pour modifier une recette [id].js

cooking-recipe.js # Page de liste des recettes index.js # Page d'accueil ingredients-low.js # Version allégée des ingrédients ingredients.js # Liste complète des ingrédients

public/ images/ # Dossier pour les images statiques add-image.png

styles/ globals.css # Styles globaux

## 🔄 Pagination (logique DRY)

### ✅ Hook à créer : `usePagination.js`

Un hook réutilisable qui gère la pagination d'une liste. Il sera placé dans `app/hooks/usePagination.js`.

```js
// app/hooks/usePagination.js
import { useState, useMemo } from 'react';

export function usePagination(items, itemsPerPage) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(() => {
    return Math.ceil(items.length / itemsPerPage);
  }, [items.length, itemsPerPage]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = currentPage * itemsPerPage;
    return items.slice(start, end);
  }, [items, currentPage, itemsPerPage]);

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return {
    currentPage,
    totalPages,
    paginatedItems,
    goToNextPage,
    goToPreviousPage,
    setCurrentPage,
  };
}
```
## 📄 Exemple d'utilisation dans ingredients.js
```js
Copier
Modifier
import { usePagination } from '@/app/hooks/usePagination';

const itemsPerPage = 10;
const {
  currentPage,
  totalPages,
  paginatedItems,
  goToNextPage,
  goToPreviousPage
} = usePagination(filteredIngredients, itemsPerPage);
```
## ✅ Fonctionnalités actuelles
- ✅ Affichage des ingrédients
- ✅ Affichage des recettes
- ✏️ Édition des ingrédients et recettes via pages dynamiques
- 📁 Importation de données mockées depuis JSON
- 🖼️ Support d’images statiques (via `public/images`)
- 🔄 Pagination en cours de mutualisation

## 🚀 Lancer le projet localement
``` bash
npm install
npm run dev
```
L'application sera disponible sur http://localhost:3000.

## 🛠️ Tests
Fichiers de configuration présents pour Jest :

- 🧪 `jest.config.js` — Configuration principale de Jest
- ⚙️ `jest.setup.js` — Setup pour les tests (ex. mocks globaux, etc.)

## 🧠 À venir
- 🔍 Composant de recherche
- ↕️ Tri des ingrédients
- 📄 Composant `Pagination` visuel
- ➕➖ Ajout/suppression d'ingrédients/recettes
- 🗄️ Connexion à une base de données

## ✍️ Auteur
Projet développé par Franck Michaud.
Ce projet a pour objectif d’expérimenter les fonctionnalités de Next.js : pages dynamiques, routes API, hooks personnalisés, etc., le tout enrichi avec l’assistance de GitHub Copilot.