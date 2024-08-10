import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function BookSearch() {
  const [search, setSearch] = useState("")
  const navigate = useNavigate()

  const handeSearchChange = (e) => {
    setSearch(e.target.value)
  }

  const handeSearchClick = (e)=> {
    navigate(`book-search/search=${search}`)
  }
  
  return (
        <form
          id="search_form"
          className="search_form"
          onSubmit={handeSearchClick}
        >
          <input className="search" placeholder="search by title or author" value={search} onChange={handeSearchChange}/>
          <button>Search</button>
        </form>
  );
}

export default BookSearch;
