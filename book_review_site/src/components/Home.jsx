import React, { useEffect } from "react";
import Book from "./Book.jsx";
import { getBooks } from "../api_calls/getBooks.js";
import Hero from "./Hero.jsx";
import PaginationBar from "./PaginationBar.jsx";
import API_ENDPOINTS from "../apiConfig.js";

function Home() {
  const { data, loading, setUrl } = getBooks();

  useEffect(() => {
    setUrl(API_ENDPOINTS.GETADDBOOKS)
  }, [])

  if (loading) return <p>Loading</p>;

  return (
    <>
      <section className="home">
        <Hero />
        <div id="book_container">
          {data.results &&
            data.results.map((book, key) => (
              <Book book={book} key={book.isbn} />
            ))}
        </div>
      </section>
      {data.next || data.previous ? <PaginationBar page_count={20} pages_data={[data,url]} setUrl={setUrl}/> : ""}
    </>
  );
}

export default Home;
