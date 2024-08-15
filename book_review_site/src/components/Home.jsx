import React, { useEffect } from "react";
import Book from "./Book.jsx";
import { getBooks } from "../api_calls/getBooks.js";
import Hero from "./Hero.jsx";
import PaginationBar from "./PaginationBar.jsx";
import API_ENDPOINTS from "../apiConfig.js";

function Home() {
  let { data, loading, setUrl, url } = getBooks();

  useEffect(() => {
    setUrl(API_ENDPOINTS.GETADDBOOKS)
  }, [])
  
  if (loading) return <p>Loading</p>;
  

  return (
    <>
      <section className="home">
        <Hero />
        <h2>Books reviewed this week</h2>
        <article id="book_container">
          {data &&
            data.map((book, key) => (
              <Book book={book} key={book.isbn} />
            ))}
          {data.next || data.previous ? <PaginationBar page_count={20} pages_data={[data, url]} setUrl={setUrl} /> : ""}
        </article>
      </section>
    </>
  );
}

export default Home;
