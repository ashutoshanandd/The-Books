import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Footer from "./Components/Footer.js";
import Navbar from "./Components/Navbar.js";
import Home from "./Components/Home.js";
import Books from "./Components/Books.js";
import AboutUs from "./Components/AboutUs.js";
import Login from "./Components/Login.js"
import Signup from "./Components/Signup.js"
import MyBorrowedBooks from "./Components/MyBorrowedBooks.js";

import AdminDashboard from "./Components/AdminDashboard";
import AddBook from "./Components/AddBook";
import RemoveBook from "./Components/RemoveBook";
import ManageLoans from "./Components/ManageLoans";
import ManageStudents from "./Components/ManageStudents";
import AdminLogin from "./Components/AdminLogin.js";



function App() {
  return (
    <Router>
      <Navbar /> 

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/books" element={<Books />} />
        <Route path="/logging" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/my-borrows" element={<MyBorrowedBooks />} />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/add-book" element={<AddBook />} />
        <Route path="/admin/remove-book" element={<RemoveBook />} />
        <Route path="/admin/manage-loans" element={<ManageLoans />} />
        <Route path="/admin/manage-students" element={<ManageStudents />} />
        <Route path="/admin/login" element={<AdminLogin />} />


      </Routes>
      <Footer/>
    </Router>
  );
}



export default App;
