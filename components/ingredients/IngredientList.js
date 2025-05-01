import { useEffect, useState } from "react";
import styles from "./IngredientList.module.css";
import Link from "next/link";
import { fetchIngredients, deleteIngredient } from "@/lib/api-ingredients";
import IngredientCard from "../elements/IngredientCard";
import AddIngredientModal from "./AddIngredientModal";

export default function IngredientList() {
  const [ingredients, setIngredients] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const [showModal, setShowModal] = useState(false);

  // ---
  const [categories, setCategories] = useState([]);
  // ---

  const loadIngredients = async () => {
    try {
      const data = await fetchIngredients();
      setIngredients(data);
      // Extraire les catégories uniques depuis les ingrédients
      const allCategories = Array.from(
        new Set(data.map(item => item.catégorie).filter(Boolean)),
      ).sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" }));
      setCategories(allCategories);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadIngredients();
  }, []);

  const filteredItems = ingredients
    .filter(item => item.nom.toLowerCase().includes(search.toLowerCase()))
    .filter(item =>
      categoryFilter === "all" ? true : item.catégorie === categoryFilter,
    )
    .sort((a, b) => a.nom.localeCompare(b.nom, "fr", { sensitivity: "base" }));

  const paginatedItems = filteredItems.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  // ---
  const handleDelete = async id => {
    if (confirm("Supprimer cet ingrédient ?")) {
      await deleteIngredient(id);
      loadIngredients();
    }
  };
  // ---

  const onClose = () => {
    const confirmClose = window.confirm(
      "Êtes-vous sûr de vouloir fermer sans sauvegarder ? Les modifications ne seront pas enregistrées.",
    );
    if (confirmClose) {
      setShowModal(false);
    }
  };

  const handleIngredientAdded = () => {
    // recharge les données si besoin
    console.log("Ingrédient ajouté !");
  };

  const uniqueCategories = [
    "all",
    ...new Set(ingredients.map(i => i.catégorie)),
  ];

  return (
    <div className={styles.container}>
      <button onClick={() => setShowModal(true)}>Ajouter un ingrédient</button>
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="🔍 Rechercher un ingrédient"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
        >
          {uniqueCategories.map(cat => (
            <option key={cat} value={cat}>
              {cat === "all" ? "Toutes les catégories" : cat}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.grid}>
        {paginatedItems.map(ingredient => {
          return (
            <div className={styles.link}>
              <IngredientCard
                ingredient={ingredient}
                setShowModal={setShowModal}
                handleDelete={handleDelete}
              />
            </div>
          );
        })}
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
      </div>{" "}
      {showModal && (
        <AddIngredientModal
          onClose={onClose} // ← Gère la fermeture
          onIngredientAdded={handleIngredientAdded}
        />
      )}
    </div>
  );
}
