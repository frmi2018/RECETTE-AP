import { useState, useEffect } from "react";
import { fetchCart } from "@/lib/api-cart";
import IngredientShoppingCard from "../IngredientShoppingCart/IngredientShoppingCart";

export default function IngredientList() {
  const [ingredients, setIngredients] = useState([]);
  const [page, setPage] = useState(1);
  const ingredientsPerPage = 3;

  useEffect(() => {
    const loadIngredients = async () => {
      const allIngredients = await fetchCart();
      setIngredients(allIngredients);
    };
    loadIngredients();
  }, []);

  const filteredIngredients = ingredients.slice(
    (page - 1) * ingredientsPerPage,
    page * ingredientsPerPage,
  );

  return (
    <>
      <div>
        {filteredIngredients.map(ingredient => (
          <IngredientShoppingCard key={ingredient.id} ingredient={ingredient} />
        ))}
      </div>
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
    </>
  );
}
