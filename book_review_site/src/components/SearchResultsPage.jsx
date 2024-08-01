import React from "react";
import { useParams } from "react-router-dom";
import { getBooks } from "../api_calls/getBooks";
import Book from "./Book";

function SearchResultsPage() {
  const { search } = useParams();
  const searchedTerm = search.split("=")
  const url = "http://127.0.0.1:8000/api/books?" + search;
  const { data, loading, error } = getBooks(url);

  if (loading) return <p>Loading book search</p>

  return (
    <section id="search_results">
      <p className="search_text">Search Results: "{searchedTerm[1]}"</p>
      <div id="book_container">
        {data && data.map((book, key) => <Book book={book} key={key} />)}
        {error && <p>No results found</p>}
      </div>
    </section>
  );
}

export default SearchResultsPage;
