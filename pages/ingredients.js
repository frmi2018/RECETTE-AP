import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const IngredientsPage = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [filterLetter, setFilterLetter] = useState(''); // Filter by first letter
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const itemsPerPage = 6; // Number of items per page
  const router = useRouter();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch('/api/ingredients');
        if (!res.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await res.json();
        setTasks(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setTasks([]);
      }
    };

    const fetchRecipes = async () => {
      try {
        const res = await fetch('/api/cooking-recipe');
        if (!res.ok) {
          throw new Error('Failed to fetch recipes');
        }
        const data = await res.json();
        setRecipes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setRecipes([]);
      }
    };

    fetchTasks();
    fetchRecipes();
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

  const isIngredientUsed = (ingredientText) => {
    return recipes.some((recipe) => recipe.ingredients && recipe.ingredients.includes(ingredientText));
  };

  // Filter and sort ingredients
  const filteredIngredients = tasks
    .filter((ingredient) =>
      filterLetter === '' || ingredient.text.toLowerCase().startsWith(filterLetter.toLowerCase())
    ) // Filter by letter
    .sort((a, b) => a.text.localeCompare(b.text)); // Sort alphabetically

  // Pagination logic
  const totalPages = Math.ceil(filteredIngredients.length / itemsPerPage);
  const paginatedIngredients = filteredIngredients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <nav>
        <Link href="/">Home</Link> | <Link href="/cooking-recipe">Cooking Recipe</Link> | <Link href="/ingredients-low">Low Quantity Ingredients</Link>
      </nav>
      <h1>Ingredients</h1>
      <div>
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Add a new ingredient"
          style={{ padding: '10px', width: '80%' }}
        />
        <button onClick={addTask} style={{ padding: '10px', marginLeft: '10px' }}>
          Add
        </button>
      </div>

      {/* Filter by Letter */}
      <div style={{ marginBottom: '20px' }}>
        <label>
          Filter by Letter:
          <input
            type="text"
            value={filterLetter}
            onChange={(e) => setFilterLetter(e.target.value)}
            maxLength="1"
            style={{ marginLeft: '10px', width: '30px' }}
          />
        </label>
      </div>

      <ul style={{ listStyle: 'none', padding: 0, marginTop: '20px' }}>
        {paginatedIngredients.map((t) => (
          <li
            key={t.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px',
              textDecoration: t.completed ? 'line-through' : 'none',
            }}
          >
            <span onClick={() => toggleTaskCompletion(t.id)} style={{ cursor: 'pointer' }}>
              {t.text} (Quantity: {t.quantity || 0})
            </span>
            <div>
              <button onClick={() => router.push(`/edit-ingredient/${t.id}`)} style={{ marginLeft: '10px' }}>
                Edit
              </button>
              <button
                onClick={() => deleteTask(t.id)}
                style={{ marginLeft: '10px' }}
                disabled={isIngredientUsed(t.text)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <button onClick={goToPreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={goToNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default IngredientsPage;