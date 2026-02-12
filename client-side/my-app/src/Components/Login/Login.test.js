import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import userEvent from '@testing-library/user-event';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Login from './Login';

jest.mock('sweetalert2');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

global.fetch = jest.fn()

const navigateMock = jest.fn()

beforeEach(() => {
    useNavigate.mockReturnValue(navigateMock);
    fetch.mockClear();
    navigateMock.mockClear();
    Swal.fire.mockClear();
})

test('navigate to /admin for admin user', async () => {
    fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
            token: 'fake-token',
            user: {role: 'admin'},
        }),
    })

    const setIsLoggedIn = jest.fn();

    render(
        <MemoryRouter>
            <Login setIsLoggedIn={setIsLoggedIn} />
        </MemoryRouter>
    );
    await userEvent.type(screen.getByPlaceholderText(/email/i), 'admin@test.com' )
    await userEvent.type(screen.getByPlaceholderText(/password/i), 'password123' )

    fireEvent.click(screen.getByRole('button', {name: /submit/i}))

    await waitFor(() => {
        expect(navigateMock).toHaveBeenCalledWith('/admin')
    })
})
