import { render, screen, fireEvent } from '@testing-library/react';
import CookingRecipe from '../pages/cooking-recipe';

describe('Cooking Recipe Page', () => {
  it('renders the page title', () => {
    render(<CookingRecipe />);
    expect(screen.getByText('Cooking Recipe')).toBeInTheDocument();
  });

  it('allows adding a new recipe step', async () => {
    render(<CookingRecipe />);
    const input = screen.getByPlaceholderText('Add a new step');
    const addButton = screen.getByText('Add');

    fireEvent.change(input, { target: { value: 'Preheat oven' } });
    fireEvent.click(addButton);

    expect(await screen.findByText('Preheat oven')).toBeInTheDocument();
  });

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
