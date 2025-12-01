// Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // 

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post("https://shophub-oc39.onrender.com/login", {
        email,  
        password,
      });

      const { token, user} = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user.name));
      localStorage.setItem("cart", JSON.stringify(user.cart || [])); // Save cart
      localStorage.setItem("wishlist", JSON.stringify(user.wishlist || [])); // Save wishlist
      localStorage.setItem("orders", JSON.stringify(user.orders || [])); // Save orders
      const savedCart = JSON.parse(localStorage.getItem("user.cart") || "[]");
      console.log("cart details", savedCart);

      if (onLogin) onLogin(user);



      setMessage("✅ Login successful!");
      navigate("/homepage");

    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login to Your Account</h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md transition duration-200"
          >
            Login
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-sm text-red-500">{message}</p>
        )}
        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account? <a href="/signup" className="text-indigo-600 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
