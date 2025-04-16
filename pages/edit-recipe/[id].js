import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const EditRecipe = () => {
  const [recipe, setRecipe] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [availableIngredients, setAvailableIngredients] = useState([]);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchRecipe = async () => {
      const res = await fetch('/api/cooking-recipe');
      const data = await res.json();
      const recipe = data.find((item) => item.id === parseInt(id, 10));
      if (recipe) {
        setRecipe(recipe);
        setIngredients(recipe.ingredients || []);
      }
    };

    const fetchAvailableIngredients = async () => {
      const res = await fetch('/api/ingredients');
      const data = await res.json();
      setAvailableIngredients(data);
    };

    if (id) {
      fetchRecipe();
      fetchAvailableIngredients();
    }
  }, [id]);

  const saveRecipe = async () => {
    const updatedRecipe = { ...recipe, ingredients };
    const res = await fetch('/api/cooking-recipe', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedRecipe),
    });
    if (res.ok) {
      router.push('/cooking-recipe');
    }
  };

  const toggleIngredient = (ingredient) => {
    if (ingredients.includes(ingredient)) {
      setIngredients(ingredients.filter((i) => i !== ingredient));
    } else {
      setIngredients([...ingredients, ingredient]);
    }
  };

  if (!recipe) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Edit Recipe</h1>
      <div>
        <label>
          Name: <strong>{recipe.text}</strong>
        </label>
      </div>
      <div>
        <label>
          Ingredients:
          <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px' }}>
            {availableIngredients.map((ingredient) => (
              <li key={ingredient.id} style={{ marginBottom: '5px' }}>
                <label>
                  <input
                    type="checkbox"
                    checked={ingredients.includes(ingredient.text)}
                    onChange={() => toggleIngredient(ingredient.text)}
                  />
                  {ingredient.text}
                </label>
              </li>
            ))}
          </ul>
        </label>
      </div>
      <button onClick={saveRecipe} style={{ marginTop: '20px' }}>
        Save
      </button>
    </div>
  );
};

export default EditRecipe;
