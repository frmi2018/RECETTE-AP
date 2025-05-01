import { useState, useEffect } from "react";
import ingredientsData from "@/data/ingredients.json";
import styles from "./AddRecipeModal.module.css";

export default function AddRecipeModal({ onClose, onRecipeAdded }) {
  const [form, setForm] = useState({
    nom: "",
    description: "",
    etapes: [""],
    temps_préparation: "",
    temps_cuisson: "",
    portions: "",
    type: "",
    calories: "",
    régime: [],
    image: "/images/add-image.png",
    ingrédients: [],
  });

  const [newIngredient, setNewIngredient] = useState({ id: "", quantité: "", unité: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleStepChange = (index, value) => {
    const updated = [...form.etapes];
    updated[index] = value;
    setForm(prev => ({ ...prev, etapes: updated }));
  };

  const addEtape = () => {
    setForm(prev => ({ ...prev, etapes: [...prev.etapes, ""] }));
  };

  const addIngredient = () => {
    if (newIngredient.id) {
      setForm(prev => ({
        ...prev,
        ingrédients: [...prev.ingrédients, { ...newIngredient, id: parseInt(newIngredient.id) }],
      }));
      setNewIngredient({ id: "", quantité: "", unité: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, id: Date.now() }),
      });
      if (!response.ok) throw new Error("Échec de l'ajout.");
      onRecipeAdded && onRecipeAdded();
      onClose();
    } catch (err) {
      console.error("Erreur ajout recette:", err);
      alert("Erreur lors de l'ajout de la recette.");
    }
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <h2>Ajouter une recette</h2>
        <form onSubmit={handleSubmit}>
          <input name="nom" placeholder="Nom" value={form.nom} onChange={handleChange} required />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
          <div>
            <label>Étapes :</label>
            {form.etapes.map((step, i) => (
              <textarea key={i} value={step} onChange={e => handleStepChange(i, e.target.value)} />
            ))}
            <button type="button" onClick={addEtape}>Ajouter une étape</button>
          </div>
          <input name="temps_préparation" type="number" placeholder="Temps préparation (min)" value={form.temps_préparation} onChange={handleChange} />
          <input name="temps_cuisson" type="number" placeholder="Temps cuisson (min)" value={form.temps_cuisson} onChange={handleChange} />
          <input name="portions" type="number" placeholder="Portions" value={form.portions} onChange={handleChange} />
          <input name="type" placeholder="Type de plat" value={form.type} onChange={handleChange} />
          <input name="calories" type="number" placeholder="Calories" value={form.calories} onChange={handleChange} />

          <hr />
          <h4>Ingrédients</h4>
          <select value={newIngredient.id} onChange={e => setNewIngredient({ ...newIngredient, id: e.target.value })}>
            <option value="">Choisir un ingrédient</option>
            {ingredientsData.map(i => (
              <option key={i.id} value={i.id}>{i.nom}</option>
            ))}
          </select>
          <input type="text" placeholder="Quantité" value={newIngredient.quantité} onChange={e => setNewIngredient({ ...newIngredient, quantité: e.target.value })} />
          <input type="text" placeholder="Unité" value={newIngredient.unité} onChange={e => setNewIngredient({ ...newIngredient, unité: e.target.value })} />
          <button type="button" onClick={addIngredient}>Ajouter ingrédient</button>
          <ul>
            {form.ingrédients.map((i, idx) => {
              const name = ingredientsData.find(d => d.id === i.id)?.nom || "Ingrédient inconnu";
              return <li key={idx}>{name} : {i.quantité} {i.unité}</li>;
            })}
          </ul>

          <div className={styles.modalActions}>
            <button type="submit">Créer</button>
            <button type="button" onClick={onClose}>Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
}
