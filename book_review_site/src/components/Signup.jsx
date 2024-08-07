import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createNewUser } from "../api_calls/userLogin";

const signUpTemplate = {
  username: "",
  password: "",
  email: "",
  first_name: "",
  last_name: "",
  profile_image_data: null,
};

function Signup() {
  const [formData, setFormData] = useState(signUpTemplate);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormData({
        ...formData,
        [name]: files[0],
      });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    formDataToSend.append("username", formData.username);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("first_name", formData.first_name);
    formDataToSend.append("last_name", formData.last_name);
    formDataToSend.append(
      "profile_image_data.profile_image",
      formData.profile_image_data
    );

    const [success, result] = await createNewUser(formDataToSend);

    if (!success) {
      setError(result);
      setTimeout(() => {
        setError("");
      }, 5000);
    } else {
      setError("User Created Successfully");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
  };

  console.log(formData);

  return (
    <section id="signup">
      <form onSubmit={handleSubmit} id="sign_up_form" encType="multipart/form-data">
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
        <p>
          <label htmlFor="profile_image_data">Profile Image</label>
          <input
            type="file"
            name="profile_image_data"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleChange}
          />
        </p>
        {preview && (
          <p>
            <img src={preview} alt="" />
          </p>
        )}
        <button>Submit</button>
        {error && <p aria-live="assertive">{error}</p>}
      </form>
    </section>
  );
}

export default Signup;
