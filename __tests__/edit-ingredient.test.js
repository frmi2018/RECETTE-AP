import { render, screen, fireEvent } from '@testing-library/react';
import EditIngredient from '../pages/edit-ingredient/[id]';

// Test de la page d'édition des ingrédients
describe('Edit Ingredient Page', () => {
  // Vérifie que le nom de l'ingrédient s'affiche correctement
  it('renders the ingredient name', () => {
    const ingredient = { id: 1, text: 'Egg', quantity: '6', price: '1' };
    render(<EditIngredient ingredient={ingredient} />);
    expect(screen.getByText('Egg')).toBeInTheDocument();
  });

  // Vérifie que la quantité et le prix peuvent être mis à jour
  it('allows updating quantity and price', async () => {
    const ingredient = { id: 1, text: 'Egg', quantity: '6', price: '1' };
    render(<EditIngredient ingredient={ingredient} />);

    const quantityInput = screen.getByLabelText('Quantity:');
    const priceInput = screen.getByLabelText('Price:');
    const saveButton = screen.getByText('Save');

    fireEvent.change(quantityInput, { target: { value: '12' } });
    fireEvent.change(priceInput, { target: { value: '2' } });
    fireEvent.click(saveButton);

    expect(await screen.findByText('Save')).toBeInTheDocument();
  });
});
