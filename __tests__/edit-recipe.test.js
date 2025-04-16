import { render, screen, fireEvent } from '@testing-library/react';
import EditRecipe from '../pages/edit-recipe/[id]';

// Test de la page d'édition des recettes
// Vérifie que le titre de la page s'affiche correctement
it('renders the recipe title', () => {
  const recipe = { id: 1, text: 'Tarte aux pommes', ingredients: [], steps: [] };
  render(<EditRecipe recipe={recipe} />);
  expect(screen.getByText('Edit Recipe')).toBeInTheDocument();
});

// Vérifie qu'une nouvelle étape peut être ajoutée
it('allows adding a new step', () => {
  const recipe = { id: 1, text: 'Tarte aux pommes', ingredients: [], steps: [] };
  render(<EditRecipe recipe={recipe} />);

  const addStepButton = screen.getByText('Add Step');
  fireEvent.click(addStepButton);

  expect(screen.getByPlaceholderText('Enter step description')).toBeInTheDocument();
});

// Vérifie qu'une étape peut être modifiée
it('allows editing a step', () => {
  const recipe = {
    id: 1,
    text: 'Tarte aux pommes',
    ingredients: [],
    steps: [{ number: 1, text: 'Preheat the oven to 180°C.' }],
  };
  render(<EditRecipe recipe={recipe} />);

  const stepInput = screen.getByDisplayValue('Preheat the oven to 180°C.');
  fireEvent.change(stepInput, { target: { value: 'Preheat the oven to 200°C.' } });

  expect(screen.getByDisplayValue('Preheat the oven to 200°C.')).toBeInTheDocument();
});

// Vérifie qu'une étape peut être supprimée
it('allows deleting a step', () => {
  const recipe = {
    id: 1,
    text: 'Tarte aux pommes',
    ingredients: [],
    steps: [
      { number: 1, text: 'Preheat the oven to 180°C.' },
      { number: 2, text: 'Mix the flour and eggs.' },
    ],
  };
  render(<EditRecipe recipe={recipe} />);

  const deleteButton = screen.getAllByText('Delete')[0];
  fireEvent.click(deleteButton);

  expect(screen.queryByText('Preheat the oven to 180°C.')).not.toBeInTheDocument();
  expect(screen.getByText('Step 1: Mix the flour and eggs.')).toBeInTheDocument();
});