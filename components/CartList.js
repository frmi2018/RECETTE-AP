import { useState, useEffect } from "react";
import { fetchCart } from "@/lib/cartUtils";
import IngredientShoppingCard from "./ingredients/IngredientShoppingCard";

export default function IngredientList() {
  const [ingredients, setIngredients] = useState([]);
  const [page, setPage] = useState(1);
  const ingredientsPerPage = 5;

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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        {filteredIngredients.map(ingredient => (
          <IngredientShoppingCard key={ingredient.id} ingredient={ingredient} />
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
    </>
  );
}
