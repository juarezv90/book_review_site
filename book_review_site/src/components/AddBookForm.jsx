import React, { useState } from 'react'


const formTemplate = {
    title:"",
    author:"",
    bookImage:null,
    about_book:"",
    series:false,
    isbn:0,
}

// TODO: need to add functions to handle updataing state
// TODO:will need to write function that send POST request to server with data
// TODO:review getting file from input:file.

function AddBookForm() {
    const [form, setForm] = useState(formTemplate)
  return (
    <section className="addBook">
        <h2>Add Book to System</h2>
        <form id='add_book'>
            <input type="text" name="title" id="title" value={form.title} placeholder='Book title' />
            <input type="text" name="author" id="author" value={form.author} placeholder='Book Author' />
            <input type="file" name="book_img" id="book_img" />
            <textarea name='about_book' id='about_book' value={form.about_book} placeholder='Book preface'></textarea>
            <input type="number" maxLength={13} minLength={13} value={form.isbn} /> 
            <input type="checkbox" name="series" id="series" value={form.series} checked={form.series} />
            <button>Submit</button>
        </form>
    </section>
  )
}

export default AddBookForm