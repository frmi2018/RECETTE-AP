import { useState } from "react";

export default function IngredientCategoryField({
  value,
  categories,
  onChange,
}) {
  const [showCustom, setShowCustom] = useState(false);

  const sortedOptions = [...new Set(categories)]
    .filter(cat => cat && cat !== value && cat !== "__autre__")
    .sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" }));

  const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className="col-full form-field">
      <span>Catégorie</span>
      {!showCustom ? (
        <select
          name="catégorie"
          value={value}
          onChange={e => {
            if (e.target.value === "__autre__") {
              setShowCustom(true);
            } else {
              onChange(e);
            }
          }}
        >
          {!value && <option value="">Sélectionner une catégorie</option>}
          {value && <option value={value}>{capitalize(value)}</option>}
          {sortedOptions.map(cat => (
            <option key={cat} value={cat}>
              {capitalize(cat)}
            </option>
          ))}
          <option value="__autre__">➕ Autre...</option>
        </select>
      ) : (
        <div>
          <input
            type="text"
            name="catégorie"
            placeholder="Entrer une nouvelle catégorie"
            value={value}
            onChange={onChange}
            onBlur={() => {
              if (value.trim()) {
                setShowCustom(false);
              }
            }}
          />
          <button
            type="button"
            onClick={() => {
              setShowCustom(false);
              onChange({ target: { name: "catégorie", value: "" } });
            }}
          >
            Annuler
          </button>
        </div>
      )}
    </div>
  );
}
