import React from 'react';
import { FaHome } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { IoCall } from "react-icons/io5";
import { CiBellOn } from "react-icons/ci";
import Nav from 'react-bootstrap/Nav';
import './nav.css';

const navItems = [
  {item: 'Home', icon: <FaHome />},
  {item: 'Contact', icon: <IoCall />},
  {item: 'Profile', icon: <FaUser /> }
  
]

const Navs = () => {
  return (
    <nav className='navParent'>
      <CiBellOn />
      <ul className='nav'>
        {navItems.map((element, index) => (
          <div key={index} className='navContainer'>
            <div className='listIcon'>{element.icon}</div>
            <li className='navList'>
              {element.item}
            </li>

          </div>
          
        ))}

      </ul>
     
    </nav>
  )
}
export default Navs;