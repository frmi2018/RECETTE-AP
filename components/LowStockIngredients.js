import { useState, useEffect } from "react";
import { fetchIngredients } from "../modules/ingredientUtils"; // Assurez-vous que cette fonction existe

export default function LowStockIngredients() {
  const [ingredients, setIngredients] = useState([]);
  const [cart, setCart] = useState([]); // Panier de courses

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

  const addToCart = ingredient => {
    setCart(prevCart => [...prevCart, ingredient]);
    alert(`${ingredient.nom} a été ajouté au panier !`);
  };

  return (
    <div>
      <h1>Ingrédients en rupture de stock</h1>
      {ingredients.length === 0 ? (
        <p>Aucun ingrédient en rupture de stock.</p>
      ) : (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {ingredients.map(ingredient => (
            <li key={ingredient.id} style={{ marginBottom: "10px" }}>
              <div>
                <strong>{ingredient.nom}</strong> - Quantité :{" "}
                {ingredient.quantité}
              </div>
              <button onClick={() => addToCart(ingredient)}>
                Ajouter au panier
              </button>
            </li>
          ))}
        </ul>
      )}
      {cart.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h2>Panier de courses</h2>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {cart.map((item, index) => (
              <li key={index}>
                {item.nom} - Quantité : {item.quantité}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
