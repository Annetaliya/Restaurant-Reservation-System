import React from 'react';
import './footer.css';
import { FaFacebook } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaInstagramSquare } from "react-icons/fa";
import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <div className='container-fluid parentFooter'>
        <div className='footerElements'>
            <p>Our services</p>
            <p>Location</p>
            <p>Address</p>
        </div>
        <div className='footerElements'>
            <p>Contact</p>
            <p>Blog</p>
            <p>Reviews</p>
        </div>
        <div className='dispayIcons'>
            <FaFacebook className='iconsContact' size={45}/>
            <FaSquareXTwitter className='iconsContact' size={45}/>
            <FaInstagramSquare className='iconsContact'size={45}/>

        </div>
    </div>
  )
}

export default Footer