import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BookSearch from "./BookSearch";
import { myUserContext } from "../App";
import { fetchProfile, verifyToken } from "../api_calls/userLogin";
import { inner_site_links } from "../apiConfig";

function Header() {
  const { user, setUser, profile, setProfile } = myUserContext();
  const [showMenu, setShowMenu] = useState(false)

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

  const loadlinks = (link, key) => {
    if (link.visible) {
      return (
        <Link to={link.link} relative="path" key={key} className="menuLinks">
          <li>{link.name}</li>
        </Link>
      );
    }
  };

  return (
    <header>
      <Link to={"/"}>
        <h1>The Book Club</h1>
      </Link>
      <BookSearch />
      <input type="button" className="menu_button" value="|||" onClick={() => setShowMenu(!showMenu)} onBlur={() => setShowMenu(false)} />
      <ul
        className="mobile_nav hide"
        id="navlist"
        style={showMenu ? { height: '80vh' } : { height: 0, opacity:0, padding:0, margin:0}}
      >
        {inner_site_links(user).map((link, key) => loadlinks(link, key))}
      </ul>
    </header>
  );
}

export default Header;
