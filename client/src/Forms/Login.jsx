import axios from 'axios';
import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';


export default function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  function loginUser(e){
    e.preventDefault()
    axios.post("http://localhost:3000/login", { username, password }, {
      withCredentials: true // This ensures cookies are sent
    }).then((result) => {
      console.log(result);
      alert("Login successful");
      navigate("/home"); 
    })
    .catch((err) => {
      console.error(err);
      alert("Login failed");
    });

  }
function register() {
  navigate("/")
}

  return (
    <div className="bg-zinc-800 min-h-screen flex items-center justify-center">
    <div className="w-full max-w-sm p-6 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="underline text-3xl text-blue-400 font-bold text-center mb-6">
        Login here
      </h2>

      <form onSubmit={loginUser} className="flex flex-col gap-4">

        <input
          type="text"
          className="border-2 border-zinc-300 h-[2.4em] w-full text-black p-2"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          className="border-2 border-zinc-300 h-[2.4em] w-full text-black p-2"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="submit"
          className="bg-blue-700 text-white h-[2.4em] rounded-sm border-2 border-black text-lg cursor-pointer hover:bg-blue-600"
          value="Login"
        />
        <span>Already account then<p className="underline text-blue-700 cursor-pointer" onClick={register}>Register</p></span>
      </form>
    </div>
  </div>
  )
}
