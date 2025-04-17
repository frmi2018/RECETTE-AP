import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const EditRecipe = () => {
  const [recipe, setRecipe] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [availableIngredients, setAvailableIngredients] = useState([]);
  const [type, setType] = useState('main'); // Default to 'main'
  const [steps, setSteps] = useState([]); // Manage preparation steps
  const [showAvailableIngredients, setShowAvailableIngredients] = useState(false); // Manage visibility of available ingredients
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
        setType(recipe.type || 'main'); // Set type if available
        setSteps(recipe.steps || []); // Load steps if available
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

  const addStep = () => {
    const newStep = { number: steps.length + 1, text: '' };
    setSteps([...steps, newStep]);
  };

  const editStep = (number, newText) => {
    const updatedSteps = steps.map((step) =>
      step.number === number ? { ...step, text: newText } : step
    );
    setSteps(updatedSteps);
  };

  const deleteStep = (number) => {
    const updatedSteps = steps
      .filter((step) => step.number !== number)
      .map((step, index) => ({ ...step, number: index + 1 })); // Renumber steps
    setSteps(updatedSteps);
  };

  const saveRecipe = async () => {
    const updatedRecipe = { ...recipe, ingredients, type, steps };
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
      <nav>
        <Link href="/">Home</Link> | <Link href="/ingredients">Ingredients</Link> | <Link href="/cooking-recipe">Cooking Recipe</Link> | <Link href="/ingredients-low">Low Quantity Ingredients</Link>
      </nav>
      <h1>Edit Recipe</h1>
      <div>
        <label>
          Name: <strong>{recipe.text}</strong>
        </label>
      </div>
      <div>
        <label>
          Type:
          <select value={type} onChange={(e) => setType(e.target.value)} style={{ marginLeft: '10px' }}>
            <option value="starter">Starter</option>
            <option value="main">Main Course</option>
            <option value="dessert">Dessert</option>
          </select>
        </label>
      </div>
      <div>
        <h2>Selected Ingredients</h2>
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px' }}>
          {ingredients.map((ingredient, index) => (
            <li key={index} style={{ marginBottom: '5px', display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '10px' }}>{ingredient}</span>
              <button onClick={() => toggleIngredient(ingredient)} style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>
                Remove
              </button>
            </li>
          ))}
        </ul>
        <button onClick={() => setShowAvailableIngredients(!showAvailableIngredients)} style={{ marginTop: '10px' }}>
          {showAvailableIngredients ? 'Hide Available Ingredients' : 'Add Ingredient'}
        </button>
        {showAvailableIngredients && (
          <div style={{ marginTop: '10px' }}>
            <h3>Available Ingredients</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {availableIngredients
                .filter((ingredient) => !ingredients.includes(ingredient.text))
                .map((ingredient) => (
                  <li key={ingredient.id} style={{ marginBottom: '5px' }}>
                    <label>
                      <input
                        type="checkbox"
                        onChange={() => toggleIngredient(ingredient.text)}
                      />
                      {ingredient.text}
                    </label>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
      <div>
        <h2>Preparation Steps</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {steps.map((step) => (
            <li key={step.number} style={{ marginBottom: '10px' }}>
              <span>Step {step.number}: </span>
              <input
                type="text"
                value={step.text}
                onChange={(e) => editStep(step.number, e.target.value)}
                placeholder="Enter step description"
                style={{ marginRight: '10px' }}
              />
              <button onClick={() => deleteStep(step.number)}>Delete</button>
            </li>
          ))}
        </ul>
        <button onClick={addStep} style={{ marginTop: '10px' }}>Add Step</button>
      </div>
      <button onClick={saveRecipe} style={{ marginTop: '20px' }}>
        Save
      </button>
    </div>
  );
};

export default EditRecipe;
