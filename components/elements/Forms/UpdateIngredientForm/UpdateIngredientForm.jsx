import { useState } from "react";
import styles from ".././Form.module.css";

export default function UpdateIngredientForm({ onCloseUpdate, onIngredientUpdated }) {
  const [form, setForm] = useState({
    id:"",
    nom: "",
    quantité: 1,
    unité: "pièce",
    catégorie: "non définie",
    unite_facturation: "unité",
    prix_par_magasin: [
      { magasin: "inconnu", prix: 1 },
    ],
    image: "/images/add-image.png",
    marque: "sans marque",
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
      if (!response.ok) throw new Error("Échec de la mise à jour de l'ingrédient.");
      onIngredientUpdated && onIngredientUpdated();
      onCloseUpdate();
    } catch (err) {
      console.error("Erreur ajout ingrédient:", err);
      alert("Erreur lors de la mise à jour de l'ingrédient.");
    }
  };

  
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
      <button type="button" onClick={onCloseUpdate}>Fermer</button>
        <h2>Mise à jour d'un ingrédient</h2>
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


            <button type="submit">Enregistrer</button>


        </form>
      </div>
    </div>
  );
}
