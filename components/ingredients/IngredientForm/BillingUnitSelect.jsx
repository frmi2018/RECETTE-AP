export default function BillingUnitSelect({ value, onChange }) {
    const options = ["unité", "poids", "volume"];
  
    return (
      <div>
        <span>Unité de facturation</span>
        <select name="unite_facturation" value={value} onChange={onChange}>
          {!value && <option value="">Sélectionner une unité</option>}
          {value && (
            <option value={value}>
              {value === "unité"
                ? "Unité"
                : value === "poids"
                ? "Poids"
                : "Volume"}
            </option>
          )}
          {options
            .filter(option => option !== value)
            .map(option => (
              <option key={option} value={option}>
                {option === "unité"
                  ? "Unité"
                  : option === "poids"
                  ? "Poids"
                  : "Volume"}
              </option>
            ))}
        </select>
      </div>
    );
  }
  