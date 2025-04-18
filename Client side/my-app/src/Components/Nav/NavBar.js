import React, { useState } from "react";
import { FaHome } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { TiThMenu } from "react-icons/ti";
import { IoMdNotifications } from "react-icons/io";
import { CiLogin } from "react-icons/ci";
import "./nav.css";

const navItems = [
  { item: "Home", icon: <FaHome />, path: "/" },
  { item: "Contact", icon: <FaPhoneAlt />, path: "/contact" },
  { item: "Profile", icon: <FaUser />, path: "/profile/:id" },
  { item: "Login", icon: <CiLogin />, path: "/login" },
  { item: "Notify", icon: <IoMdNotifications /> },
];
const NavBar = ({ isLoggedIn, user }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedNav, setSelectedNav] = useState(window.location.pathname);

  function handleToggleMenu() {
    setShowMenu(!showMenu);
  }
  return (
    <nav className="navParentContainer">
      <ul className={`navContainer ${showMenu ? "menuMobile" : ""}`}>
        {navItems
          .filter((element) => isLoggedIn || element.item !== "Profile")
          .filter((element) => !isLoggedIn || element.item !== "Login")
          .filter(
            (element) => element.item !== "Notify" || user?.role === "admin"
          )
          .filter(
            (element) =>
              user?.role !== "admin" ||
              !["Home", "Profile", "Contact"].includes(element.item)
          )
          .map((element, index) => (
            <div key={index} className="listcontainer">
              <div >{element.icon}</div>
              <a onClick={() => {setSelectedNav(element.path)
                                  console.log('updated')

                  }}href={element.path}>
                <li
                
                  className={`liststyle ${
                    selectedNav === element.path ? "navActive" : ""
                  }`}
                >
                  {element.item}
                </li>
              </a>
            </div>
          ))}
      </ul>
      <div className="menu" onClick={handleToggleMenu}>
        <TiThMenu size={35} />
      </div>
    </nav>
  );
};

export default NavBar;
