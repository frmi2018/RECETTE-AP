import { useState, useEffect } from "react";
import { fetchIngredients } from "../modules/ingredientUtils"; // Importez la fonction correcte

export default function IngredientList() {
  const [ingredients, setIngredients] = useState([]);
  const [page, setPage] = useState(1);
  const ingredientsPerPage = 5;

  useEffect(() => {
    const loadIngredients = async () => {
      const allIngredients = await fetchIngredients(); // Utilisez fetchIngredients
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
      {filteredIngredients.map(ingredient => (
        <div key={ingredient.id}>
          <h3>{ingredient.nom}</h3>
          <p>Quantité : {ingredient.quantité || "Non spécifiée"}</p>
        </div>
      ))}
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
  );
}
