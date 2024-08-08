import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getBooks } from "../api_calls/getBooks";
import Book from "./Book";
import PaginationBar from "./PaginationBar";
import API_ENDPOINTS from "../apiConfig";

function SearchResultsPage() {
  const { search } = useParams();
  const searchedTerm = search.split("=")
  const url = API_ENDPOINTS.SEARCHURL+search;
  const { data, loading,error, setUrl } = getBooks();
  
  useEffect(() => {
    setUrl(url)
  },[url])

  if (loading) return <p>Loading book search</p>

  if (error != null) return <p>Error unable to get books</p>
  
  return (
    <>
    <section id="search_results">
      <p className="search_text">{data.count} Search Results for: "{searchedTerm[1]}"</p>
      <div id="book_container">
        {data.results && data.results.map((book, key) => <Book book={book} key={key} />)}
      </div>
    </section>
    {data.next || data.previous ? <PaginationBar pages_data={[data,url]} page_count={20} setUrl={setUrl} />: null}
    </>
  );
}

export default SearchResultsPage;
