import { useEffect, useState } from "react";
import styles from "./IngredientList.module.css";
import Link from "next/link";
import { fetchIngredients, deleteIngredient } from "@/lib/api-ingredients";
import IngredientForm from "./IngredientForm/IngredientForm";
import modal from "./Modal.module.css";
import CloseIcon from "../CloseIcon";

export default function IngredientList() {
  const [ingredients, setIngredients] = useState([]);
  const [editingIngredient, setEditingIngredient] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const [isCreating, setIsCreating] = useState(false);
  const [categories, setCategories] = useState([]);

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

  const handleDelete = async id => {
    if (confirm("Supprimer cet ingrédient ?")) {
      await deleteIngredient(id);
      loadIngredients();
    }
  };

  const handleClose = () => {
    const confirmClose = window.confirm(
      "Êtes-vous sûr de vouloir fermer sans sauvegarder ? Les modifications ne seront pas enregistrées.",
    );
    if (confirmClose) {
      setEditingIngredient(null);
      setIsCreating(false);
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

  const uniqueCategories = [
    "all",
    ...new Set(ingredients.map(i => i.catégorie)),
  ];

  return (
    <div className={styles.container}>
      <button
        onClick={() => {
          setIsCreating(true);
          setEditingIngredient(null);
        }}
        style={{ marginBottom: "10px" }}
      >
        ➕ Ajouter un ingrédient
      </button>
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
          let unitéAffichée = ingredient.unité;
          if (
            ingredient.unite_facturation === "unité" &&
            ingredient.quantité > 1
          ) {
            unitéAffichée += "s";
          }

          return (
            <div className={styles.card} key={ingredient.id}>
              <Link
                href={`/ingredients/${ingredient.id}`}
                className={styles.link}
              >
                <h4>{ingredient.nom}</h4>
                <p>
                  Quantité : {ingredient.quantité} {unitéAffichée}
                </p>
                <p>Catégorie : {ingredient.catégorie}</p>
              </Link>
              <div className={styles.actions}>
                <button onClick={() => setEditingIngredient(ingredient)}>
                  ✏️
                </button>
                <button onClick={() => handleDelete(ingredient.id)}>🗑</button>
              </div>
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
      </div>
      {(isCreating || editingIngredient) && (
        <div className={modal.modalOverlay}>
          <div className={modal.modalContent}>
            <CloseIcon
              onClick={handleClose}
              style={{ position: "absolute", top: 10, right: 15 }}
            />
            <h3 style={{ textAlign: "center" }}>
              {editingIngredient ? "Modifier" : "Ajouter"} un ingrédient
            </h3>
            <IngredientForm
              categories={categories}
              ingredient={editingIngredient}
              onSuccess={() => {
                loadIngredients();
                setEditingIngredient(null);
                setIsCreating(false);
              }}
              onCancel={() => {
                setEditingIngredient(null);
                setIsCreating(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
