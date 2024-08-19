import React from "react";

function Reviews({review, handleDelete}) {
  return (
    <article className="review" key={review.id}>
      <p className="user">{review.user}</p>
      <p className="date">Reviewed: {review.date_reviewed}</p>
      <p className="text">{review.review_text}</p>
      <p className="rating">Rating: {review.review_rating}</p>
      <div className="delEdit">
        <span className="del" onClick={() => handleDelete(review.id)}>
          Delete
        </span>
        <span>Edit</span>
      </div>
    </article>
  );
}

export default Reviews;
