import React, { useState, useEffect } from "react";

export function getBooks(url) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    setData([]);
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        setData(json);
      })
      .catch((e) => {
        setError("There was an error loading books");
      })
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function getBook(isbn) {
  const [book, setBook] = useState({});
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    setBook([]);

    fetch("http://127.0.0.1:8000/books/" + isbn)
      .then((response) => response.json())
      .then((json) => setBook(json))
      .catch((e) => setError("Could not find book"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch("http://127.0.0.1:8000/books/" + isbn + "/reviews/")
      .then((response) => response.json())
      .then((json) => setReviews(json))
      .catch((e) => setError("Error loading reviews"))
      .finally(() => setLoading(false));
  },[]);

  return { book, reviews, loading, error };
}
