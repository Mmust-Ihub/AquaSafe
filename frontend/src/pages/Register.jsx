import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../lib/firebase"; // Import Firebase auth
import { useNavigate } from "react-router-dom";
import {  setDoc, doc } from "firebase/firestore";

function Signup() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Redirect hook

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
  
    // Sanitize phone input
    const cleanedPhone = phone.replace(/\s|-/g, "");
  
    if (!cleanedPhone.startsWith("+254") || cleanedPhone.length !== 13) {
      setError("Phone number must start with +254 and be 13 characters long.");
      return;
    }
  
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      const user = userCredential._tokenResponse.idToken
      localStorage.setItem(user_id, user)
      await setDoc(doc(db, "users", user.uid), {
        email: email,
        phone: cleanedPhone,
        role: "farmer"
      });
  
      alert("Account created successfully!");
      navigate("/dashboard"); 
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-700">Sign Up</h2>

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

        <form onSubmit={handleSignup} className="mt-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 mb-3 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="tel"
            placeholder="Phone (+2547xxxxxxxx)"
            className="w-full p-2 mb-3 border rounded"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-3 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full p-2 mb-3 border rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
