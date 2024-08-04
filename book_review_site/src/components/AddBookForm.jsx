import React, { useState } from 'react'


const formTemplate = {
  title: "",
  author: "",
  book_image: null,
  about_book: "",
  series: false,
  isbn: 0,
}

// TODO: need to add functions to handle updataing state
// TODO:will need to write function that send POST request to server with data
// TODO:review getting file from input:file.
function AddBookForm() {
  const [form, setForm] = useState(formTemplate)

  const handleTextChanges = (e) => {
    const { name, value, checked, files, type } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: type==='checkbox' ? checked : type === 'file' ? files[0] : value,
    }))    

  }


  return (
    <section className="addBook">
      <h2>Add Book to System</h2>
      <form id='add_book'>
        <input type="text" name="title" id="title" value={form.title} placeholder='Book title' onChange={handleTextChanges} />
        <input type="text" name="author" id="author" value={form.author} placeholder='Book Author' onChange={handleTextChanges} />
        <div className="book_image">
          <label htmlFor="book_img">Book Cover: </label>
          <input type="file" name="book_image" id="book_image" onChange={handleTextChanges} />
        </div>
        <textarea name='about_book' id='about_book' value={form.about_book} placeholder='Book preface' onChange={handleTextChanges}></textarea>
        <input type="number" name="isbn" maxLength={13} minLength={13} value={form.isbn} onChange={handleTextChanges} />
        <div className="series">
          <label htmlFor="series">Is a series:</label>
          <input type="checkbox" name="series" id="series" checked={form.series} onChange={handleTextChanges} />
        </div>
        <button>Submit</button>
      </form>
    </section>
  )
}

export default AddBookForm