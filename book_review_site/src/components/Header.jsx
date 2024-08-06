import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BookSearch from "./BookSearch";
import { myUserContext } from "../App";
import { fetchProfile, verifyToken } from "../api_calls/userLogin";

function Header() {
  const [mobileHeight, setMobileHeight] = useState(0);
  const { user, setUser, profile, setProfile } = myUserContext();
  // const [permissions, setPermissions] = useState(null);

  useEffect(() => {
    const token = sessionStorage;
    if (token.length > 0) {
      verifyToken(token.access).then((data) => {
        if (!data) {
          setUser(0), sessionStorage.clear();
        } else {
          setUser(token);
        }
      });
    }
  }, [user]);

  useEffect(() => {
    if (user.access) {
      fetchProfile(user.access).then((userDetails) => {
        setProfile(userDetails);
        sessionStorage.setItem("profile", JSON.stringify(userDetails));
      });
    } else if (sessionStorage.getItem("profile")) {
      const data = JSON.parse(sessionStorage.getItem("profile"));
      setProfile(data);
    }
  }, [user.access]);

  //Link object structured with control
  const links = [
    {
      link: "/",
      visible: true,
      name: "Home",
    },
    {
      link: "/recents",
      visible: false,
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
    {
      link: "/add-book-form",
      visible:
        user && profile?.permissions?.includes("book_reviews.can_add_book"),
      name: "Add Book",
    },
  ];

  //Function used to populate links to nav bar menu
  const loadlinks = (link, key) => {
    if (link.visible) {
      return (
        <Link to={link.link} relative="path" key={key} className="menuLinks">
          <li>{link.name}</li>
        </Link>
      );
    }
  };

  useEffect(() => {
    const navbar = document.getElementById("mobile_nav");
    const main = document.getElementsByTagName("main");
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
    main[0].addEventListener("click", () => setMobileHeight(0));

    return () => {
      navbar.removeEventListener("click", showMenu);
      main[0].removeEventListener("click", () => setMobileHeight(0));
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
