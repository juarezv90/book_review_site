import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { getBook } from "../api_calls/getBooks";

function SingleBook() {
  const { isbn } = useParams();
  const { book, reviews, loading, bookError, reviewError } = getBook(isbn);

  console.log(reviews);
  return (
    <>
      {loading && <p>Please wait retrieving book</p>}
      {!bookError && !loading && (
        <section className="single_book">
          <article className="book_container">
            <img src={book.book_img} alt="" />
            <br />
            <h2 className="title">{book.title}</h2>
            <hr />
            <br />
            <p>Author: {book.author}</p>
            <p>ISBN: {book.isbn}</p>
            <p>Published: {book.publish_date}</p>
            <p>About the book</p>
            {book &&
              book.about_book?.split("\n").map((data, key) => (
                <p className="book_text" key={key}>
                  {data}
                </p>
              ))}
            <p>Likes: {book.number_of_likes}</p>
          </article>
          <article className="reviews">
            <h3>Reviews:</h3>
            {reviews.length > 0 &&
              reviews.map((review) => (
                <div className="review" key={review.id}>
                  <p className="user">{review.user}</p>
                  <p className="date">Reviewed: {review.date_reviewed}</p>
                  <p className="text">{review.review_text}</p>
                  <p className="rating">Rating: {review.review_rating}</p>
                </div>
              ))}
          </article>
          {reviewError && <p>{reviewError}</p>}
        </section>
      )}
      {bookError && <p>{bookError}</p>}
    </>
  );
}

export default SingleBook;
