import { useState } from "react";
import styles from "./AddIngredientModal.module.css";

export default function AddIngredientModal({ onClose, onIngredientAdded }) {
  const [form, setForm] = useState({
    nom: "",
    quantité: "",
    quantité_a_acheter: "",
    unité: "",
    catégorie: "",
    unite_facturation: "",
    prix_par_magasin: [
      { magasin: "Carrefour", prix: "" },
      { magasin: "Intermarché", prix: "" },
      { magasin: "Autre", prix: "" },
    ],
    image: "/images/ingredients/default.jpg",
    marque: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
        <h2>Ajouter un ingrédient</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="nom"
            placeholder="Nom de l'ingrédient"
            value={form.nom}
            onChange={handleChange}
            required
          />
                    <input
            name="marque"
            placeholder="Marque"
            value={form.marque}
            onChange={handleChange}
          />
          <input
            name="quantité"
            type="number"
            placeholder="Quantité"
            value={form.quantité}
            onChange={handleChange}
            required
          />
          <input
            name="unité"
            placeholder="Unité"
            value={form.unité}
            onChange={handleChange}
            required
          />
          <input
            name="catégorie"
            placeholder="Catégorie"
            value={form.catégorie}
            onChange={handleChange}
            required
          />
<div>
  <label>Unité de facturation</label>
  <div style={{display:"flex",}}> 
  <label>
  <input
    type="radio"
    name="unite_facturation"
    value="Pièce"
    onChange={handleChange}
    required
    defaultChecked
  />
  Pièce
</label>
    <label>
      <input
        type="radio"
        name="unite_facturation"
        value="Kilo"
        checked={form.unite_facturation === "Kilo"}
        onChange={handleChange}
        required
      />
      Kilo
    </label>
    <label>
      <input
        type="radio"
        name="unite_facturation"
        value="Litre"
        checked={form.unite_facturation === "Litre"}
        onChange={handleChange}
        required
      />
      Litre
    </label>

  </div>
</div>

          <div style={{margin:"10px 0"}}>
          <input
                name="magasin"
                  type="text"
                  value={form.magasin}
                  onChange={handleChange}
                  placeholder="Magasin"
                />
                <input
                name="prix"
                  type="number"
                  value={form.prix}
                  onChange={handleChange}
                  placeholder="Prix"
                />
                            <button type="submit">Ajouter un magasin</button>
              </div>
     
      
          <input
            name="image"
            placeholder="URL de l'image"
            value={form.image}
            onChange={handleChange}
          />

          <div className={styles.modalActions}>
            <button type="submit">Enregistrer</button>
            <button type="button" onClick={onClose}>Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
}
