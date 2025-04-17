import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const TodoList = () => {
  const [tasks, setTasks] = useState([]); // Ensure tasks is initialized as an array
  const [task, setTask] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [availableIngredients, setAvailableIngredients] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch('/api/ingredients');
        if (!res.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await res.json();
        setTasks(Array.isArray(data) ? data : []); // Ensure data is an array
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setTasks([]); // Fallback to an empty array on error
      }
    };
    fetchTasks();
  }, []);

  useEffect(() => {
    const fetchRecipesAndIngredients = async () => {
      try {
        const recipesRes = await fetch('/api/cooking-recipe');
        const ingredientsRes = await fetch('/api/ingredients');

        if (!recipesRes.ok || !ingredientsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const recipesData = await recipesRes.json();
        const ingredientsData = await ingredientsRes.json();

        setRecipes(recipesData);
        setAvailableIngredients(ingredientsData);

        const availableIngredientNames = ingredientsData
          .filter((ingredient) => parseInt(ingredient.quantity, 10) > 0)
          .map((ingredient) => ingredient.text);

        const fullyAvailableRecipes = recipesData.filter((recipe) =>
          recipe.ingredients.every((ingredient) => availableIngredientNames.includes(ingredient))
        );

        const prioritizedRecipes = [];
        const types = ['starter', 'main', 'dessert'];

        types.forEach((type) => {
          const recipeOfType = fullyAvailableRecipes.find((recipe) => recipe.type === type);
          if (recipeOfType) {
            prioritizedRecipes.push(recipeOfType);
          }
        });

        const additionalRecipes = fullyAvailableRecipes.filter(
          (recipe) => !prioritizedRecipes.includes(recipe)
        );

        setFilteredRecipes([...prioritizedRecipes, ...additionalRecipes].slice(0, 3));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchRecipesAndIngredients();
  }, []);

  const addTask = async () => {
    if (task.trim()) {
      const newTask = { id: Date.now(), text: task, completed: false };
      const res = await fetch('/api/ingredients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      if (res.ok) {
        setTasks([...tasks, newTask]);
        setTask('');
      }
    }
  };

  const deleteTask = async (id) => {
    const res = await fetch(`/api/ingredients?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setTasks(tasks.filter((t) => t.id !== id));
    }
  };

  const toggleTaskCompletion = async (id) => {
    const updatedTasks = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);

    await fetch('/api/ingredients', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTasks),
    });
  };

  const openModal = (recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRecipe(null);
    setIsModalOpen(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <nav>
        <Link href="/ingredients">Ingredients</Link> | <Link href="/cooking-recipe">Cooking Recipe</Link> | <Link href="/ingredients-low">Low Quantity Ingredients</Link>
      </nav>
      <h1>Featured Recipes</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredRecipes.map((recipe) => (
          <li key={recipe.id} style={{ marginBottom: '10px', border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
            <h3>{recipe.text}</h3>
            <p>Ingredients: {recipe.ingredients.join(', ')}</p>
            <button onClick={() => openModal(recipe)} style={{ marginTop: '10px' }}>
              Show Steps
            </button>
          </li>
        ))}
      </ul>

      {isModalOpen && selectedRecipe && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '5px', width: '80%', maxWidth: '500px' }}>
            <h2>Steps for {selectedRecipe.text}</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {selectedRecipe.steps.map((step, index) => (
                <li key={index} style={{ marginBottom: '10px' }}>
                  Step {index + 1}: {step.text}
                </li>
              ))}
            </ul>
            <button onClick={closeModal} style={{ marginTop: '10px', padding: '10px 20px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '5px' }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoList;
