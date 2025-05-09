import IngredientCard from "../IngredientCard";
import styles from "./IngredientList.module.css";

/*
/ Rôle: Affiche 3 ingrédients
/
/ input props
/
/ items: liste des 3 ingrédients
/ onEdit: 2 fonctions du bouton edit
/ -> setSelectedIngredient(ingredient): ingredient à éditer
/ -> setShowEditModal(true): ouvre le formulaire d'édition
/ onDelete: efface l'ingrédient sélectionné
/
/ enfant:
/ IngredientCard (rôle: affiche les infos d'un ingrédient)
/
/ output props
/ ingredient
/ onEdit
/ onDelete
*/


export default function IngredientGrid({ items, onEdit, onDelete }) {
  return (
    <div className={styles.grid}>
      {items.map(ingredient => (
        <div key={ingredient.id} className={styles.link}>
          <IngredientCard
            ingredient={ingredient}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  );
}
