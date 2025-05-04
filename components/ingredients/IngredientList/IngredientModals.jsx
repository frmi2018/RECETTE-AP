import AddIngredientModal from "../../elements/Forms/AddIngredientForm/AddIngredientForm";
import EditIngredientModal from "../../elements/Forms/UpdateIngredientForm/UpdateIngredientForm";

export default function IngredientModals({
  showAdd,
  showEdit,
  ingredient,
  onCloseAdd,
  onCloseEdit,
  onAdded,
  onUpdated,
}) {
  return (
    <>
      {showAdd && (
        <AddIngredientModal onClose={onCloseAdd} onIngredientAdded={onAdded} />
      )}
      {showEdit && (
        <EditIngredientModal onCloseUpdate={onCloseEdit} onIngredientUpdated={onUpdated} ingredient={ingredient}/>
      )}
    </>
  );
}
