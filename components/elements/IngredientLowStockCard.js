import { useState, useEffect } from "react";
import { fetchCart, saveCartItem } from "@/lib/cartUtils"; // 👈

export default function IngredientCard({ ingredient }) {
  const [cart, setCart] = useState([]); // Panier de courses

  // let unitéAffichée = ingredient.unité;
  // if (ingredient.unite_facturation === "unité" && ingredient.quantité > 1) {
  //   unitéAffichée = ingredient.unité + "s";
  // }

  // const addToCart = async ingredient => {
  //   setCart(prevCart => {
  //     const existingItem = prevCart.find(item => item.nom === ingredient.nom);
  //     if (existingItem) {
  //       // Mise à jour localement aussi
  //       return prevCart.map(item =>
  //         item.nom === ingredient.nom
  //           ? { ...item, quantité_a_acheter: item.quantité_a_acheter + 1 }
  //           : item,
  //       );
  //     } else {
  //       return [...prevCart, ingredient];
  //     }
  //   });
  //   await saveCartItem(ingredient);
  //   alert(`${ingredient.nom} a été ajouté au panier !`);
  // };

  const addQteToCart = async ingredient => {
    let updatedItem;
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === ingredient.id);
      if (existingItem) {
        const newCart = prevCart.map(item => {
          if (item.id === ingredient.id) {
            updatedItem = {
              ...item,
              quantité_a_acheter: item.quantité_a_acheter + 1,
            };
            return updatedItem;
          }
          return item;
        });
        return newCart;
      } else {
        updatedItem = ingredient;
        return [...prevCart, ingredient];
      }
    });

    // Attendre un petit délai pour s'assurer que `updatedItem` est bien défini
    await new Promise(resolve => setTimeout(resolve, 0));

    await fetch("/api/ingredients", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: ingredient.id,
        quantité_a_acheter: nouvelleValeur,
      }),
    });

    // await saveCartItem(updatedItem);
    alert(
      `Il y a maintenant ${updatedItem.quantité_a_acheter} ${updatedItem.nom} dans le panier !`,
    );
  };

  const subQteToCart = async ingredient => {
    if (ingredient.quantité_a_acheter <= 0) {
      // Ne rien faire si la quantité est déjà à 0
      return;
    }

    let updatedItem;

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === ingredient.id);
      if (existingItem && existingItem.quantité_a_acheter > 0) {
        const newCart = prevCart.map(item => {
          if (item.id === ingredient.id) {
            updatedItem = {
              ...item,
              quantité_a_acheter: item.quantité_a_acheter - 1,
            };
            return updatedItem;
          }
          return item;
        });
        return newCart;
      } else {
        updatedItem = ingredient;
        return [...prevCart, ingredient];
      }
    });

    await new Promise(resolve => setTimeout(resolve, 0));

    if (updatedItem) {
      await saveCartItem(updatedItem);
      alert(
        `Il y a maintenant ${updatedItem.quantité_a_acheter} ${updatedItem.nom} dans le panier !`,
      );
    }
  };

  useEffect(() => {
    const loadCart = async () => {
      const cart = await fetchCart();
      setCart(cart);
      console.log(cart);
    };
    loadCart();
  }, []);

  return (
    <div
      style={{
        textAlign: "center",
        border: "2px solid black",
        borderRadius: "5px",
        padding: "10px",
        color: "black",
      }}
    >
      <img
        src={ingredient.image}
        alt={ingredient.nom}
        style={{ width: "200px", height: "200px" }}
      />
      <h3>{ingredient.nom}</h3>
      <p>{ingredient.marque}</p>
      <div>Panier x {ingredient.quantité_a_acheter}</div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "10px",
        }}
      >
        <button onClick={() => addQteToCart(ingredient)}>Ajouter</button>
        <button
          onClick={() => subQteToCart(ingredient)}
          disabled={ingredient.quantité_a_acheter <= 0}
          style={{
            opacity: ingredient.quantité_a_acheter <= 0 ? 0.5 : 1,
            cursor:
              ingredient.quantité_a_acheter <= 0 ? "not-allowed" : "pointer",
          }}
        >
          Retirer
        </button>
        <button>Supprimer</button>
      </div>
    </div>
  );
}
