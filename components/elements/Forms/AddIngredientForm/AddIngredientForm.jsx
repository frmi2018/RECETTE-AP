import { useState } from "react";
import styles from ".././Form.module.css";

export default function AddIngredientForm({ onClose, onAdded }) {
  const [form, setForm] = useState({
    id: "",
    nom: "",
    quantité: 1,
    unité: "pièce",
    catégorie: "non définie",
    unite_facturation: "Pièce",
    prix_par_magasin: [{ magasin: "inconnu", prix: 1 }],
    image: "/images/icons/add-image.png",
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
      onAdded && onAdded();
      onClose();
    } catch (err) {
      console.error("Erreur ajout ingrédient:", err);
      alert("Erreur lors de l'ajout de l'ingrédient.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setForm(prev => ({ ...prev, image: imageUrl }));
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
  id="nom"
  name="nom"
  value={form.nom}
  onChange={handleChange}
  required
/>

          </label>

          <label>
            Marque
            <input
              id="marque"
              name="marque"
              value={form.marque}
              onChange={handleChange}
            />
          </label>

          <label>
            Quantité
            <input
              id="quantité"
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
              id="unité"
              name="unité"
              value={form.unité}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Catégorie
            <input
              id="catégorie"
                           name="catégorie"
              value={form.catégorie}
              onChange={handleChange}
              required
            />
          </label>

          <fieldset>
            <legend>Unité de facturation</legend>

            {["Pièce", "Kilo", "Litre"].map((val) => {
  const id = `unite_facturation_${val.toLowerCase()}`;
  return (
    <div key={val}>
      <input
        type="radio"
        id={id}
        name="unite_facturation"
        value={val}
        checked={form.unite_facturation === val}
        onChange={handleChange}
        required
      />
      <label htmlFor={id}>{val}</label>
    </div>
  );
})}

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

          <input
  type="file"
  accept="image/*"
  style={{ display: "none" }}
  id="imageUpload"
  onChange={handleImageChange}
/>

<label
  htmlFor="imageUpload"
  style={{
    display: "inline-block",
    position: "relative",
    cursor: "pointer",
    width: "100px",
    height: "100px",
  }}
>
  <img
    src={form.image}
    alt="Aperçu"
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
      borderRadius: "6px",
    }}
  />
  <span
    style={{
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      background: "rgba(0, 0, 0, 0.6)",
      color: "white",
      textAlign: "center",
      fontSize: "12px",
      padding: "4px 0",
      opacity: 0,
      transition: "opacity 0.3s",
    }}
  >
    Changer l'image
  </span>
</label>

<style jsx>{`
  label:hover span {
    opacity: 1;
  }
`}</style>


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
              id="magasin"
                name="magasin"
                value={newStore.magasin}
                onChange={handleStoreChange}
                required
              />
            </label>
            <label>
              Prix
              <input
              id="prix"
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
