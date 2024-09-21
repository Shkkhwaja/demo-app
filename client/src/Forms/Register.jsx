import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


export default function Register() {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

  
    function login() {
      navigate("/login")
    }
    
    function registerUser(e) {
      e.preventDefault();
  
      
      axios.post("https://demo-app-two-psi.vercel.app/register", { name, username, email, password }, {
        withCredentials: true // This ensures cookies are sent
      }).then((result) => {
          console.log(result);
          alert("Registration successful");
          navigate("/login"); 
        })
        .catch((err) => {
          console.error(err);
          alert("Registration failed");
        });
    }
  
    return (
      <div className="bg-zinc-800 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-sm p-6 bg-gray-100 rounded-lg shadow-lg">
          <h2 className="underline text-3xl text-blue-400 font-bold text-center mb-6">
            Register here
          </h2>
  
          <form onSubmit={registerUser} className="flex flex-col gap-4">
            <input
              type="text"
              className="border-2 border-zinc-300 h-[2.4em] w-full text-black p-2"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              className="border-2 border-zinc-300 h-[2.4em] w-full text-black p-2"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="email"
              className="border-2 border-zinc-300 h-[2.4em] w-full text-black p-2"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="border-2 border-zinc-300 h-[2.4em] w-full text-black p-2"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span>Already account then<p className="underline text-blue-700 cursor-pointer" onClick={login}>login</p></span>
            <input
              type="submit"
              className="bg-blue-700 text-white h-[2.4em] rounded-sm border-2 border-black text-lg cursor-pointer hover:bg-blue-600"
              value="Register"
            />
          </form>
        </div>
      </div>
    );
  }
  
