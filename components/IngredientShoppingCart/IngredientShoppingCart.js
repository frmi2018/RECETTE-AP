import { useState, useEffect } from "react";
import { fetchCart, saveCartItem, deleteCartItem } from "@/lib/api-cart";

export default function IngredientShoppingCard({
  ingredient,
  ingredientData,
  onDelete,
}) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCart = async () => {
      const cart = await fetchCart();
      setCart(cart);
      setLoading(false);
    };

    loadCart();
  }, []);

  const updateQuantity = async (id, delta) => {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    // ❌ Ne pas permettre de descendre en dessous de 1
    if (item.quantité_a_acheter === 1 && delta === -1) return;

    const newQuantity = item.quantité_a_acheter + delta;

    const updatedCart = cart.map(i =>
      i.id === id ? { ...i, quantité_a_acheter: newQuantity } : i,
    );
    setCart(updatedCart);

    await saveCartItem({ id, quantité_a_acheter: newQuantity });
  };

  const deleteFromCart = async id => {
    const confirmed = window.confirm(
      `Supprimer ${ingredientData.nom || "cet ingrédient"} du panier ?`,
    );
    if (!confirmed) return;

    setCart(prevCart => prevCart.filter(item => item.id !== id));
    await deleteCartItem(id);
    onDelete?.(id);
  };

  if (loading) return <div>Chargement du panier...</div>;

  const item = cart.find(i => i.id === ingredient.id);
  if (!item || !ingredientData) return null;

  return (
    <div
      style={{
        border: "1px solid #ccc",
        margin: "10px",
        padding: "10px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <img
        src={ingredientData.image}
        alt={ingredientData.nom}
        style={{
          width: "80px",
          height: "80px",
          objectFit: "cover",
          marginRight: "10px",
        }}
      />

      <div>
        <strong>{ingredientData.nom}</strong>
        <div>{ingredientData.marque || <>&nbsp;</>}</div>

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
            disabled={item.quantité_a_acheter <= 1}
          >
            -
          </button>
          <button onClick={() => deleteFromCart(item.id)}>🗑</button>
        </div>
      </div>
    </div>
  );
}
