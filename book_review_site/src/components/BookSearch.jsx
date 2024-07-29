import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function BookSearch() {
  const [showForm, setShowForm] = useState(false);
  const [winSize, setWinSize] = useState(window.innerWidth);
  const [search, setSearch] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const searchIcon = document.getElementById("search_icon");
    const handleResize = (e) => {
      setWinSize(window.innerWidth)
      if(winSize < 680){
        setShowForm(0)
      }
    };

    window.addEventListener("resize", handleResize);

    const showSearch = () => {
      if (showForm != 0) {
        setShowForm(0);
      } else {
        setShowForm(1);
      }
    };

    if (winSize < 680) {
      searchIcon.addEventListener("click", showSearch);
      
    } else {
      setShowForm(1);
    }

    return () => {
      window.removeEventListener("resize", handleResize)
      searchIcon.removeEventListener("click", showSearch)
    }
  }, [showForm, winSize]);

  const handeSearchChange = (e) => {
    setSearch(e.target.value)
  }

  const handeSearchClick = (e)=> {
    navigate(`book-search/search=${search}`)
  }
  
  return (
    <ul className="search">
      <img
        src="/search_icon.svg"
        width={40}
        height={32}
        alt=""
        id="search_icon"
      />
      <li>
        <form
          id="search_form"
          className="search_form"
          style={
            showForm
              ? { height: "auto" }
              : {
                  height: 0,
                  paddingLeft: 8,
                  paddingRight: 8,
                  paddingTop: 0,
                  paddingBottom: 0,
                }
          }
          onSubmit={handeSearchClick}
        >
          <input className="search" placeholder="search by title or author" value={search} onChange={handeSearchChange}/>
          <button>Search</button>
        </form>
      </li>
    </ul>
  );
}

export default BookSearch;
