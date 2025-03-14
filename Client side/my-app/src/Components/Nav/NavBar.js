import React, { useState } from 'react';
import { FaHome } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { TiThMenu } from "react-icons/ti";
import './nav.css';


const navItems = [
    {item: 'Home', icon: <FaHome />, path: '/'},
    {item: 'Contact', icon: <FaPhoneAlt />, path: '/contact'},
    {item: 'Profile', icon: <FaUser />, path: '/profile'},
    {item: 'Reservation', icon: <FaShoppingCart />, path: '/reservat'}
]
const NavBar = ({ isLoggedIn }) => {
    const [showMenu, setShowMenu] = useState(false);


    function handleToggleMenu() {
        setShowMenu(!showMenu)
        console.log(showMenu)
    }
  return (
    <nav className='navParentContainer'>
       
        <ul className={`navContainer ${showMenu ? 'menuMobile' : ''}`}>
            {navItems
            .filter((element) => isLoggedIn || element.item !== 'Profile' )
            .map((element, index) => (
                <div key={index} className='listcontainer'>
                    <div>{element.icon}</div>
                    
                    
                    <a href={element.path}>
                        <li>{element.item}</li>
                    </a>
                </div>
            ))}
        </ul>
        <div className='menu' onClick={handleToggleMenu}>
            <TiThMenu  size={35} />
        </div>
        
    </nav>
  )
}

export default NavBar