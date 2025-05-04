import { useState, useEffect } from "react";
import { fetchIngredients } from "@/lib/api-ingredients";
import IngredientLowStockCard from "../elements/IngredientLowStockCard";

export default function LowStockIngredientsList() {
  const [ingredients, setIngredients] = useState([]);
  const [page, setPage] = useState(1);
  const ingredientsPerPage = 5;
  const filteredIngredients = ingredients.slice(
    (page - 1) * ingredientsPerPage,
    page * ingredientsPerPage,
  );

  useEffect(() => {
    const loadIngredients = async () => {
      const allIngredients = await fetchIngredients();
      // Filtrer les ingrédients avec une quantité de 0 ou inférieure à 1
      const lowStock = allIngredients.filter(
        ingredient => ingredient.quantité <= 0,
      );
      setIngredients(lowStock);
    };
    loadIngredients();
  }, []);

  return (
    <>
      <div>
        {filteredIngredients.map(ingredient => (
          <IngredientLowStockCard key={ingredient.id} ingredient={ingredient} />
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
