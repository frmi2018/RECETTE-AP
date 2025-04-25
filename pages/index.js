import React from "react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Application de recettes</h1>
      <nav>
        <ul
          style={{
            listStyleType: "none",
            padding: 0,
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <li>
            <Link href="/add-recipe">Ajouter une recette</Link>
          </li>
          <li>
            <Link href="/add-ingredient">Ajouter un ingrédient</Link>
          </li>
          <li>
            <Link href="/recipes">Voir toutes les recettes</Link>
          </li>
          <li>
            <Link href="/ingredients">Voir tous les ingrédients</Link>
          </li>
          <li>
            <Link href="/low-stock-ingredients">
              Ingrédients en rupture de stock
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
