import React from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../apiConfig";



function Book({ book }) {
  
  return (
    <Link key={book.isbn} to={`/books/${book.isbn}`}>
      <article className="book_articles">
        <img src={`${API_BASE_URL}${book.book_img}`} alt="book image" />
        <p className="book_title">{book.title}</p>
        <p>Author: {book.author}</p>
        <p>Published: {book.published_date}</p>
        <p>ISBN: {book.isbn}</p>
        {book.series && <p>Book {book.number_in_series} of the {book.series} series</p>}
        <p> Likes: {book.number_of_likes ? book.number_of_likes : 0}</p>
      </article>
    </Link>
  );
}

export default Book;
