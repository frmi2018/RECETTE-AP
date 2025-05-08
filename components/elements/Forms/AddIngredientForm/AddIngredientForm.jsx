import { useState } from "react";
import styles from ".././Form.module.css";
import { createIngredient } from "@/lib/api-ingredients";
import ImageUpload from "./ImageUpload";
import StorePriceList from "./StorePriceList";
import AddStoreModal from "./AddStoreModal";

export default function AddIngredientForm({ onClose, onAdded }) {
  const [form, setForm] = useState({
    nom: "",
    quantité: 1,
    unité: "pièce",
    catégorie: "non définie",
    unite_facturation: "Pièce",
    prix_par_magasin: [],
    image: "/images/icons/add-image.png",
    marque: "sans marque",
  });

  const [showAddStoreModal, setShowAddStoreModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "quantité" ? parseFloat(value) : value,
    }));
  };

  const handleImageChange = (imageUrl) => {
    setForm((prev) => ({ ...prev, image: imageUrl }));
  };

  const handleAddStore = (newStore) => {
    setForm((prev) => ({
      ...prev,
      prix_par_magasin: [...prev.prix_par_magasin, newStore],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createIngredient({ ...form, id: Date.now() });
      onAdded && onAdded();
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
            <input name="nom" value={form.nom} onChange={handleChange} required />
          </label>

          <label>
            Marque
            <input name="marque" value={form.marque} onChange={handleChange} />
          </label>

          <label>
            Quantité
            <input
              name="quantité"
              type="number"
              value={form.quantité}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Unité
            <input name="unité" value={form.unité} onChange={handleChange} required />
          </label>

          <label>
            Catégorie
            <input name="catégorie" value={form.catégorie} onChange={handleChange} required />
          </label>

          <fieldset style={{ display: "flex", justifyContent:"space-around"}}>
            <legend>Unité de facturation</legend>
            {["Pièce", "Kilo", "Litre"].map((val) => (
              <div key={val}>
                <input
                  type="radio"
                  name="unite_facturation"
                  value={val}
                  checked={form.unite_facturation === val}
                  onChange={handleChange}
                  required
                />
                <label>{val}</label>
              </div>
            ))}
          </fieldset>

          <StorePriceList stores={form.prix_par_magasin} />

          <button type="button" onClick={() => setShowAddStoreModal(true)}>
            Ajouter un magasin
          </button>

          <ImageUpload image={form.image} onImageChange={handleImageChange} />

          <button type="submit">Enregistrer</button>
        </form>
      </div>

      {showAddStoreModal && (
        <AddStoreModal
          onClose={() => setShowAddStoreModal(false)}
          onAdd={handleAddStore}
        />
      )}
    </div>
  );
}
