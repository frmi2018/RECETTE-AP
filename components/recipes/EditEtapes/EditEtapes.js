/**
 * Composant : EditEtapes
 * Rôle : Edite les étapes d'une recette contenu dans le fichier recipe.json
 * Utilisé dans : Recipe
 */
//
// extrait objet recipe.json
// {
//   "id": 10,
//   "etapes": [
//     "Préchauffer le four à 180°C.",
//     "Faire fondre le chocolat et le beurre.",
//     "Mélanger avec le sucre, les œufs et la farine.",
//     "Verser dans un moule et cuire pendant 25 minutes."
//   ],
// }
//
// Appel la méthode updateRecipe du fichier @/lib/api-recipes
// export const updateRecipe = async (id, updatedFields) => {
//   const response = await fetch((`/api/recipes/${id}`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ id, ...updatedFields }),
//   });
//   if (!response.ok) {
//     throw new Error(
//       `Erreur lors de la mise à jour de la recette avec id ${id}`,
//     );
//   }
// };
//
// updateRecipe utilise le méthode PUT du fichier pages/api/recipes/[id]
// pour mettre à jour le fichier /data/recipes.json
//
// if (method === "PUT") {
//   try {
//     const fileContent = fs.readFileSync(filePath, "utf8");
//     const recipes = JSON.parse(fileContent);

//     const index = recipes.findIndex(r => r.id === parseInt(id));
//     if (index === -1) {
//       return res
//         .status(404)
//         .json({ message: `Recette avec id ${id} introuvable` });
//     }

//     const updatedFields = req.body;
//     recipes[index] = { ...recipes[index], ...updatedFields };

//     fs.writeFileSync(filePath, JSON.stringify(recipes, null, 2), "utf8");
//     res.status(200).json({ message: "Recette mise à jour avec succès" });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Erreur lors de la mise à jour de la recette" });
//   }
// }

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
    <div className={styles.editEtapesContainer}>
      <h3>Étapes de la recette</h3>

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
  );
}
