import React, { useState } from "react";
import { myUserContext } from "../App";
import { leaveReview } from "../api_calls/getBooks";

function LeaveReview({ isbn }) {
  const { user } = myUserContext();
  const [review, setReview] = useState({
    token: user.access,
    review: "",
    ratings: 5,
    isbn: isbn,
  });
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReview({
      ...review,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(review);
    const [success, result] = await leaveReview(review);

    if(!success) {
      setError(result)
    }else {
      window.location.reload();
    }
  };

  const ratingArray = () => {
    let ratings = [];

    for (let i = 0; i < 5; i++) {
      if (i + 1 == 5) {
        ratings.push(
          <div className="radio" key={i}>
            <label htmlFor={i + 1}>{i + 1}</label>
            <input
              type="radio"
              name="ratings"
              id={i + 1}
              value={i + 1}
              onClick={handleChange}
              key={i + "rating"}
              defaultChecked
              required
            />
          </div>
        );
      } else {
        ratings.push(
          <div className="radio" key={i}>
            <label htmlFor={i + 1}>{i + 1}</label>
            <input
              type="radio"
              name="ratings"
              id={i + 1}
              value={i + 1}
              onClick={handleChange}
              key={i + "rating"}
              required
            />
          </div>
        );
      }
    }

    return ratings;
  };

  return (
    <section id="leave_review">
      <form id="review_form" onSubmit={handleSubmit}>
        <p>Leave a Review:</p>
        <textarea
          name="review"
          id=""
          value={review.review}
          placeholder="Enter your review here"
          onChange={handleChange}
          required
        ></textarea>
        <fieldset>
          <legend>How would you rate this book</legend>
          {ratingArray()}
        </fieldset>
        <button>Submit</button>
       {error && <p className="error">{error}</p>}
      </form>
    </section>
  );
}

export default LeaveReview;
