import React from "react";
import { useParams } from "react-router-dom";
import { getBooks } from "../api_calls/getBooks";
import Book from "./Book";

function SearchResultsPage() {
  const { search } = useParams();
  const url = "http://127.0.0.1:8000/api/books?" + search;
  const { data, loading, error } = getBooks(url);
  return (
    <section className="SearchResults home">
      <p>Search Results</p>
      <div id="book_container">
        {loading && <p>Loading</p>}
        {data && data.map((book, key) => <Book book={book} key={key} />)}
        {error && <p>No results found</p>}
      </div>
    </section>
  );
}

export default SearchResultsPage;
