import AddIngredientModal from "./AddIngredientModal";
import EditIngredientModal from "./EditIngredientModal";

export default function IngredientModals({
  showAdd,
  showEdit,
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
        <EditIngredientModal onCloseUpdate={onCloseEdit} onIngredientUpdated={onUpdated} />
      )}
    </>
  );
}
