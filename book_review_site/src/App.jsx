import { createContext, useState, useContext } from "react";
import "./App.scss";
import Header from "./components/Header";
import Login from "./components/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import Home from "./components/Home";
import SingleBook from "./components/SingleBook";
import SearchResultsPage from "./components/SearchResultsPage";

const UserContext = createContext();

export const myUserContext = () => useContext(UserContext);

function App() {
  const [user, setUser] = useState(0);

  return (
    <>
      <UserContext.Provider value={{ user, setUser }}>
        <Router basename="/">
          <Header />
          <main>
            <Routes>
              <Route exact path="/" Component={Home} />
              <Route exact path="/login" Component={Login} />
              <Route path="books/:isbn" Component={SingleBook} />
              <Route path="book-search/:search" Component={SearchResultsPage} />
            </Routes>
          </main>
          <Footer />
        </Router>
      </UserContext.Provider>
    </>
  );
}

export default App;
