import React from "react";

export default function IngredientCard({ ingredient }) {
  let unitéAffichée = ingredient.unité;
  if (ingredient.unite_facturation === "unité" && ingredient.quantité > 1) {
    unitéAffichée = ingredient.unité + "s";
  }
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
      <p>
        {ingredient.quantité} {unitéAffichée}
      </p>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button>Edit</button>
        <button>Supprimer</button>
      </div>
    </div>
  );
}
