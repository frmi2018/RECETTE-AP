import { useState, useEffect } from "react";
import { fetchCart, saveCartItem, deleteCartItem } from "@/lib/api-cart";
import { fetchIngredient } from "@/lib/api-ingredients";

export default function IngredientShoppingCard() {
  const [cart, setCart] = useState([]);
  const [ingredientsData, setIngredientsData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCart = async () => {
      const cart = await fetchCart();
      setCart(cart);

      const ingredients = await Promise.all(
        cart.map(item => fetchIngredient(item.id)),
      );

      const ingredientsMap = ingredients.reduce((acc, ingredient) => {
        acc[ingredient.id] = ingredient;
        return acc;
      }, {});

      setIngredientsData(ingredientsMap);
      setLoading(false);
    };

    loadCart();
  }, []);

  const updateQuantity = async (id, delta) => {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    const newQuantity = item.quantité_a_acheter + delta;
    if (newQuantity < 0) return;

    const updatedCart = cart.map(i =>
      i.id === id ? { ...i, quantité_a_acheter: newQuantity } : i,
    );
    setCart(updatedCart);

    await saveCartItem({ id, quantité_a_acheter: newQuantity });
  };

  const deleteFromCart = async id => {
    const ingredient = ingredientsData[id];
    const confirmed = window.confirm(
      `Supprimer ${ingredient?.nom || "cet ingrédient"} du panier ?`,
    );
    if (!confirmed) return;

    setCart(prevCart => prevCart.filter(item => item.id !== id));
    await deleteCartItem(id);
  };

  if (loading) return <div>Chargement du panier...</div>;

  if (cart.length === 0) {
    return <div>Votre panier est vide 🛒</div>;
  }

  return (
    <div>
      {cart.map(item => {
        const ingredient = ingredientsData[item.id];

        if (!ingredient) {
          return <div key={item.id}>Chargement...</div>;
        }

        return (
          <div
            key={ingredient.id}
            style={{
              border: "1px solid #ccc",
              margin: "10px",
              padding: "10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <img
              src={ingredient.image}
              alt={ingredient.nom}
              style={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
                marginRight: "10px",
              }}
            />

            <div>
              <strong>{ingredient.nom}</strong>
              <div>{ingredient.marque || <>&nbsp;</>}</div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  marginTop: "5px",
                }}
              >
                <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                <span>{item.quantité_a_acheter}</span>
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  disabled={item.quantité_a_acheter <= 0}
                >
                  -
                </button>
                <button onClick={() => deleteFromCart(item.id)}>🗑</button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
