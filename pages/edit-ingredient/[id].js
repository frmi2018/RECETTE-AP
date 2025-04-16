import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const EditIngredient = () => {
  const [ingredient, setIngredient] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchIngredient = async () => {
      const res = await fetch('/api/ingredients');
      const data = await res.json();
      const ingredient = data.find((item) => item.id === parseInt(id, 10));
      if (ingredient) {
        setIngredient(ingredient);
        setQuantity(ingredient.quantity || '');
        setPrice(ingredient.price || '');
      }
    };
    if (id) fetchIngredient();
  }, [id]);

  const saveIngredient = async () => {
    const updatedIngredient = { ...ingredient, quantity, price };
    const res = await fetch('/api/ingredients', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedIngredient),
    });
    if (res.ok) {
      router.push('/');
    }
  };

  if (!ingredient) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Edit Ingredient</h1>
      <div>
        <label>
          Name: <strong>{ingredient.text}</strong>
        </label>
      </div>
      <div>
        <label>
          Quantity:
          <input
            type="text"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            style={{ marginLeft: '10px' }}
          />
        </label>
      </div>
      <div>
        <label>
          Price:
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={{ marginLeft: '10px' }}
          />
        </label>
      </div>
      <button onClick={saveIngredient} style={{ marginTop: '20px' }}>
        Save
      </button>
    </div>
  );
};

export default EditIngredient;
