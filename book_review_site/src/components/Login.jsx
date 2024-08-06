import React, { useState } from "react";
import { myUserContext } from "../App";
import { useNavigate } from "react-router-dom";
import { userLogin } from "../api_calls/userLogin";

const userTemplate = { username: "", password: "" };

function Login() {
  const [userData, setUserData] = useState(userTemplate);
  const [error, setError] = useState("");
  const { setUser } = myUserContext();
  let navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!userData.username || !userData.password) {
      return;
    }

    const [success, result] = await userLogin(userData);

    if (!success) {
      setError(result);
      setUserData(userTemplate);
      setTimeout(() => {
        setError("");
      }, 4000);
    } else {
      setUser(result);
      sessionStorage.setItem("access", result.access);
      sessionStorage.setItem("refresh", result.refresh);
      navigate("/");
    }
  };

  return (
    <section id="login">
      <form id="login_form" onSubmit={handleLogin}>
        <h2>Login In:</h2>
        <input
          type="text"
          name="username"
          id="username"
          value={userData.username}
          placeholder="username"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          id="password"
          value={userData.password}
          placeholder="password"
          onChange={handleChange}
          required
        />
        <button>Login</button>
        {error && <p aria-live="assertive">{error}</p>}
      </form>
    </section>
  );
}

export default Login;
