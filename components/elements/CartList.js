import { useState, useEffect } from "react";
import { fetchCart } from "@/lib/api-cart";
import { fetchIngredient } from "@/lib/api-ingredients";
import IngredientShoppingCard from "../IngredientShoppingCart/IngredientShoppingCart";

export default function IngredientList() {
  const [ingredients, setIngredients] = useState([]);
  const [ingredientsData, setIngredientsData] = useState({});
  const [page, setPage] = useState(1);
  const ingredientsPerPage = 3;

  useEffect(() => {
    const loadIngredients = async () => {
      const cart = await fetchCart();
      setIngredients(cart);

      const detailedIngredients = await Promise.all(
        cart.map(item => fetchIngredient(item.id)),
      );

      const ingredientsMap = detailedIngredients.reduce((acc, ingredient) => {
        acc[ingredient.id] = ingredient;
        return acc;
      }, {});

      setIngredientsData(ingredientsMap);
    };

    loadIngredients();
  }, []);

  const handleDelete = id => {
    setIngredients(prev => {
      const updated = prev.filter(item => item.id !== id);

      // Si on supprime le dernier élément de la page, on recule d'une page
      const maxPage = Math.ceil(updated.length / ingredientsPerPage);
      if (page > maxPage) {
        setPage(Math.max(1, maxPage));
      }

      return updated;
    });
  };

  const filteredIngredients = ingredients.slice(
    (page - 1) * ingredientsPerPage,
    page * ingredientsPerPage,
  );

  return (
    <>
      <div>
        {ingredients.length === 0 ? (
          <div>Votre panier est vide 🛒</div>
        ) : (
          filteredIngredients.map(ingredient => (
            <IngredientShoppingCard
              key={ingredient.id}
              ingredient={ingredient}
              ingredientData={ingredientsData[ingredient.id]}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
      {ingredients.length > 0 && (
        <div>
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
      )}
    </>
  );
}
