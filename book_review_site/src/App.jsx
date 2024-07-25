import { createContext, useState } from "react";
import "./App.scss";
import Header from "./components/Header";
import Login from "./components/Login";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Footer from "./components/Footer";

export const UserContext = createContext();

function App() {
  const [user, setUser] = useState(0);
  return (
    <>
      <UserContext.Provider value={{ user, setUser }}>
        <Router basename="/">
          <Header />
          <Routes>
            <Route exact path="/" element="<div></div>" />
            <Route exact path="/login" Component={Login} />
          </Routes>
          <Footer />
        </Router>
      </UserContext.Provider>
    </>
  );
}

export default App;
