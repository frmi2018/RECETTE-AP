import { useEffect, useState } from "react";
import { fetchBrands } from "@/lib/api-brands";

export default function BrandInput({ value, onChange }) {
  const [brandOptions, setBrandOptions] = useState([]);

  useEffect(() => {
    const loadBrands = async () => {
      try {
        const data = await fetchBrands(); // Utiliser fetchBrands sans path (car tu fais déjà l'appel à "/api/brands" dans cette fonction)
        setBrandOptions(data.brands); // data contient maintenant les marques
      } catch (error) {
        console.error("Erreur lors du chargement des marques :", error);
      }
    };

    loadBrands();
  }, []);

  return (
    <div>
      <label htmlFor="marque">Marque</label>
      <input
        list="brand-options"
        name="marque"
        id="marque"
        value={value}
        onChange={onChange}
      />
      <datalist id="brand-options">
        {brandOptions.map((brand, index) => (
          <option key={index} value={brand} />
        ))}
      </datalist>
    </div>
  );
}
