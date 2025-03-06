import React, { useState } from 'react';
import { FaHome } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import './nav.css';
const navItems = [
    {item: 'Home', icon: <FaHome />},
    {item: 'Contact', icon: <FaPhoneAlt />},
    {item: 'Profile', icon: <FaUser />},
    {item: 'Reservation', icon: <FaShoppingCart />}
]
const NavBar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
  return (
    <nav className='navParentContainer'>
        <ul className='navContainer'>
            {navItems.map((element, index) => (
                <div key={index} className='listcontainer'>
                    <div>{element.icon}</div>
                    
                    <li>{element.item}</li>
                </div>
            ))}
        </ul>
    </nav>
  )
}

export default NavBar