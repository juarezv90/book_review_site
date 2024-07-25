import React, { useEffect, useState } from 'react'

function BookSearch() {
    const [showForm, setShowForm] = useState(false)

    useEffect(() => {
        const searchIcon = document.getElementById('search_icon')
        const frameSize = window.innerWidth
    
        const showSearch = () => {
          if (showForm != 0) {
            setShowForm(0)
          } else {
            setShowForm(1)
          }
        }
    
        if (frameSize < 680){
          searchIcon.addEventListener('click', showSearch)
          return () => searchIcon.removeEventListener('click', showSearch)
        } else {
          setShowForm(1)
        }
      }, [showForm])
  return (
    <ul className="search">
        <img src="./search_icon.svg" width={40} height={32} alt="" id="search_icon"/>
        <li>
          <form id="search_form" className="search_form" style={showForm ? {height:'auto'}:{height:0}}>
            <input className="search" placeholder="search by title or author" />
            <button>Search</button>
          </form>
        </li>
      </ul>
  )
}

export default BookSearch