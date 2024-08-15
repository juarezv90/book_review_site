import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BookSearch from "./BookSearch";
import { myUserContext } from "../App";
import { fetchProfile, verifyToken } from "../api_calls/userLogin";
import { inner_site_links } from "../apiConfig";

function Header() {
  const { user, setUser, profile, setProfile } = myUserContext();
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowMenu(false);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        <Link to={link.link} relative="path" key={key} className="menuLinks" aria-description="list-item">
          <li className="menu_links">{link.name}</li>
        </Link>
      );
    }
  };

  const giveHeight = () => {
    const items = document.getElementsByClassName("menu_links");

    const height = items[0].scrollHeight + 10;

    return `${height * items.length + 20}px`;
  };

  return (
    <header>
      <Link to={"/"}>
        <h1>The Book Club</h1>
      </Link>
      <BookSearch />
      <input
        type="button"
        className="menu_button"
        value="|||"
        onClick={() => setShowMenu(!showMenu)}
        onBlur={() => setShowMenu(false)}
      />
      <menu
        className="mobile_nav hide"
        id="navlist"
        style={
          showMenu
            ? { height: giveHeight() }
            : { height: 0, opacity: 0, padding: 0, margin: 0 }
        }
      >
        {inner_site_links(user, profile).map((link, key) =>
          loadlinks(link, key)
        )}
      </menu>
    </header>
  );
}

export default Header;
