import { useEffect, useState } from "react";
import styles from "../Form.module.css";
import { updateIngredient } from "@/lib/api-ingredients";
import ImageUpload from "../AddIngredientForm/ImageUpload";
import PricePerStore from "./PricePerStore";

export default function UpdateIngredientForm({ onCloseUpdate, onUpdated, ingredient }) {
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

  const [newStore, setNewStore] = useState({ magasin: "", prix: "" });
  const [editIndex, setEditIndex] = useState(null);
  const [editStore, setEditStore] = useState({ magasin: "", prix: "" });

  useEffect(() => {
    if (ingredient) {
      setForm({
        nom: ingredient.nom || "",
        quantité: ingredient.quantité || 1,
        unité: ingredient.unité || "pièce",
        catégorie: ingredient.catégorie || "non définie",
        unite_facturation: ingredient.unite_facturation || "Pièce",
        prix_par_magasin: ingredient.prix_par_magasin ? [...ingredient.prix_par_magasin] : [],
        image: ingredient.image || "/images/icons/pas-image.png",
        marque: ingredient.marque || "sans marque",
      });
    }
  }, [ingredient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (imageUrl) => {
    setForm((prev) => ({ ...prev, image: imageUrl }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ingredient) return;

    try {
      const { prix_par_magasin, ...ingredientData } = form;

      const formattedPrices = prix_par_magasin.map((item) => ({
        magasin: item.magasin.trim(),
        prix: parseFloat(formatPrice(item.prix?.toString() || "")),
      }));

      const updatedIngredient = {
        ...ingredientData,
        quantité: parseFloat(form.quantité) || 0,
        prix_par_magasin: formattedPrices,
      };

      await updateIngredient(ingredient.id, updatedIngredient);

      onUpdated && onUpdated();
      onCloseUpdate();
    } catch (err) {
      console.error("Erreur lors de la mise à jour de l'ingrédient :", err);
      alert("Erreur lors de la mise à jour de l'ingrédient.");
    }
  };

  const formatPrice = (value) => {
    let formatted = value?.toString() || "";
    if (formatted.includes(".")) {
      const parts = formatted.split(".");
      if (parts[1].length > 2) {
        formatted = `${parts[0]}.${parts[1].slice(0, 2)}`;
      }
    }
    return formatted;
  };

  const handleSaveEdit = () => {
    if (!editStore.magasin.trim() || editStore.prix === "") {
      alert("Veuillez remplir les champs Magasin et Prix.");
      return;
    }

    const updatedPrices = [...form.prix_par_magasin];
    updatedPrices[editIndex] = {
      magasin: editStore.magasin.trim(),
      prix: parseFloat(formatPrice(editStore.prix)),
    };

    setForm({ ...form, prix_par_magasin: updatedPrices });
    setEditIndex(null);
    setEditStore({ magasin: "", prix: "" });
  };

  const handleDeleteStore = (index) => {
    const updatedStores = [...form.prix_par_magasin];
    updatedStores.splice(index, 1);
    setForm((prev) => ({
      ...prev,
      prix_par_magasin: updatedStores,
    }));
  };

  if (!ingredient) return null;

  return (<div className={styles.modalBackdrop}>
    <div className={styles.modal}>
      {/* Bouton croix pour fermer la modale */}
      <button 
        type="button" 
        onClick={onCloseUpdate} 
        className={styles.closeButton}
      >
        &times;
      </button>
      <h2>Editer</h2>  
      <form onSubmit={handleSubmit}>
      <div style={{ display: "flex", gap: "3rem", alignItems: "center" }}>
      <label style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
    Nom de l'ingrédient
    <input
      name="nom"
      placeholder="Nom de l'ingrédient"
      value={form.nom}
      onChange={handleChange}
      maxLength={40}
      style={{ width: "200px", padding: "5px" }}
      required
    />
  </label>
  
  <ImageUpload image={form.image} onImageChange={handleImageChange} />


</div>
   
        <label>
          Marque
          <input name="marque" placeholder="Marque" value={form.marque} onChange={handleChange} />
        </label>
  
        <div style={{ display: "flex", gap: "20px" }}>
          <label>
            Quantité
            <input
              name="quantité"
              type="number"
              placeholder="Quantité"
              value={form.quantité}
              onChange={handleChange}
              required
            />
          </label>
  
          <label>
            Unité
            <input name="unité" value={form.unité} onChange={handleChange} required />
          </label>
        </div>
  
        <label>
          Catégorie
          <input name="catégorie" value={form.catégorie} onChange={handleChange} required />
        </label>
  
        <fieldset style={{ display: "flex", justifyContent: "space-around" }}>
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
  
        <PricePerStore
          form={form}
          setForm={setForm}
          newStore={newStore}
          setNewStore={setNewStore}
          editIndex={editIndex}
          setEditIndex={setEditIndex}
          editStore={editStore}
          setEditStore={setEditStore}
          handleSaveEdit={handleSaveEdit}
          handleDeleteStore={handleDeleteStore}
          formatPrice={formatPrice}
        />
  
        <button type="submit">Enregistrer</button>
      </form>
    </div>
  </div>
  
  );
}
