import React, { useState, useEffect } from "react";
import { myUserContext } from "../App";
import { fetchProfile } from "../api_calls/userLogin";

function ProfilePage() {
  const { user, profile, setProfile } = myUserContext();
  const [reviews, setReviews] = useState(null);
  const reviewsUrl = "http://127.0.0.1:8000/profile/reviews";

  useEffect(() => {
    if (sessionStorage.getItem("profile")) {
      const data = JSON.parse(sessionStorage.getItem("profile"));
      setProfile(data);
    } else if (user.access) {
      fetchProfile(user.access).then((userDetails) => {
        setProfile(userDetails);
        sessionStorage.setItem("profile", JSON.stringify(userDetails));
      });
    }

    const handleGetUserReviews = async () => {
      try {
        const response = await fetch(reviewsUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.access}`,
          },
        });

        if (!response.ok) {
          console.log(await response.json());
          throw new Error("Error loading reviews");
        }

        const data = await response.json();
        setReviews(data);
      } catch (err) {
        console.log(err.message);
      }
    };

    handleGetUserReviews();
  }, [user.access]);

  console.log(reviews?.review_list.map((item) => item));
  return (
    <section className="profile_page">
      <article className="profile">
        <h1>Username: {profile.username}</h1>
        <p>{profile.email}</p>
        <p>{profile.first_name + " " + profile.last_name}</p>
        {reviews?.review_list && (
          <select name="reviews" id="reviews" style={{ width: 400 }} multiple>
            {reviews.review_list?.map((review) => (
              <option value="">
                {reviews.book_list.filter(book => book.isbn == review.book).map(book => book.title)} - Reviewed on: {review.date_reviewed}
              </option>
            ))}
          </select>
        )}
      </article>
    </section>
  );
}

export default ProfilePage;
