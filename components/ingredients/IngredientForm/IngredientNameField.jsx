export default function IngredientNameField({ value, onChange }) {
    return (
      <div className="col-full form-field">
        <span>Nom</span>
        <input
          className="col-3"
          name="nom"
          placeholder="Nom"
          value={value}
          onChange={onChange}
          required
        />
      </div>
    );
  }
  