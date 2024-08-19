import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { delete_post, useBookData } from "../api_calls/getBooks";
import LeaveReview from "./LeaveReview";
import { myUserContext } from "../App";
import Reviews from "./Reviews";
import { API_BASE_URL } from "../apiConfig";

function SingleBook() {
  const { isbn } = useParams();
  const { book, bookError, bookLoading, reviewsLoading, reviews } =
    useBookData(isbn);
        
  const { user } = myUserContext();

  const handleDelete = async (id) => {
    const [success, result] = await delete_post(id, user.access, isbn);
    if (!success) {
      console.log(result);
    } else {
      window.location.reload();
    }
  };

  if (bookLoading) return <p>Loading book, please wait... </p>;

  if (bookError) return <p>Error Loading book</p>;

  return (
    <>
      {book && (
        <section className="single_book">
          <article className="book_container">
            <img src={`${API_BASE_URL}${book.book.book_img}`} alt="" width={300} />
            <br />
            <h3 className="title">{book.book.title}</h3>
            <hr />
            <br />
            <p>Likes: {book.book.number_of_likes}</p>
            <p>Author: {book.author.author}</p>
            <p>ISBN: {book.book.isbn}</p>
            <p>Published: {book.book.published_date}</p>
            {book.series && <p>Book {book.book.number_in_series} of the {book.series.book_series} series</p>}
            <p>About the book</p>
            <div className="text_container">
              {book.book &&
                book.book.about_book?.split("\n").map((data, key) => (
                  <p className="book_text" key={key}>
                    {data}
                  </p>
                ))}
            </div>
          </article>
          <article id="reviews">
            <h3>Reviews:</h3>
            {reviewsLoading ? (
              <p>Reviews loading</p>
            ) : reviews.results?.length > 0 ? (
              reviews.results.map((review) => (
               <Reviews review={review} handleDelete={handleDelete} key={review.id}/>
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
