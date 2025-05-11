import { useEffect, useState, useMemo } from "react";
import styles from "./IngredientList.module.css";
import { fetchIngredients, deleteIngredient } from "@/lib/api-ingredients";
import IngredientFilters from "./IngredientFilters";
import IngredientGrid from "./IngredientGrid";
import IngredientModals from "./IngredientModals";

export default function IngredientList() {
  const [ingredients, setIngredients] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const itemsPerPage = 3;
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(null);

  const loadIngredients = async () => {
    try {
      const data = await fetchIngredients();
      setIngredients(data);
    } catch (error) {
      console.error("Erreur lors du chargement des ingrédients :", error);
    }
  };

  useEffect(() => {
    loadIngredients();
  }, []);

  const [cartItems, setCartItems] = useState([]);

  // Charger les items du panier au montage
  useEffect(() => {
    const loadCartItems = async () => {
      try {
        const cartData = await fetchCart();
        setCartItems(cartData);
      } catch (error) {
        console.error("Erreur lors du chargement du panier :", error);
      }
    };

    loadCartItems();
  }, []);

  const filteredItems = useMemo(() => {
    const lowerSearch = search.toLowerCase();
    return ingredients
      .filter(i => i.nom.toLowerCase().includes(lowerSearch))
      .filter(i => categoryFilter === "all" || i.categorie === categoryFilter)
      .sort((a, b) =>
        a.nom.localeCompare(b.nom, "fr", { sensitivity: "base" }),
      );
  }, [ingredients, search, categoryFilter]);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, page]);

  const uniqueCategories = useMemo(() => {
    const categories = ingredients
      .map(i =>
        typeof i.categorie === "string" ? i.categorie.toLowerCase() : null,
      )
      .filter(Boolean);
    return ["all", ...new Set(categories)];
  }, [ingredients]);

  const handleDelete = async id => {
    if (confirm("Supprimer cet ingrédient ?")) {
      await deleteIngredient(id);
      loadIngredients();
    }
  };

  const onClose = () => {
    if (confirm("Fermer sans sauvegarder ?")) setShowModal(false);
  };

  const onCloseUpdate = () => {
    if (confirm("Fermer sans sauvegarder ?")) {
      setShowEditModal(false);
      setSelectedIngredient(null);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <button onClick={() => setShowModal(true)}>
          Ajouter un ingrédient
        </button>

        <IngredientFilters
          search={search}
          setSearch={setSearch}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          categories={uniqueCategories}
        />
      </div>
      <div className={styles.wrapper}>
        <IngredientGrid
          items={paginatedItems}
          onEdit={ingredient => {
            setSelectedIngredient(ingredient);
            setShowEditModal(true);
          }}
          onDelete={handleDelete}
        />
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

      <IngredientModals
        showModal={showModal}
        showEditModal={showEditModal}
        onClose={onClose}
        onCloseUpdate={onCloseUpdate}
        onAdded={loadIngredients}
        onUpdated={loadIngredients}
        ingredient={selectedIngredient}
      />
    </div>
  );
}
