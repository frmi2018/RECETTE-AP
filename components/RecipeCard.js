import React from "react";

export default function RecipeCard({ recipe }) {
  return (
    <div
      style={{
        textAlign: "center",
        border: "2px solid black",
        borderRadius: "5px",
        padding: "10px",
        cursor: "pointer",
      }}
    >
      <img
        src={recipe.image}
        alt={recipe.nom}
        style={{ width: "200px", height: "200px" }}
      />
      <h3>{recipe.nom}</h3>
    </div>
  );
}
