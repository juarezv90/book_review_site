import React, { useState } from "react";
import { myUserContext } from "../App";
import { useNavigate } from "react-router-dom";

const userTemplate = { username: "", password: "" };

function Login() {
  const { setUser } = myUserContext();
  let navigate = useNavigate();
  const [username, setUsername] = useState(userTemplate);

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
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.detail || "Login Failed");
          });
        }
        return response.json();
      })
      .then((json) => {
        setUser(json);
        sessionStorage.setItem("access",json.access)
        sessionStorage.setItem("refresh",json.refresh)
        navigate("/user/profile/");
      })
      .catch((e) => {
        setError(e.message + ". Please Try again");
      })
      .finally(() => {
        setTimeout(() => {
          setError("");
        }, 5000);
        setUsername(userTemplate);
      });
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
        {error && <p>{error}</p>}
      </form>
    </section>
  );
}

export default Login;
