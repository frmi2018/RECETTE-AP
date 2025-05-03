/** JSDoc
 * Composant : IngredientFilters
 * Rôle : Affiche les filtres (recherche + catégories)
 * Utilisé dans : IngredientList
 */

export default function IngredientFilters({ search, setSearch, categoryFilter, setCategoryFilter, categories }) {
    return (
      <div>
        <input
          type="text"
          placeholder="🔍 Rechercher un ingrédient"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat === "all" ? "Toutes les catégories" : cat}
            </option>
          ))}
        </select>
      </div>
    );
  }
  