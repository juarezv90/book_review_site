import React from "react";
import Book from "./Book.jsx";
import { getBooks } from "../api_calls/getBooks.js";

function Home() {
  const { data, loading, error } = getBooks("http://127.0.0.1:8000/api/books");
  
  return (
    <section className="home">
      <div id="book_container">
        {loading && <p>Loading</p>}
        {data && data.map((book, key) => <Book book={book} key={book.isbn} />)}
        {error && <p>{error}</p>}
      </div>
    </section>
  );
}

export default Home;
