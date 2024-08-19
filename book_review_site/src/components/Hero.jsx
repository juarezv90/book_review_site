import React from "react";
import { myUserContext } from "../App";
import { useNavigate } from "react-router-dom";

const baseURL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_PROD_BASE_URL
    : "/bookreviewsite/"

const urlString = `url("${baseURL}centerbook.webp")`


function Hero() {
  const {user} = myUserContext()
  const navigate = useNavigate()

  return (
      <article id="hero" style={{backgroundImage:urlString,}}>
        <p className="hero_text">A place to leave reviews for books you may have read and get an idea for the next you may want to read</p>
        {!user && <button onClick={() => navigate('user/signup')}>Sign Up</button>}
      </article>
  );
}

export default Hero;
