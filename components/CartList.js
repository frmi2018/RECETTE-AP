import React from "react";

export default function IngredientCard({ ingredient }) {
  let unitéAffichée = ingredient.unité;
  if (ingredient.unite_facturation === "unité" && ingredient.quantité > 1) {
    unitéAffichée = ingredient.unité + "s";
  }
  return (
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
  );
}
