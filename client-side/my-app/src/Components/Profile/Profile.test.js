import {render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Profile from './Profile';

test('renders user name and greeting', () => {
    render(
        <MemoryRouter>
            <Profile
                user={{first_name: 'Annette', second_name: 'Adhiambo', id: '123'}}
                setIsLoggedIn={jest.fn()}
             />
        </MemoryRouter>
    )
    expect(screen.getByText('Annette Adhiambo')).toBeInTheDocument();
    expect(screen.getByText(/here are your available bookings/i)).toBeInTheDocument()
})