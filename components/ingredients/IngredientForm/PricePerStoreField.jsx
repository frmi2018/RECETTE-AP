import styles from "./IngredientForm.module.css";

export default function PricePerStoreField({
  entries,
  onPriceChange,
  onPriceInput,
  onAdd,
  onRemove,
  hasPriceErrors,
}) {
  return (
    <div className={styles["col-full"]}>
      <h4 className={`${styles["col-full"]} ${styles["text-center"]}`}>
        Prix par magasin
      </h4>

      {entries.map((entry, index) => (
        <div key={index} className={styles["col-full"]}>
          {/* Nom du magasin */}
          <div className={`${styles["col-full"]} ${styles["form-field"]}`}>
            <span>Nom</span>
            <input
              type="text"
              placeholder="Nom du magasin"
              value={entry.magasin}
              onChange={e =>
                onPriceChange(index, "magasin", e.target.value)
              }
              required
            />
          </div>

          {/* Prix */}
          <div className={`${styles["col-full"]} ${styles["form-field"]}`}>
            <span>Prix</span>
            <div className={styles["price-input-group"]}>
              <input
                type="number"
                inputMode="decimal"
                placeholder="Prix"
                value={entry.prix}
                onChange={e => onPriceInput(e.target.value, index)}
                required
                className={hasPriceErrors ? styles["input-error"] : ""}
              />
              <span>€</span>
            </div>
            {hasPriceErrors[index] && (
              <div className={styles["error-text"]}>
                Prix invalide (ex : 2.50)
              </div>
            )}
          </div>

          {/* Bouton supprimer */}
          {entries.length > 1 && (
            <button type="button" onClick={() => onRemove(index)}>
              🗑
            </button>
          )}
        </div>
      ))}

      <div className={`${styles["col-full"]} ${styles["text-center"]}`}>
        <button type="button" onClick={onAdd}>
          ➕ Ajouter un magasin
        </button>
      </div>
    </div>
  );
}
