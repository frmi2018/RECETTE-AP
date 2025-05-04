import styles from "./RecipeFilters.module.css";

/**
 * Composant : RecipeFilters
 * Rôle : Affiche les filtres (recherche + types)
 */
export default function RecipeFilters({ search, setSearch, typeFilter, setTypeFilter, types }) {
  return (
    <div className={styles.filtersContainer}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder="🔍 Rechercher une recette"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select
        className={styles.selectInput}
        value={typeFilter}
        onChange={(e) => setTypeFilter(e.target.value)}
      >
        {types.map((typ) => (
          <option key={typ} value={typ}>
            {typ === "all" ? "Tous les types" : typ}
          </option>
        ))}
      </select>
    </div>
  );
}
