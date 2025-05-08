import { useState } from "react";
import styles from ".././Form.module.css";

export default function AddStoreModal({ onClose, onAdd }) {
  const [newStore, setNewStore] = useState({ magasin: "", prix: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewStore((prev) => ({
      ...prev,
      [name]: name === "prix" ? parseFloat(value) : value,
    }));
  };

  const handleAdd = () => {
    if (!newStore.magasin || isNaN(newStore.prix)) {
      alert("Veuillez remplir tous les champs.");
      return;
    }
    onAdd(newStore);
    onClose();
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <button type="button" onClick={onClose}>Annuler</button>
        <h3>Ajouter un magasin</h3>
        <label>
          Nom du magasin
          <input
            name="magasin"
            value={newStore.magasin}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Prix
          <input
            name="prix"
            type="number"
            value={newStore.prix}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
          />
        </label>

        <button type="button" onClick={handleAdd}>Enregistrer</button>
      </div>
    </div>
  );
}
