import styles from "./PricePerStore.module.css";

export default function PricePerStore({
  form,
  setForm,
  newStore,
  setNewStore,
  editIndex,
  setEditIndex,
  editStore,
  setEditStore,
  handleSaveEdit,
  handleDeleteStore,
  formatPrice,
}) {
  const isEditing = editIndex !== null;

  // Vérifie si le magasin existe déjà (hors ligne en cours de modification)
  const isStoreExisting = form.prix_par_magasin.some(
    (item, index) => item.magasin.trim().toLowerCase() === newStore.magasin.trim().toLowerCase() && index !== editIndex
  );

  const isAddButtonDisabled =
    !newStore.magasin.trim() || 
    newStore.prix === "" || 
    isStoreExisting || 
    isEditing;

  const isSaveButtonDisabled =
    !editStore.magasin.trim() || 
    editStore.prix === "" || 
    form.prix_par_magasin.some(
      (item, index) => 
        item.magasin.trim().toLowerCase() === editStore.magasin.trim().toLowerCase() && index !== editIndex
    );

  return (
    <fieldset className={styles.container}>
      <legend>Prix par magasin</legend>

      <ul className={styles.storeList}>
        {form.prix_par_magasin.map((item, index) => (
          <li key={index} className={styles.storeItem}>
            {editIndex === index ? (
              <>
                <input
                  type="text"
                  value={editStore.magasin}
                  onChange={(e) => setEditStore({ ...editStore, magasin: e.target.value })}
                  className={styles.editInput}
                />
                <input
                  type="number"
                  value={editStore.prix}
                  onChange={(e) => setEditStore({ ...editStore, prix: formatPrice(e.target.value) })}
                  className={styles.editInput}
                />
                <div className={styles.buttonGroup}>
                  <button
                    className={styles.button}
                    onClick={handleSaveEdit}
                    disabled={isSaveButtonDisabled}
                    style={{
                      cursor: isSaveButtonDisabled ? "not-allowed" : "pointer",
                      opacity: isSaveButtonDisabled ? 0.5 : 1,
                    }}
                  >
                    Enregistrer
                  </button>
                  <button
                    className={`${styles.button} ${styles.cancelButton}`}
                    onClick={() => setEditIndex(null)}
                  >
                    Annuler
                  </button>
                </div>
              </>
            ) : (
              <>
                <span>{item.magasin} : {item.prix} €</span>
                <div className={styles.buttonGroup}>
                  <button
                    className={styles.button}
                    onClick={() => {
                      setEditIndex(index);
                      setEditStore(item);
                    }}
                    disabled={isEditing}
                    style={{
                      cursor: isEditing ? "not-allowed" : "pointer",
                      opacity: isEditing ? 0.5 : 1,
                    }}
                  >
                    Modifier
                  </button>
                  <button
                    className={`${styles.button} ${styles.cancelButton}`}
                    onClick={() => handleDeleteStore(index)}
                    disabled={isEditing}
                    style={{
                      cursor: isEditing ? "not-allowed" : "pointer",
                      opacity: isEditing ? 0.5 : 1,
                    }}
                  >
                    Supprimer
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      <fieldset className={styles.container}>
        <legend>Ajouter un magasin</legend>
        <div className={styles.storeItem}>
          <input
            type="text"
            value={newStore.magasin}
            onChange={(e) => setNewStore({ ...newStore, magasin: e.target.value })}
            placeholder="Magasin"
            className={styles.addInput}
          />
          <input
            type="number"
            value={newStore.prix}
            onChange={(e) => setNewStore({ ...newStore, prix: formatPrice(e.target.value) })}
            placeholder="Prix"
            className={styles.addInput}
          />

          <button
            className={`${styles.button} ${styles.addButton}`}
            onClick={() => {
              if (isStoreExisting) {
                alert("Ce magasin existe déjà.");
                return;
              }

              setForm({
                ...form,
                prix_par_magasin: [
                  ...form.prix_par_magasin,
                  { magasin: newStore.magasin.trim(), prix: parseFloat(newStore.prix) },
                ],
              });

              setNewStore({ magasin: "", prix: "" });
            }}
            disabled={isAddButtonDisabled}
            style={{
              cursor: isAddButtonDisabled ? "not-allowed" : "pointer",
              opacity: isAddButtonDisabled ? 0.5 : 1,
            }}
          >
            Ajouter
          </button>
        </div>
      </fieldset>
    </fieldset>
  );
}
