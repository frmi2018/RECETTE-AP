import IngredientCard from "../../elements/IngredientCard";
import styles from "./IngredientList.module.css";

export default function IngredientGrid({ items, onEdit, onDelete }) {
  return (
    <div className={styles.grid}>
      {items.map(ingredient => (
        <div key={ingredient.id} className={styles.link}>
          <IngredientCard
            ingredient={ingredient}
            setShowEditIngredientModal={onEdit}
            handleDelete={onDelete}
          />
        </div>
      ))}
    </div>
  );
}
