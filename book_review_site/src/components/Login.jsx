import React, { useState } from "react";
import { myUserContext } from "../App";
import { useNavigate } from "react-router-dom";

function Login() {
  const { user, setUser } = myUserContext();
  let navigate = useNavigate();
  const [username, setUsername] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setUsername({
      ...username,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.username || !username.password) {
      return;
    }

    const url = "http://127.0.0.1:8000/api/token/";

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username.username,
        password: username.password,
      }),
    })
      .then((response) => response.json())
      .then((json) => setUser(json))
      .catch((e) => console.log(e))
      
  };

  return (
    <section id="login">
      <form id="login_form" onSubmit={handleLogin}>
        <input
          type="text"
          name="username"
          id="username"
          value={username.username}
          placeholder="username"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          id="password"
          value={username.password}
          placeholder="password"
          onChange={handleChange}
          required
        />
        <button>Login</button>
      </form>
      {error && <p>{error}</p>}
    </section>
  );
}

export default Login;
