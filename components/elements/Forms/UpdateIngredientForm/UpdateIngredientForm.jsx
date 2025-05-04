import { useEffect, useState } from "react";
import styles from ".././Form.module.css";

export default function UpdateIngredientForm({ onCloseUpdate, onUpdated, ingredient }) {
  const [form, setForm] = useState({
    nom: "",
    marque: "",
    quantité: "",
    unité: "",
    catégorie: "",
    unite_facturation: "Pièce",
    magasin: "",
    prix: "",
    image: "",
  });
  console.log("ingredient",ingredient)

  useEffect(() => {
    if (ingredient) {
      setForm({
        nom: ingredient.nom || "",
        marque: ingredient.marque || "",
        quantité: ingredient.quantité || "",
        unité: ingredient.unité || "",
        catégorie: ingredient.catégorie || "",
        unite_facturation: ingredient.unite_facturation || "Pièce",
        magasin: ingredient.magasin || "",
        prix: ingredient.prix || "",
        image: ingredient.image || "",
      });
    }
  }, [ingredient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedIngredient = {
        ...form,
        prix_par_magasin: [
          {
            magasin: form.magasin || "inconnu",
            prix: parseFloat(form.prix || 0),
          },
        ],
      };

      const response = await fetch("/api/ingredients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedIngredient),
      });

      if (!response.ok) throw new Error("Échec de la mise à jour de l'ingrédient.");
      onUpdated && onUpdated();
      onCloseUpdate();
    } catch (err) {
      console.error("Erreur ajout ingrédient:", err);
      alert("Erreur lors de la mise à jour de l'ingrédient.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setForm((prev) => ({ ...prev, image: imageUrl }));
    }
  };

  if (!ingredient) return null;

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <button type="button" onClick={onCloseUpdate}>Fermer</button>
        <h2>Mise à jour d'un ingrédient</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="nom"
            placeholder="Nom de l'ingrédient"
            value={form.nom || ""}
            onChange={handleChange}
            required
          />
          <input
            name="marque"
            placeholder="Marque"
            value={form.marque || ""}
            onChange={handleChange}
          />
          <input
            name="quantité"
            type="number"
            placeholder="Quantité"
            value={form.quantité || ""}
            onChange={handleChange}
            required
          />
          <input
            name="unité"
            placeholder="Unité"
            value={form.unité || ""}
            onChange={handleChange}
            required
          />
          <input
            name="catégorie"
            placeholder="Catégorie"
            value={form.catégorie || ""}
            onChange={handleChange}
            required
          />

          <div>
            <label>Unité de facturation</label>
            <div style={{ display: "flex" }}>
              {["Pièce", "Kilo", "Litre"].map(unit => (
                <label key={unit}>
                  <input
                    type="radio"
                    name="unite_facturation"
                    value={unit}
                    checked={form.unite_facturation === unit}
                    onChange={handleChange}
                  />
                  {unit}
                </label>
              ))}
            </div>
          </div>

          <div style={{ margin: "10px 0" }}>
            <input
              name="magasin"
              type="text"
              value={form.magasin || ""}
              onChange={handleChange}
              placeholder="Magasin"
            />
            <input
              name="prix"
              type="number"
              value={form.prix || ""}
              onChange={handleChange}
              placeholder="Prix"
            />
            <button type="submit">Ajouter un magasin</button>
          </div>

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
    </div>
  );
}
