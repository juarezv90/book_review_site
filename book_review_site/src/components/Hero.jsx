import React from "react";
import { myUserContext } from "../App";
import { useNavigate } from "react-router-dom";

function Hero() {
  const {user} = myUserContext()
  const navigate = useNavigate()

  return (
    <section id="hero">
      <div id="banner" style={{backgroundImage:"url('./centerbook.webp')"}}>
        {!user && <button onClick={() => navigate('user/signup')}>Sign Up</button>}
      </div>
    </section>
  );
}

export default Hero;
