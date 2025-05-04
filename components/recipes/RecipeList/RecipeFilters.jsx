

/** JSDoc
 * Composant : RecipeFilters
 * Rôle : Affiche les filtres (recherche + types)
 * Utilisé dans : RecipeList
 */
export default function RecipeFilters({ search, setSearch, typeFilter, setTypeFilter, types }) {
  return (
    <div>
      <label htmlFor="recipeSearch">Rechercher une recette</label>
      <input
        id="recipeSearch"
        type="text"
        
        placeholder="🔍 Rechercher une recette"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      
      <label htmlFor="typeFilter">Filtrer par type</label>
      <select
        id="typeFilter"
        
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
