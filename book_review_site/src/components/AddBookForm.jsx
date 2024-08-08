import React, { useState } from "react";
import { addBook } from "../api_calls/getBooks";
import { myUserContext } from "../App";

const formTemplate = {
  title: "",
  author: "",
  book_img: null,
  about_book: "",
  series: false,
  published_date: "",
  isbn: "",
};

//TODO: Need to complete displaying return success and error on screen

function AddBookForm() {
  const {user} = myUserContext()
  const [form, setForm] = useState(formTemplate);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("")

  const handleTextChanges = (e) => {
    const { name, value, checked, files, type } = e.target;

    if (type === "file") setPreview(URL.createObjectURL(files[0]));
    if (type === "number" && value.length >= 14) return;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  const handleAdd = async(e) => {
    e.preventDefault();

    const [success, data] = await addBook(form,user)

    if(!success) {
      setError(data)
    }
  };  
  

  return (
    <section className="addBook">
      <h2>Add Book to System</h2>
      <form id="add_book" onSubmit={handleAdd} encType="multipart/from-data">
        <input
          type="text"
          name="title"
          id="title"
          value={form.title}
          placeholder="Book title"
          onChange={handleTextChanges}
        />
        <input
          type="text"
          name="author"
          id="author"
          value={form.author}
          placeholder="Book Author"
          onChange={handleTextChanges}
          required
        />
        <div className="book_image">
          <label htmlFor="book_img">Book Cover: </label>
          <input
            type="file"
            name="book_img"
            id="book_image"
            onChange={handleTextChanges}
            required
          />
        </div>
        <div className="preview">{preview && <img src={preview} alt="" />}</div>
        <textarea
          name="about_book"
          id="about_book"
          value={form.about_book}
          placeholder="Book preface"
          onChange={handleTextChanges}
          required
        ></textarea>
        <input
          type="number"
          name="isbn"
          value={form.isbn}
          onChange={handleTextChanges}
          placeholder="ISBN"
          required
        />
        <input
          type="date"
          name="published_date"
          value={form.published_date}
          onChange={handleTextChanges}
          required
        />
        <div className="series">
          <label htmlFor="series">Is a series:</label>
          <input
            type="checkbox"
            name="series"
            id="series"
            checked={form.series}
            onChange={handleTextChanges}
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button>Submit</button>
      </form>
    </section>
  );
}

export default AddBookForm;
