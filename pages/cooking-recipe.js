import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const CookingRecipe = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');
  const [availableIngredients, setAvailableIngredients] = useState([]);
  const [filterType, setFilterType] = useState('all'); // Filter by type
  const [filterLetter, setFilterLetter] = useState(''); // Filter by first letter
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [selectedRecipe, setSelectedRecipe] = useState(null); // For recipe modal
  const [selectedSteps, setSelectedSteps] = useState(null); // For steps modal
  const itemsPerPage = 6; // Number of items per page
  const router = useRouter();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch('/api/cooking-recipe');
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
    fetchTasks();
  }, []);

  useEffect(() => {
    const fetchAvailableIngredients = async () => {
      try {
        const res = await fetch('/api/ingredients');
        if (!res.ok) {
          throw new Error('Failed to fetch available ingredients');
        }
        const data = await res.json();
        setAvailableIngredients(data);
      } catch (error) {
        console.error('Error fetching available ingredients:', error);
        setAvailableIngredients([]);
      }
    };

    fetchAvailableIngredients();
  }, []);

  const calculateIngredientAvailability = (recipeIngredients) => {
    const available = [];
    const unavailable = [];

    recipeIngredients.forEach((ingredient) => {
      const foundIngredient = availableIngredients.find((task) => task.text === ingredient);
      if (foundIngredient && parseInt(foundIngredient.quantity, 10) > 0) {
        available.push(ingredient);
      } else {
        unavailable.push(ingredient);
      }
    });

    return { available, unavailable };
  };




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

    // Filter and sort recipes
    const filteredTasks = tasks
    .filter((t) => (filterType === 'all' || t.type === filterType)) // Filter by type
    .filter((t) => (filterLetter === '' || t.text.toLowerCase().startsWith(filterLetter.toLowerCase()))) // Filter by letter
    .sort((a, b) => a.text.localeCompare(b.text)); // Sort alphabetically

  // Pagination logic
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const paginatedTasks = filteredTasks.slice(
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
        <Link href="/">Home</Link> | <Link href="/ingredients">Ingredients</Link> | <Link href="/ingredients-low">Low Quantity Ingredients</Link>
      </nav>
      <h1>Cooking Recipe</h1>
      <div>
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Add a new recipe"
          style={{ padding: '10px', width: '80%' }}
        />
        <button onClick={addTask} style={{ padding: '10px', marginLeft: '10px' }}>
          Add
        </button>
      </div>

      {/* Filters */}
      <div style={{ marginBottom: '20px' }}>
        <label>
          Filter by Type:
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ marginLeft: '10px' }}>
            <option value="all">All</option>
            <option value="starter">Starter</option>
            <option value="main">Main Course</option>
            <option value="dessert">Dessert</option>
          </select>
        </label>

            {/* Filter by Letter */}
        <label style={{ marginLeft: '20px' }}>
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
        {paginatedTasks.map((t) => {
          const { available, unavailable } = calculateIngredientAvailability(t.ingredients || []);

          return (
            <li
              key={t.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px',
                border: '1px solid #ccc',
                padding: '10px',
                borderRadius: '5px',
              }}
            >
              <span>
                {t.text} - <span style={{ color: 'green' }}>{available.length}</span> /{' '}
                <span style={{ color: 'red' }}>{unavailable.length}</span>
              </span>
              <div>
                <button onClick={() => setSelectedRecipe(t)} style={{ marginRight: '10px' }}>
                  Show
                </button>
                <button onClick={() => setSelectedSteps(t.steps || [])} style={{ marginRight: '10px' }}>
                  Step
                </button>
                <button onClick={() => router.push(`/edit-recipe/${t.id}`)} style={{ marginRight: '10px' }}>
                  Edit
                </button>
                <button
                  onClick={() => {
                    const confirmDelete = window.confirm('Are you sure you want to delete this recipe?');
                    if (confirmDelete) {
                      fetch(`/api/cooking-recipe?id=${t.id}`, { method: 'DELETE' }).then(() => {
                        setTasks(tasks.filter((task) => task.id !== t.id));
                      });
                    }
                  }}
                  style={{ backgroundColor: 'red', color: 'white' }}
                >
                  Delete
                </button>
              </div>
            </li>
          );
        })}
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

      {/* Recipe Modal */}
      {selectedRecipe && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            zIndex: 1000,
          }}
        >
          <h2>{selectedRecipe.text}</h2>
          <p>Type: {selectedRecipe.type || 'N/A'}</p>
          <h3>Ingredients:</h3>
          <ul>
            {(selectedRecipe.ingredients || []).map((ingredient, index) => (
              // Ensure ingredient is a string or extract the relevant property
              <li key={index}>{typeof ingredient === 'object' ? ingredient.text : ingredient}</li>
            ))}
          </ul>
          <button onClick={() => setSelectedRecipe(null)} style={{ marginTop: '10px' }}>
            Close
          </button>
        </div>
      )}

      {/* Steps Modal */}
      {selectedSteps && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            zIndex: 1000,
          }}
        >
          <h3>Steps:</h3>
          <ul>
            {selectedSteps.map((step, index) => (
              // Ensure step is a string or extract the relevant property
              <li key={index}>{typeof step === 'object' ? step.text : step}</li>
            ))}
          </ul>
          <button onClick={() => setSelectedSteps(null)} style={{ marginTop: '10px' }}>
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default CookingRecipe;
