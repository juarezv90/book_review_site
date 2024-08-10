import React from "react";
import { myUserContext } from "../App";
import { useNavigate } from "react-router-dom";

function Hero() {
  const {user} = myUserContext()
  const navigate = useNavigate()

  return (
      <article id="hero" style={{backgroundImage:"url('./centerbook.webp')"}}>
        {!user && <button onClick={() => navigate('user/signup')}>Sign Up</button>}
      </article>
  );
}

export default Hero;
