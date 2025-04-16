import { render, screen, fireEvent } from '@testing-library/react';
import TodoList from '../pages/index';

describe('Ingredients Page', () => {
  it('renders the page title', () => {
    render(<TodoList />);
    expect(screen.getByText('Ingredients')).toBeInTheDocument();
  });

  it('allows adding a new ingredient', async () => {
    render(<TodoList />);
    const input = screen.getByPlaceholderText('Add a new ingredient');
    const addButton = screen.getByText('Add');

    fireEvent.change(input, { target: { value: 'Tomato' } });
    fireEvent.click(addButton);

    expect(await screen.findByText('Tomato')).toBeInTheDocument();
  });

  it('allows deleting an ingredient', async () => {
    render(<TodoList />);
    const input = screen.getByPlaceholderText('Add a new ingredient');
    const addButton = screen.getByText('Add');

    fireEvent.change(input, { target: { value: 'Tomato' } });
    fireEvent.click(addButton);

    const deleteButton = await screen.findByText('Delete');
    fireEvent.click(deleteButton);

    expect(screen.queryByText('Tomato')).not.toBeInTheDocument();
  });
});
