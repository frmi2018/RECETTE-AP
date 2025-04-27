import { useState } from "react";
import styles from "./EditEtapes.module.css";

export default function EditEtapes({ initialEtapes }) {
  const [etapes, setEtapes] = useState(initialEtapes || []);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [dragPosition, setDragPosition] = useState(null); // "top" ou "bottom"

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

  const sauvegarder = () => {
    console.log("Étapes mises à jour :", etapes);
  };

  return (
    <div className={styles.editEtapesContainer}>
      <h2 className={styles.title}>Éditer les étapes (Drag & Drop)</h2>

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
          onClick={sauvegarder}
          className={styles.sauvegarderBtn}
        >
          Sauvegarder
        </button>
      </div>
    </div>
  );
}
