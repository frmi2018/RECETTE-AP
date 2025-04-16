import fs from 'fs';
import path from 'path';

const filePath = path.resolve(process.cwd(), 'data', 'cooking-recipe.json');

const readTasks = () => {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const data = fs.readFileSync(filePath, 'utf-8');
  try {
    const tasks = JSON.parse(data);
    return Array.isArray(tasks) ? tasks : []; // Ensure tasks is an array
  } catch {
    return []; // Fallback to an empty array if JSON is invalid
  }
};

const writeTasks = (tasks) => {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2), 'utf-8');
};

const addTypeToRecipe = (recipe) => {
  if (!recipe.type) {
    recipe.type = 'main'; // Default to 'main' if type is not provided
  }
  return recipe;
};

const addStepsToRecipe = (recipe) => {
  if (!recipe.steps) {
    recipe.steps = []; // Initialize steps if not provided
  }
  return recipe;
};

export default function handler(req, res) {
  if (req.method === 'GET') {
    const tasks = readTasks();
    res.status(200).json(tasks);
  } else if (req.method === 'POST') {
    const tasks = readTasks();
    const newTask = addStepsToRecipe(req.body);
    tasks.push(newTask);
    writeTasks(tasks);
    res.status(201).json(newTask);
  } else if (req.method === 'PUT') {
    const tasks = readTasks();
    const updatedRecipe = addStepsToRecipe(req.body);
    const updatedTasks = tasks.map((task) =>
      task.id === updatedRecipe.id ? updatedRecipe : task
    );
    writeTasks(updatedTasks);
    res.status(200).json({ message: 'Recipe updated' });
  } else if (req.method === 'DELETE') {
    const tasks = readTasks();
    const { id } = req.query;
    const updatedTasks = tasks.filter((task) => task.id !== parseInt(id, 10));
    writeTasks(updatedTasks);
    res.status(200).json({ message: 'Recipe deleted' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
