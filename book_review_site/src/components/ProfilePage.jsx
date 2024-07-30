import React, { useState, useEffect } from "react";
import { myUserContext } from "../App";
import { fetchProfile } from "../api_calls/userLogin";

function ProfilePage() {
  const { user, setUser } = myUserContext();
  const [profile, setProfile] = useState({});

  useEffect(() => {
    if (sessionStorage.getItem("profile")) {
      const data = JSON.parse(sessionStorage.getItem("profile"));
      setProfile(data);
    } else if(user) {
      fetchProfile(user.access).then((userDetails) => {
        setProfile(userDetails);
        sessionStorage.setItem("profile", JSON.stringify(userDetails));
      });
    }
  }, [user]);

  console.log(
    "this is a loaded profile",
    JSON.parse(sessionStorage.getItem("profile"))
  );
  return (
    <section className="profile_page">
      <article className="profile">
        <h1>{profile.username}</h1>
        <p>{profile.email}</p>
        <p>{profile.first_name + " " + profile.last_name}</p>
      </article>
    </section>
  );
}

export default ProfilePage;
