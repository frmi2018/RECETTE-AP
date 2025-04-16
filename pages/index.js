import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const TodoList = () => {
  const [tasks, setTasks] = useState([]); // Ensure tasks is initialized as an array
  const [task, setTask] = useState('');
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

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <nav>
        <Link href="/">Ingredients</Link> | <Link href="/cooking-recipe">Cooking Recipe</Link> | <Link href="/ingredients-low">Low Quantity Ingredients</Link>
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
      <ul style={{ listStyle: 'none', padding: 0, marginTop: '20px' }}>
        {tasks.map((t) => (
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
              <button onClick={() => deleteTask(t.id)} style={{ marginLeft: '10px' }}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
