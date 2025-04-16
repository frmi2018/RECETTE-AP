import { useState, useEffect } from 'react';
import Link from 'next/link';

const IngredientsLow = () => {
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const res = await fetch('/api/ingredients');
        if (!res.ok) {
          throw new Error('Failed to fetch ingredients');
        }
        const data = await res.json();
        const lowQuantityIngredients = data.filter((ingredient) => parseFloat(ingredient.quantity) < 1);
        setIngredients(lowQuantityIngredients);
      } catch (error) {
        console.error('Error fetching ingredients:', error);
        setIngredients([]); // Fallback to an empty array on error
      }
    };
    fetchIngredients();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Ingredients with Low Quantity</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {ingredients.map((ingredient) => (
          <li key={ingredient.id} style={{ marginBottom: '10px' }}>
            {ingredient.text} (Quantity: {ingredient.quantity || 0})
          </li>
        ))}
      </ul>
      <Link href="/">
        <button style={{ marginTop: '20px', padding: '10px 20px' }}>Return to Main Page</button>
      </Link>
    </div>
  );
};

export default IngredientsLow;