import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const CookingRecipe = () => {
  const [tasks, setTasks] = useState([]); // Ensure tasks is initialized as an array
  const [task, setTask] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch('/api/cooking-recipe');
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

  const addTask = async () => {
    if (task.trim()) {
      const newTask = { id: Date.now(), text: task, completed: false };
      const res = await fetch('/api/cooking-recipe', {
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
    const res = await fetch(`/api/cooking-recipe?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setTasks(tasks.filter((t) => t.id !== id));
    }
  };

  const toggleTaskCompletion = async (id) => {
    const updatedTasks = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);

    await fetch('/api/cooking-recipe', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTasks),
    });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <nav>
        <Link href="/">Ingredients</Link> | <Link href="/cooking-recipe">Cooking Recipe</Link>
      </nav>
      <h1>Cooking Recipe</h1>
      <div>
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Add a new step"
          style={{ padding: '10px', width: '80%' }}
        />
        <button onClick={addTask} style={{ padding: '10px', marginLeft: '10px' }}>
          Add
        </button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, marginTop: '20px' }}>
        {tasks.map((t) => (
          <li
            key={t.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginBottom: '20px',
              border: '1px solid #ccc',
              padding: '10px',
              borderRadius: '5px',
            }}
          >
            <span>
              {t.text} ({t.type || 'main'})
            </span>
            <span
              style={{
                color: t.ingredients && t.ingredients.filter((i) => parseInt(i.quantity, 10) > 1).length > 0 ? 'green' : 'red',
              }}
            >
              Number of Ingredients: {t.ingredients ? t.ingredients.length : 0}
            </span>
            <span>Number of Steps: {t.steps ? t.steps.length : 0}</span>
            <button onClick={() => router.push(`/edit-recipe/${t.id}`)} style={{ marginTop: '10px' }}>
              Edit Recipe
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CookingRecipe;
