import {render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Register from './Register'

test('renders all form fields', () => {
    render(
        <MemoryRouter>
            <Register />
        </MemoryRouter>

    )
    expect(screen.getByPlaceholderText(/first name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/last name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter phone no/i)).toBeInTheDocument();
    expect(screen.getByRole('button', {name: /submit/i})).toBeInTheDocument();
})

test('shows error when passwords do not match', async () => {
    render(
        <MemoryRouter>
            <Register />
        </MemoryRouter>
    )
    await userEvent.type(screen.getByPlaceholderText(/enter password/i), 'password123');
    await userEvent.type(screen.getByPlaceholderText(/confirm password/i), 'password321');
    fireEvent.blur(screen.getByPlaceholderText(/confirm password/i));

    expect(await screen.findByText(/passwords must match/i)).toBeInTheDocument()
})