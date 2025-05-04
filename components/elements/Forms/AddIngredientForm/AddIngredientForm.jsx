import { useState } from "react";
import styles from ".././Form.module.css";

export default function AddIngredientForm({ onClose, onIngredientAdded }) {
  const [form, setForm] = useState({
    id: "",
    nom: "",
    quantité: 1,
    unité: "pièce",
    catégorie: "non définie",
    unite_facturation: "Pièce",
    prix_par_magasin: [{ magasin: "inconnu", prix: 1 }],
    image: "/images/add-image.png",
    marque: "sans marque",
  });

  const [showAddStoreModal, setShowAddStoreModal] = useState(false);
  const [newStore, setNewStore] = useState({ magasin: "", prix: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleStoreChange = (e) => {
    const { name, value } = e.target;
    setNewStore((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddStore = () => {
    if (newStore.magasin && newStore.prix) {
      setForm((prev) => ({
        ...prev,
        prix_par_magasin: [
          ...prev.prix_par_magasin,
          { magasin: newStore.magasin, prix: parseFloat(newStore.prix) },
        ],
      }));
      setShowAddStoreModal(false);
      setNewStore({ magasin: "", prix: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/ingredients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, id: Date.now() }),
      });
      if (!response.ok) throw new Error("Échec de l'ajout de l'ingrédient.");
      onIngredientAdded && onIngredientAdded();
      onClose();
    } catch (err) {
      console.error("Erreur ajout ingrédient:", err);
      alert("Erreur lors de l'ajout de l'ingrédient.");
    }
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <button type="button" onClick={onClose}>Fermer</button>
        <h2>Ajouter un ingrédient</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Nom de l'ingrédient
            <input
              name="nom"
              value={form.nom}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Marque
            <input
              name="marque"
              value={form.marque}
              onChange={handleChange}
            />
          </label>

          <label>
            Quantité
            <input
              name="quantité"
              type="number"
              value={form.quantité}
              onChange={handleChange}
              required
              min="0"
            />
          </label>

          <label>
            Unité
            <input
              name="unité"
              value={form.unité}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Catégorie
            <input
              name="catégorie"
              value={form.catégorie}
              onChange={handleChange}
              required
            />
          </label>

          <fieldset>
            <legend>Unité de facturation</legend>

            {["Pièce", "Kilo", "Litre"].map((val) => (
                <label key={val}>
                  <input
                    type="radio"
                    name="unite_facturation"
                    value={val}
                    checked={form.unite_facturation === val}
                    onChange={handleChange}
                    required
                  />
                  {val}
                </label>
              ))}
          </fieldset>

          <fieldset>
            <legend>Prix par magasin</legend>
            <button type="button" onClick={() => setShowAddStoreModal(true)}>
              Ajouter un magasin
            </button>
            <ul>
              {form.prix_par_magasin.map((item, index) => (
                <li key={index}>{item.magasin}: {item.prix} €</li>
              ))}
            </ul>
          </fieldset>

          <label>
            Image (URL)
            <input
              name="image"
              value={form.image}
              onChange={handleChange}
            />
          </label>

          <button type="submit">Enregistrer</button>
        </form>
      </div>

      {showAddStoreModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
          <button type="button" onClick={() => setShowAddStoreModal(false)}>
              Annuler
            </button>
            <h3>Ajouter un magasin</h3>
            <label>
              Nom du magasin
              <input
                name="magasin"
                value={newStore.magasin}
                onChange={handleStoreChange}
                required
              />
            </label>
            <label>
              Prix
              <input
                name="prix"
                type="number"
                value={newStore.prix}
                onChange={handleStoreChange}
                required
                min="0"
                step="0.01"
              />
            </label>

            <button type="button" onClick={handleAddStore}>
            Enregistrer
            </button>

          </div>
        </div>
      )}
    </div>
  );
}
