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

 

  // data = {
  //   results: [
  //     {
  //         "title": "Whispers in the Wind",
  //         "book_img": "https://via.placeholder.com/150",
  //         "author": "Evelyn White",
  //         "isbn": "978-3-16-148410-0",
  //         "publish_date": "2023-01-15",
  //         "slugs": "whispers-in-the-wind",
  //         "genre": "Fiction"
  //     },
  //     {
  //         "title": "Shadows of the Past",
  //         "book_img": "https://via.placeholder.com/150",
  //         "author": "Michael Gray",
  //         "isbn": "978-1-84-749380-1",
  //         "publish_date": "2022-06-10",
  //         "slugs": "shadows-of-the-past",
  //         "genre": "Thriller"
  //     },
  //     {
  //         "title": "The Enchanted Forest",
  //         "book_img": "https://via.placeholder.com/150",
  //         "author": "Sophia Brown",
  //         "isbn": "978-0-14-312774-1",
  //         "publish_date": "2021-11-25",
  //         "slugs": "the-enchanted-forest",
  //         "genre": "Fantasy"
  //     },
  //     {
  //         "title": "Journey to the Stars",
  //         "book_img": "https://via.placeholder.com/150",
  //         "author": "Liam Parker",
  //         "isbn": "978-0-452-28423-4",
  //         "publish_date": "2020-03-18",
  //         "slugs": "journey-to-the-stars",
  //         "genre": "Science Fiction"
  //     },
  //     {
  //         "title": "Heart of the Ocean",
  //         "book_img": "https://via.placeholder.com/150",
  //         "author": "Olivia Green",
  //         "isbn": "978-0-671-02735-8",
  //         "publish_date": "2019-08-30",
  //         "slugs": "heart-of-the-ocean",
  //         "genre": "Romance"
  //     },
  //     {
  //         "title": "Echoes of Eternity",
  //         "book_img": "https://via.placeholder.com/150",
  //         "author": "James Black",
  //         "isbn": "978-0-553-38231-0",
  //         "publish_date": "2018-05-14",
  //         "slugs": "echoes-of-eternity",
  //         "genre": "Horror"
  //     },
  //     {
  //         "title": "The Silent Storm",
  //         "book_img": "https://via.placeholder.com/150",
  //         "author": "Emily Wood",
  //         "isbn": "978-0-7432-7356-1",
  //         "publish_date": "2017-12-22",
  //         "slugs": "the-silent-storm",
  //         "genre": "Drama"
  //     },
  //     {
  //         "title": "Tales from the Deep",
  //         "book_img": "https://via.placeholder.com/150",
  //         "author": "John Doe",
  //         "isbn": "978-0-06-112008-4",
  //         "publish_date": "2016-09-10",
  //         "slugs": "tales-from-the-deep",
  //         "genre": "Adventure"
  //     },
  //     {
  //         "title": "Mysteries of the Mind",
  //         "book_img": "https://via.placeholder.com/150",
  //         "author": "Sarah Lee",
  //         "isbn": "978-0-385-52938-0",
  //         "publish_date": "2015-04-07",
  //         "slugs": "mysteries-of-the-mind",
  //         "genre": "Psychology"
  //     },
  //     {
  //         "title": "Legends of the Forgotten",
  //         "book_img": "https://via.placeholder.com/150",
  //         "author": "William King",
  //         "isbn": "978-0-553-26305-6",
  //         "publish_date": "2014-10-21",
  //         "slugs": "legends-of-the-forgotten",
  //         "genre": "Historical Fiction"
  //     },
  //     {
  //         "title": "Waves of Time",
  //         "book_img": "https://via.placeholder.com/150",
  //         "author": "Alex Wright",
  //         "isbn": "978-1-56619-909-4",
  //         "publish_date": "2013-02-14",
  //         "slugs": "waves-of-time",
  //         "genre": "Science Fiction"
  //     }
  // ]
  
  // }

  return (
    <>
      <section className="home">
        <Hero />
        <h2>Books reviewed this week</h2>
        <article id="book_container">
          {data.results &&
            data.results.map((book, key) => (
              <Book book={book} key={book.isbn} />
            ))}
          {data.next || data.previous ? <PaginationBar page_count={20} pages_data={[data, url]} setUrl={setUrl} /> : ""}
        </article>
      </section>
    </>
  );
}

export default Home;
