import { useState, useEffect } from "react";

export function getBooks() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState();

  useEffect(() => {
    setLoading(true);
    const handleGettingBook = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data || "error loading book");
        }

        const data = await response.json();
        setData(data);
        setError(null)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false);
      }
    };

    handleGettingBook();
  }, [url]);

  return { data, loading, error, setUrl };
}

export function useBookData(isbn) {
  const url = "http://127.0.0.1:8000/books/" + isbn;
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [bookLoading, setBookLoading] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [bookError, setBookError] = useState("");

  useEffect(() => {
    setBookLoading(true);
    setBookError("");

    const fetchBook = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Error loading book");
        }
        const data = await response.json();
        setBook(data);
      } catch (err) {
        setBookError(err.message);
      } finally {
        setBookLoading(false);
      }
    };

    fetchBook();
  }, [isbn]);

  useEffect(() => {
    const url = "http://127.0.0.1:8000/books/" + isbn + "/reviews/";
    setReviewsLoading(true);

    const fetchReviews = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "no reviews found");
        }
        const data = await response.json();
        setReviews(data);
      } catch (err) {
        console.log(err.message);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [isbn]);

  return { book, reviews, bookLoading, reviewsLoading, bookError };
}

export async function leaveReview(review) {
  const url = `http://127.0.0.1:8000/books/${review.isbn}/makereviews/`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${review.token}`,
      },
      body: JSON.stringify({
        review_text: review.review,
        review_rating: review.ratings,
        book: review.isbn,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      console.log(data);
      throw new Error(data.errors || "Error Sending Review");
    }

    const data = await response.json();
    return [true, data];
  } catch (err) {
    return [false, err.message];
  }
}

export async function delete_post(id, token, isbn) {
  const url = `http://127.0.0.1:8000/books/${isbn}/makereviews/`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        isbn: isbn,
        review_id: id,
      }),
    });

    if (!response.ok) {
      const data = await response;
      throw new Error(data.error || "Error deleting comment");
    }

    const data = await response;
    return [true, data];
  } catch (err) {
    return [false, err.message];
  }
}
