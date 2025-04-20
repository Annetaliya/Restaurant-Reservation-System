import React from 'react'
import contactHeader from '../../Images/restaurant contact.jpg';
import './contact.css'
import { FaFacebook } from "react-icons/fa";
import { IoCallOutline } from "react-icons/io5";
import { FaInstagram } from "react-icons/fa6";

const Contact = () => {
  return (
    <div className='contactContainer'>
      <h3 className='contactTitle'>Welcome to Eatery bay <br></br>Gourmet restaurant</h3>
      <p className='contactIntro'><span>N</span>estled in the heart of Nairobi, our gourmet restaurant offers a refined dining experience
         that celebrates <br></br>the finest ingredients, masterful techniques, and impeccable service.
          Each dish is thoughtfully crafted by our chefs <br></br>to deliver a harmonious balance of flavor,
           presentation, and creativity. Whether you're joining us for an intimate dinner, <br></br>
           a special occasion, or a moment of indulgence, 
           Eatery bay promises an unforgettable journey for the senses.</p>
      <div className='contactInfoIcons'>
        <div>
          <IoCallOutline size={40} color='#fff'/>
        </div>
        <div>
          <FaFacebook size={40} color='#fff'/>
        </div>
        <div>
          <FaInstagram size={40} color='#fff'/>
        </div>
        
      </div>
        
    </div>
  )
}

export default Contact