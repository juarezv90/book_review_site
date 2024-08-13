import React from "react";
import { Link } from "react-router-dom";

function Book({ book }) {
  
  return (
    <Link key={book.isbn} to={`/books/${book.isbn}`}>
      <article className="book_articles">
        <img src={book.book_img} alt="book image" />
        <p className="book_title">{book.title}</p>
        <p>Author: {book.author}</p>
        <p>Published: {book.published_date}</p>
        <p>ISBN: {book.isbn}</p>
        <p> Likes: {book.number_of_likes ? book.number_of_likes : 0}</p>
        {book.series && <p>Part of Series</p>}
      </article>
    </Link>
  );
}

export default Book;
