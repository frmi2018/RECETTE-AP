import React, { useState, useEffect } from "react";
import { createIngredient, getNextId } from "../modules/ingredientUtils";

const IngredientForm = () => {
  const [ingredient, setIngredient] = useState({
    id: "",
    nom: "",
    quantité: "",
    unité: "",
    catégorie: "",
    unite_facturation: "",
    prix_par_magasin: [
      { magasin: "Carrefour", prix: "" },
      { magasin: "Intermarché", prix: "" },
      { magasin: "Autre", prix: "" },
    ],
    image: "/images/ingredients/default.png",
    marque: "",
  });

  useEffect(() => {
    const fetchNextId = async () => {
      try {
        const nextId = await getNextId();
        setIngredient(prevIngredient => ({
          ...prevIngredient,
          id: nextId,
        }));
      } catch (error) {
        console.error("Erreur lors de la récupération de l'ID suivant:", error);
      }
    };

    fetchNextId();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setIngredient(prevIngredient => ({
      ...prevIngredient,
      [name]: value,
    }));
  };

  const handlePriceChange = (e, index) => {
    const { name, value } = e.target;
    setIngredient(prevIngredient => {
      const prix_par_magasin = [...prevIngredient.prix_par_magasin];
      prix_par_magasin[index] = { ...prix_par_magasin[index], [name]: value };
      return { ...prevIngredient, prix_par_magasin };
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    console.log("Submitting ingredient:", ingredient);
    const response = await createIngredient(ingredient);
    if (response.ok) {
      alert("Ingrédient ajouté avec succès !");
      setIngredient({
        id: "",
        nom: "",
        quantité: "",
        unité: "",
        catégorie: "",
        unite_facturation: "",
        prix_par_magasin: [
          { magasin: "Carrefour", prix: "" },
          { magasin: "Intermarché", prix: "" },
          { magasin: "Aucun", prix: "" },
        ],
        image: "/images/ingredients/default.png",
        marque: "",
      });
    } else {
      alert("Erreur lors de l'ajout de l'ingrédient.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <span>ID: {ingredient.id}</span>
      </div>
      <div>
        <label>Nom:</label>
        <input
          type="text"
          name="nom"
          value={ingredient.nom}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Quantité:</label>
        <input
          type="text"
          name="quantité"
          value={ingredient.quantité}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Unité:</label>
        <input
          type="text"
          name="unité"
          value={ingredient.unité}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Catégorie:</label>
        <input
          type="text"
          name="catégorie"
          value={ingredient.catégorie}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Unité de facturation:</label>
        <select
          name="unite_facturation"
          value={ingredient.unite_facturation}
          onChange={handleChange}
        >
          <option value="">Sélectionnez une unité</option>
          <option value="kilo">Kilo</option>
          <option value="litre">Litre</option>
          <option value="unité">Pièce</option>
        </select>
      </div>
      {ingredient.prix_par_magasin.map((prix, index) => (
        <div key={index}>
          <label>Prix {prix.magasin}:</label>
          <input
            type="text"
            name="prix"
            value={prix.prix}
            onChange={e => handlePriceChange(e, index)}
          />
        </div>
      ))}
      <div>
        <label>Image:</label>
        <input
          type="text"
          name="image"
          value={ingredient.image}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Marque:</label>
        <input
          type="text"
          name="marque"
          value={ingredient.marque}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Ajouter l'ingrédient</button>
    </form>
  );
};

export default IngredientForm;
