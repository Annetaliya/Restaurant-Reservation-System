import {render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Swal from 'sweetalert2';
import Register from './Register'



jest.mock('sweetalert2');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
}));


global.fetch = jest.fn();
const navigateMock = jest.fn();
useNavigate.mockReturnValue(navigateMock);



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



test('shows error when submitting empty values', async () => {
    fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({error: 'Validation error'})
    })
    
    render(
        <MemoryRouter>
            <Register />
        </MemoryRouter>
    )
    fireEvent.click(screen.getByRole('button', {name: /submit/i}))
    await waitFor(() => {
        expect(Swal.fire).toHaveBeenCalledWith(
            expect.objectContaining({
                title: 'Error',
                icon: 'error'
            })
        )
    })

    
})






