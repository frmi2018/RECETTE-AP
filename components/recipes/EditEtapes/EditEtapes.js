import { useState } from "react";
import styles from "./EditEtapes.module.css";
import ingredientsData from "@/data/ingredients.json";
import { updateRecipe } from "@/lib/api-recipes";

export default function EditEtapes({ initialEtapes, recipeId, onUpdate }) {
  const [etapes, setEtapes] = useState(initialEtapes || []);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [dragPosition, setDragPosition] = useState(null); // "top" ou "bottom"
  const [isEditing, setIsEditing] = useState(false);

  const onDragStart = index => {
    setDraggedIndex(index);
  };

  const onDragOver = (e, index) => {
    e.preventDefault();
    const bounding = e.currentTarget.getBoundingClientRect();
    const offset = e.clientY - bounding.top;

    if (offset < bounding.height / 2) {
      setDragPosition("top");
    } else {
      setDragPosition("bottom");
    }

    setDragOverIndex(index);
  };

  const onDragLeave = () => {
    setDragOverIndex(null);
    setDragPosition(null);
  };

  const onDrop = index => {
    if (draggedIndex === null) return;

    const nouvellesEtapes = [...etapes];
    const etapeDéplacée = nouvellesEtapes.splice(draggedIndex, 1)[0];

    let newIndex = index;
    if (dragPosition === "bottom") {
      newIndex++;
    }
    nouvellesEtapes.splice(newIndex, 0, etapeDéplacée);

    setEtapes(nouvellesEtapes);
    setDraggedIndex(null);
    setDragOverIndex(null);
    setDragPosition(null);
  };

  const ajouterEtape = () => {
    setEtapes([...etapes, ""]);
  };

  const modifierEtape = (index, nouvelleValeur) => {
    const nouvellesEtapes = [...etapes];
    nouvellesEtapes[index] = nouvelleValeur;
    setEtapes(nouvellesEtapes);
  };

  const supprimerEtape = index => {
    const nouvellesEtapes = [...etapes];
    nouvellesEtapes.splice(index, 1);
    setEtapes(nouvellesEtapes);
  };

  // Fonction pour mettre à jour la recette après modification
  const handleRecipeUpdate = async () => {
    try {
      await updateRecipe(recipeId, { etapes: etapes });
      setIsEditing(false);
      // onIngredientUpdate && onIngredientUpdate();
      alert("Modifications enregistrées !");
      onUpdate && onUpdate(); // Appelle la fonction du parent pour recharger la recette
    } catch (err) {
      console.error("Erreur modification des étapes :", err);
      alert("Échec de la modification.");
    }
  };

  const toggleEditing = () => {
    setIsEditing(prev => !prev);
  };

  const mettreEnGrasIngrédients = etape => {
    // Créer un tableau des noms d'ingrédients
    const ingredientsNoms = ingredientsData.map(ingredient => ingredient.nom);

    // Remplacer les occurrences des ingrédients par du texte en gras
    let texteModifié = etape;
    ingredientsNoms.forEach(nom => {
      const regex = new RegExp(`\\b${nom}\\b`, "gi"); // Utilise des frontières de mots pour éviter les faux positifs
      texteModifié = texteModifié.replace(
        regex,
        match => `<strong>${match}</strong>`,
      );
    });

    return texteModifié;
  };

  return (
    <div>
      <h3>{etapes.length} Étapes</h3>
      <div className={styles.editEtapesContainer}>
        {isEditing ? (
          <>
            {etapes.map((etape, index) => (
              <div
                key={index}
                draggable
                onDragStart={() => onDragStart(index)}
                onDragOver={e => onDragOver(e, index)}
                onDragLeave={onDragLeave}
                onDrop={() => onDrop(index)}
                className={`${styles.etapeItem} 
                ${index === draggedIndex ? styles.dragged : ""} 
                ${
                  index === dragOverIndex
                    ? dragPosition === "top"
                      ? styles.dragOverTop
                      : styles.dragOverBottom
                    : ""
                }`}
              >
                <div>{index + 1}</div>
                <input
                  type="text"
                  value={etape}
                  onChange={e => modifierEtape(index, e.target.value)}
                  className={styles.etapeInput}
                />
                <button
                  type="button"
                  onClick={() => supprimerEtape(index)}
                  className={styles.etapeSupprimer}
                >
                  Supprimer
                </button>
              </div>
            ))}
            <div className={styles.etapesActions}>
              <button
                type="button"
                onClick={ajouterEtape}
                className={styles.ajouterBtn}
              >
                Ajouter une étape
              </button>
              <button
                type="button"
                onClick={handleRecipeUpdate}
                className={styles.sauvegarderBtn}
              >
                Sauvegarder
              </button>
            </div>
          </>
        ) : (
          <>
            {etapes.map((etape, index) => (
              <div key={index} className={styles.etapeItem2}>
                {index + 1} -{" "}
                <p
                  dangerouslySetInnerHTML={{
                    __html: mettreEnGrasIngrédients(etape),
                  }}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={toggleEditing}
              className={styles.editerBtn}
            >
              Éditer les étapes
            </button>
          </>
        )}
      </div>
    </div>
  );
}
