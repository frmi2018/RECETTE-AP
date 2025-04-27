# PAGE INGREDIENTS.JS

Affiche la liste de tous les ingrédients.

## Structure de la page

Cette page importe le composant `IngredientList` pour afficher la liste des ingrédients.

```js
import IngredientList from "../components/IngredientList";

export default function IngredientsPage() {
  return (
    <div>
      <h1>Liste des ingrédients</h1>
      <IngredientList />
    </div>
  );
}
```

## Composant `IngredientList.js`

**Description** : Ce composant récupère les ingrédients via la fonction `fetchIngredients` et les affiche dans une liste paginée, 5 par page.

```js
import { useState, useEffect } from "react";
import { fetchIngredients } from "../modules/ingredientUtils";
import IngredientCard from "./IngredientCard";

export default function IngredientList() {
  const [ingredients, setIngredients] = useState([]);
  const [page, setPage] = useState(1);
  const ingredientsPerPage = 5;

  useEffect(() => {
    const loadIngredients = async () => {
      const allIngredients = await fetchIngredients();
      setIngredients(allIngredients);
    };
    loadIngredients();
  }, []);

  const filteredIngredients = ingredients.slice(
    (page - 1) * ingredientsPerPage,
    page * ingredientsPerPage,
  );

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        {filteredIngredients.map(ingredient => (
          <IngredientCard key={ingredient.id} ingredient={ingredient} />
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Précédent
        </button>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page * ingredientsPerPage >= ingredients.length}
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
```

## ✅ Fonctionnalités actuelles

- ✅ Affichage des ingrédients
- 📁 Importation de données mockées depuis `/data/ingredients.json`
- 🖼️ Support d’images statiques (via `public/images/ingredients`)
- 📄 Pagination 5 ingrédients par page

## 🛠️ Tests

Fichiers de configuration présents pour Jest :

- 🧪 `jest.config.js` — Configuration principale de Jest
- ⚙️ `jest.setup.js` — Setup pour les tests (ex. mocks globaux, etc.)

## 🧠 À venir

- ➕➖ Ajout/suppression d'ingrédients
- 🔍 Composant de recherche
- ↕️ Composant de tri
- 🗄️ Connexion à une base de données

---

#### 2. **Composant (Exemple : `IngredientCard.js`)**

# COMPOSANT INGREDIENTCARD.JS

Affiche un ingrédient avec son image, son nom, et sa quantité.

## Structure du composant

Ce composant reçoit un ingrédient en prop et affiche ses détails dans une carte.

```js
export default function IngredientCard({ ingredient }) {
  return (
    <div>
      <img src={ingredient.image} alt={ingredient.nom} />
      <h3>{ingredient.nom}</h3>
      <p>
        {ingredient.quantité} {ingredient.unité}
      </p>
    </div>
  );
}
```

✅ Fonctionnalités actuelles
✅ Affichage du nom et de la quantité de l'ingrédient

✅ Affichage de l'image de l'ingrédient

✅ Ajout au panier avec un bouton "Panier"

🧠 À venir
➕ Option d'édition de l'ingrédient

🔄 Support d'animation ou de transition lors du clic

---

#### 3. **API (Exemple : `ingredients.js` dans `/pages/api`)**

# API INGREDIENTS.JS

Gère les requêtes pour les ingrédients (GET, POST, PUT, DELETE).

## Structure de l'API

Cette API permet de récupérer et ajouter des ingrédients depuis `/data/ingredients.json`.

### Route GET `/api/ingredients`

Récupère la liste de tous les ingrédients.

```js
export default function handler(req, res) {
  if (req.method === "GET") {
    const ingredients = JSON.parse(fs.readFileSync(filePath, "utf8"));
    res.status(200).json(ingredients);
  }
}
```

Route POST /api/ingredients
Ajoute un nouvel ingrédient dans le fichier ingredients.json.

```js
export default function handler(req, res) {
  if (req.method === "POST") {
    const newIngredient = req.body;
    // Ajouter à `ingredients.json`
    res.status(201).json(newIngredient);
  }
}
```

✅ Fonctionnalités actuelles
✅ GET : Récupérer la liste des ingrédients

✅ POST : Ajouter un nouvel ingrédient

🧠 À venir
🔄 Support pour PUT (mettre à jour un ingrédient)

❌ Suppression d’ingrédients (DELETE)
