import { render, screen, fireEvent } from '@testing-library/react';
import CookingRecipe from '../pages/cooking-recipe';

// Test de la page des recettes de cuisine
describe('Cooking Recipe Page', () => {
  // Vérifie que le titre de la page s'affiche correctement
  it('renders the page title', () => {
    render(<CookingRecipe />);
    expect(screen.getByText('Cooking Recipe')).toBeInTheDocument();
  });

  // Vérifie qu'une nouvelle étape de recette peut être ajoutée
  it('allows adding a new recipe step', async () => {
    render(<CookingRecipe />);
    const input = screen.getByPlaceholderText('Add a new step');
    const addButton = screen.getByText('Add');

    fireEvent.change(input, { target: { value: 'Preheat oven' } });
    fireEvent.click(addButton);

    expect(await screen.findByText('Preheat oven')).toBeInTheDocument();
  });

  // Vérifie qu'une étape de recette peut être supprimée
  it('allows deleting a recipe step', async () => {
    render(<CookingRecipe />);
    const input = screen.getByPlaceholderText('Add a new step');
    const addButton = screen.getByText('Add');

    fireEvent.change(input, { target: { value: 'Preheat oven' } });
    fireEvent.click(addButton);

    const deleteButton = await screen.findByText('Delete');
    fireEvent.click(deleteButton);

    expect(screen.queryByText('Preheat oven')).not.toBeInTheDocument();
  });
});
