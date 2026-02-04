import {render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NavBar from './NavBar';


const renderNav = (props) => 
    render(
        <MemoryRouter>
            <NavBar {...props} />
        </MemoryRouter>
    )

test('shows Login when logged out', () => {
    renderNav({isLoggedIn: false, user: null})

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();
})

test('admin sees notify only', () => {
    renderNav({isLoggedIn: true, user: {role: 'admin'}})
    expect(screen.getByText('Notify')).toBeInTheDocument();
    expect(screen.queryByText('Home')).not.toBeInTheDocument()
})