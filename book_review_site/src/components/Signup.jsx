import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createNewUser } from "../api_calls/userLogin";

const signUpTemplate = {
  username: "",
  password: "",
  email: "",
  first_name: "",
  last_name: "",
};

function Signup() {
  const [formData, setFormData] = useState(signUpTemplate);
  const [error, setError] = useState("")
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const [success, result] = await createNewUser(formData)
    
    if (!success) {
      setError(result)
      setTimeout(() => {
        setError("")
      }, 5000);
    }else {
      setError("User Created Successfully")
      setTimeout(() => {
        navigate('/login')
      }, 3000);
    }
  };

  return (
    <section id="signup">
      <form onSubmit={handleSubmit} id="sign_up_form">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <p>
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleChange}
          />
        </p>
        <button>Submit</button>
        {error && <p aria-live="assertive">{error}</p>}
      </form>
    </section>
  );
}

export default Signup;
