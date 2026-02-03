import {render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event';
import Home from './Home';
import { MemoryRouter } from 'react-router-dom';

const mockTables = [
    {
        id: 1,
        table_no: 'Table No 1',
        seats: 4,
        status: 'available'
    
    }
]

test('renders welcome mesage with user name', () => {
    localStorage.setItem('user', JSON.stringify({
        first_name: 'Annette', role: 'user'
    })
)
render(
    <MemoryRouter>
        <Home reservationTable={[]} setReservationTable={jest.fn()} />

    </MemoryRouter>

)
expect(screen.getByText(/welcome/i)).toBeInTheDocument()
expect(screen.getByText(/annette/i)).toBeInTheDocument()
})

test('shows no tables message when no tables match selection', () => {
    render(
        <MemoryRouter>
            <Home reservationTable={mockTables} setReservationTable={jest.fn()} />

        </MemoryRouter>
    
)
    expect(screen.getByText(/no tables available/i)).toBeInTheDocument()
})