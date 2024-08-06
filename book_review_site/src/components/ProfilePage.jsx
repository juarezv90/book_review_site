import React, { useState, useEffect } from "react";
import { myUserContext } from "../App";
import { fetchProfile } from "../api_calls/userLogin";
import { delete_post } from "../api_calls/getBooks";

function ProfilePage() {
  const { user, profile, setProfile } = myUserContext();
  const [reviews, setReviews] = useState(null);
  const [reviewSelection, setReviewSelection] = useState(null);
  const reviewsUrl = "http://127.0.0.1:8000/profile/reviews";

  useEffect(() => {
    if (user.access) {
      fetchProfile(user.access).then((userDetails) => {
        setProfile(userDetails);
        sessionStorage.setItem("profile", JSON.stringify(userDetails));
      });
    } else if (sessionStorage.getItem("profile")) {
      const data = JSON.parse(sessionStorage.getItem("profile"));
      setProfile(data);
    }
  }, [user.access]);

  const handleGetUserReviews = async () => {
    try {
      const response = await fetch(reviewsUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.access}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error loading reviews");
      }

      const data = await response.json();
      setReviews(data);
    } catch (err) {
      // console.log(err.message);
    }
  };

  useEffect(() => {
    handleGetUserReviews();
  }, [user.access]);

  const handleOnclick = (review) => {
    const book = reviews.book_list
      .filter((book) => book.isbn == review.book)
      .pop();
    const data = { ...review, ...book };

    setReviewSelection(data);
  };

  const handleDelete = async () => {
    const [success, result] = await delete_post(
      reviewSelection.id,
      user.access,
      reviewSelection.isbn
    );

    if (!success) {
    } else {
      setReviewSelection(null);
      handleGetUserReviews();
    }
  };

  if (!profile) {
    return <p>Loading</p>;
  }
  return (
    <section className="profile_page">
      <article className="profile">
        <h1>Username: {profile.username}</h1>
        <p>{profile.email}</p>
        <p>{profile.first_name + " " + profile.last_name}</p>
        {profile.profile_image && (
          <>
            <img
              src={profile.profile_image.image_url}
              alt="profile Image"
              width={300}
              className="profile_image"
            />
          </>
        )}
        {reviews && (
          <>
            <p>Your Reviews:</p>
            <select name="reviews" id="reviews" multiple>
              {reviews.review_list?.map((review) => (
                <option
                  value=""
                  onClick={() => {
                    handleOnclick(review);
                  }}
                  key={review.id}
                >
                  {reviews.book_list
                    .filter((book) => book.isbn == review.book)
                    .map((book) => book.title.slice(0, 13) + "...")}{" "}
                  - Reviewed on: {review.date_reviewed}
                </option>
              ))}
            </select>
          </>
        )}
      </article>
      {reviewSelection && (
        <article className="review">
          <p className="book">{reviewSelection.title}</p>
          <p className="author">Author: {reviewSelection.author}</p>
          <p className="isbn">ISBN: {reviewSelection.isbn}</p>
          <p>Your Review:</p>
          <p className="review">{reviewSelection.review_text}</p>
          <p className="reviewRating">
            Review Rating: {reviewSelection.review_rating}
          </p>
          <p className="reviewedDate">
            {" "}
            Reviewed: {reviewSelection.date_reviewed}
          </p>
          <button onClick={handleDelete}>Delete</button>
        </article>
      )}
    </section>
  );
}

export default ProfilePage;
