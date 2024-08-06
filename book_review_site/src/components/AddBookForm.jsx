import React, { useState } from "react";
import { useAddBook } from "../api_calls/getBooks";

const formTemplate = {
  title: "",
  author: "",
  book_img: null,
  about_book: "",
  series: false,
  published_date: "",
  isbn: "",
};

// TODO: need to add functions to handle updataing state
// TODO:will need to write function that send POST request to server with data
// TODO:review getting file from input:file.
function AddBookForm() {
  const [form, setForm] = useState(formTemplate);
  const [preview, setPreview] = useState(null);
  const { data, loading, error, loadForm } = useAddBook();

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

  const handleAdd = (e) => {
    e.preventDefault();
    loadForm(form);
  };

  console.log(form);
  

  return (
    <section className="addBook">
      <h2>Add Book to System</h2>
      <form id="add_book" onSubmit={handleAdd}>
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
        />
        <div className="book_image">
          <label htmlFor="book_img">Book Cover: </label>
          <input
            type="file"
            name="book_img"
            id="book_image"
            onChange={handleTextChanges}
          />
        </div>
        <div className="preview">{preview && <img src={preview} alt="" />}</div>
        <textarea
          name="about_book"
          id="about_book"
          value={form.about_book}
          placeholder="Book preface"
          onChange={handleTextChanges}
        ></textarea>
        <input
          type="number"
          name="isbn"
          value={form.isbn}
          onChange={handleTextChanges}
          placeholder="ISBN"
        />
        <input
          type="date"
          name="published_date"
          value={form.published_date}
          onChange={handleTextChanges}
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
        <button>Submit</button>
      </form>
    </section>
  );
}

export default AddBookForm;
