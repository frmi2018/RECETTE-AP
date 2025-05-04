import AddIngredientForm from "../../elements/Forms/AddIngredientForm/AddIngredientForm";
import UpdateIngredientForm from "../../elements/Forms/UpdateIngredientForm/UpdateIngredientForm";

export default function IngredientModals({
  showModal,
  showEditModal,
  ingredient,
  onClose,
  onCloseUpdate,
  onAdded,
  onUpdated,
}) {
  return (
    <>
      {showModal && (
        <AddIngredientForm onClose={onClose} onAdded={onAdded} />
      )}
      {showEditModal && (
        <UpdateIngredientForm onCloseUpdate={onCloseUpdate} onUpdated={onUpdated} ingredient={ingredient}/>
      )}
    </>
  );
}
