import { useEffect, useState } from "react";
import styles from "./RecipeList.module.css";
import Link from "next/link";
import { fetchRecipes } from "@/lib/api-recipes";
import RecipeCard from "../../elements/RecipeCard";
import AddRecipeModal from "../AddRecipeModal/AddRecipeModal";

export default function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const itemsPerPage = 3;
  const [showModal, setShowModal] = useState(false);

  const loadRecipes = async () => {
    try {
      const data = await fetchRecipes();
      setRecipes(data);
      // Extraire les types uniques depuis les recettes
      const allTypes = Array.from(
        new Set(data.map(item => item.types).filter(Boolean)),
      ).sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" }));
      setTypes(allTypes);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  const filteredItems = recipes
    .filter(item => item.nom.toLowerCase().includes(search.toLowerCase()))
    .filter(item => (typeFilter === "all" ? true : item.type === typeFilter))
    .sort((a, b) => a.nom.localeCompare(b.nom, "fr", { sensitivity: "base" }));

  const paginatedItems = filteredItems.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  const onClose = () => {
    const confirmClose = window.confirm(
      "Êtes-vous sûr de vouloir fermer sans sauvegarder ? Les modifications ne seront pas enregistrées.",
    );
    if (confirmClose) {
      setShowModal(false);
    }
  };

  const handleRecipeAdded = () => {
    // recharge les données si besoin
    console.log("Recette ajoutée !");
  };

  const uniqueTypes = ["all", ...new Set(recipes.map(i => i.type))];

  return (
    <div className={styles.container}>
      <button onClick={() => setShowModal(true)}>Ajouter une recette</button>
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="🔍 Rechercher une recette"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
        >
          {uniqueTypes.map(typ => (
            <option key={typ} value={typ}>
              {typ === "all" ? "Toutes les types" : typ}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.grid}>
          {paginatedItems.map(recipe => {
            return (
              <Link
                key={recipe.id}
                href={`/recipes/${recipe.id}`}
                className={styles.link}
              >
                <RecipeCard recipe={recipe}></RecipeCard>
              </Link>
            );
          })}
        </div>
      </div>

      <div className={styles.pagination}>
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Précédent
        </button>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page * itemsPerPage >= filteredItems.length}
        >
          Suivant
        </button>
      </div>

      {showModal && (
        <AddRecipeModal
          onClose={onClose} // ← Gère la fermeture
          onRecipeAdded={handleRecipeAdded}
        />
      )}
    </div>
  );
}
