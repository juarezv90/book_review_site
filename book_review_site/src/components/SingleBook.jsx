import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { delete_post, useBookData } from "../api_calls/getBooks";
import LeaveReview from "./LeaveReview";
import { myUserContext } from "../App";

function SingleBook() {
  const { isbn } = useParams();
  const { book, bookError, bookLoading, reviewsLoading, reviews } =
    useBookData(isbn);
  const { user } = myUserContext();

  const handleDelete = async (id) => {
    const [success, result] = await delete_post(id, user.access, isbn)
    if(!success){
      console.log(result);
    } else {
      window.location.reload()
    }
  }

  if (bookLoading) return <p>Loading book, please wait... </p>;

  if (bookError) return <p>Error Loading book</p>;

  return (
    <>
      {book && (
        <section className="single_book">
          <article className="book_container">
            <img src={book.book_img} alt="" width={300}/>
            <br />
            <h3 className="title">{book.title}</h3>
            <hr />
            <br />
            <p>Author: {book.author}</p>
            <p>ISBN: {book.isbn}</p>
            <p>Published: {book.published_date}</p>
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
            {reviewsLoading ? (
              <p>Reviews loading</p>
            ) : reviews.length > 0 ? (
              reviews.map((review) => (
                <div className="review" key={review.id}>
                  <p className="user">{review.user}</p>
                  <p className="date">Reviewed: {review.date_reviewed}</p>
                  <p className="text">{review.review_text}</p>
                  <p className="rating">Rating: {review.review_rating}</p>
                  <div className="delEdit">
                    <span onClick={() => handleDelete(review.id)}>Delete</span>
                    <span>Edit</span>
                  </div>
                </div>
              ))
            ) : (
              <p>No Reviews Found</p>
            )}
          </article>
          {user != 0 && <LeaveReview isbn={isbn} />}
        </section>
      )}
      {bookError && <p>{bookError}</p>}
    </>
  );
}

export default SingleBook;
