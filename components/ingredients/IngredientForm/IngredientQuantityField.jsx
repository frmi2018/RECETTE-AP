export default function IngredientQuantityField({ quantity, unit, onChange }) {
    return (
      <div className="col-full form-field">
        {/* Quantité */}
        <div className="col-2">
          <span>Qté</span>
          <input
            name="quantité"
            type="number"
            min="0"
            step="1"
            value={quantity}
            onChange={onChange}
          />
        </div>
  
        {/* Unité */}
        <div className="col-2">
          <span>Unité</span>
          <input
            name="unité"
            placeholder="Unité"
            value={unit}
            onChange={onChange}
          />
        </div>
      </div>
    );
  }
  