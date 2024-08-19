import React from "react";
import { useBookData } from "../api_calls/getBooks";

function PaginationBar({ pages_data, page_count = 1, setUrl }) {
  const [data, url] = pages_data
  const { next: Next, previous: Prev, count } = data;
  const pageCount = Math.ceil(count / page_count);

  function handlePageClick(e) {
    const {innerHTML} = e.target
    const newUrl = url+`?limit=${page_count}&offset=${(innerHTML-1)*page_count}`
    setUrl(newUrl)
  }

  const pages = () => {
    const page = []
    for (let i = 1; i <= pageCount; i++ ){
      page.push(
        <span onClick={handlePageClick} key={i}>{i}</span>
      )
    }

    return page
  }

  const handleClick = (e) => {
    const {innerHTML} = e.target
    switch (innerHTML) {
      case 'Prev':
        setUrl(Prev)
        break;
      case 'Next':
        setUrl(Next)
        break;
      default:
        break;
    }
  }
  

  return (
    <section id="pagination">
      <span onClick={Prev ? handleClick : null}>Prev</span>
      {pages()}
      <span onClick={Next ? handleClick : null}>Next</span>
    </section>
  );
}

export default PaginationBar;
