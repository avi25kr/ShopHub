import './App.css';
import HomePage from './homepage.js';
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from './signup.js';
import Login from './login.js';
import Homepage from './homepage.js';

import Test_homepage from './test_homepage.js'; 



function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path= "/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/test_homepage" element={<Test_homepage />} />
        </Routes>

      </Router>
  );
}

export default App;
