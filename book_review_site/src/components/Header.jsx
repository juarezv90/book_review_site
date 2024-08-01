import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import BookSearch from "./BookSearch";
import { myUserContext } from "../App"
import { verifyToken } from "../api_calls/userLogin";

function Header() {
  const [mobileHeight, setMobileHeight] = useState(0);
  const { user,setUser } = myUserContext()

  useEffect(()=> {
    const token = sessionStorage;
    if (token.length) {
      verifyToken(token.access).then(data=> data ? setUser(token) : setUser(0) )
    }
  }, [setUser])
  
  //Link object structured with control
  const links = [
    {
      link: "/",
      visible: true,
      name: "Home",
    },
    {
      link: "/recents",
      visible: true,
      name: "Recents",
    },
    {
      link: "/login",
      visible: !user ? true : false,
      name: "Login",
    },
    {
      link: "/user/signup",
      visible: !user ? true : false,
      name: "Sign up",
    },
    {
      link: "/user/profile",
      visible: user ? true : false,
      name: "Profile",
    },
  ];

  //Function used to populate links to nav bar menu
  const loadlinks = (link, key) => {
    if (link.visible) {
      return (
        <Link to={link.link} relative="path" key={key}>
          <li>{link.name}</li>
        </Link>
      );
    }
  };


  useEffect(() => {
    const navbar = document.getElementById("mobile_nav");
    const showMenu = () => {
      const navlist = document.getElementById("navlist");
      const mobileHeightInner =
        (navlist.children.length + 1) * navlist.children[0].scrollHeight;
      if (navlist.style.height !== "0px") {
        setMobileHeight(0);
      } else {
        setMobileHeight(mobileHeightInner);
      }
    };

    navbar.addEventListener("click", showMenu);
    
    return () => {
      navbar.removeEventListener("click", showMenu);
    };
  }, [mobileHeight]);

  return (
    <header>
      <Link to={"/"}>
        <h1>The Book Club</h1>
      </Link>
      <BookSearch />
      <nav id="mobile_nav">
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
        <ul
          className="mobile_nav"
          id="navlist"
          style={mobileHeight > 0 ? { height: mobileHeight } : { height: 0 }}
        >
          {links.map((link, key) => loadlinks(link, key))}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
