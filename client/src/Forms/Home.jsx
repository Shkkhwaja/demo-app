import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [postContent, setPostContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [reload, setReload] = useState(false);


  function handleLogout() {
    axios
      .get("http://localhost:3000/logout" || "https://demo-app-two-psi.vercel.app/logout", { withCredentials: true })
      .then((response) => {
        console.log(response.data);
        navigate("/login");
      })
      .catch((err) => {
        console.error("Logout error:", err.response?.data || err.message);
      });
  }

 
  


  function fetchProfile() {
    axios
      .get("http://localhost:3000/profile" || "https://demo-app-two-psi.vercel.app/profile", { withCredentials: true })
      .then((response) => {
        setProfileData(response.data.user);
        setPosts(response.data.user.posts);
      })
      .catch((err) => {
        navigate("/login");
        console.error("Error fetching profile:", err.response?.data || err.message);
      });
  }

  function createPost(e) {
    e.preventDefault()
    axios
      .post(
        "http://localhost:3000/post" || "https://demo-app-two-psi.vercel.app/post",
        { content: postContent },
        { withCredentials: true }
      )
      .then((res) => {
        console.log("Post created:", res.data);
        setPostContent(""); 
        setReload(!reload);
        navigate("/profile")
      })
      .catch((err) => {
        console.error("Error creating post:", err.response?.data || err.message);
      });
  }

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile, reload]);

  return (
    <div className={`${posts.length >= 2 ? "h-auto" : "h-screen"} w-full bg-zinc-950`}>
      <h1 className="text-center text-white text-2xl">Profile</h1>
      <button
        onClick={handleLogout}
        className="bg-red-600 py-2 px-3 text-white rounded-lg border-2 border-zinc-600 mx-2 my-2 "
      >
        Logout
      </button>
      {profileData ? (
        <div>
          <p className="text-[20px] font-bold text-blue-600">
            Hello : {profileData.name}
          </p>
        </div>
      ) : (
        <p>No profile data available</p>
      )}

      <h2 className="font-bold text-2xl underline">Hello</h2>

      <div className="mx-10 my-12">
        <h2 className="text-stone-500 font-serif text-[14px] mt-2">
          You can create a post:
        </h2>
        <form onSubmit={createPost}>
          <textarea
            value={`${postContent == "" ? "" : postContent}`}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="Write what's on your mind?"
            className="p-3 w-1/3 text-white outline-none resize-none bg-transparent border-2 border-zinc-800 rounded-md"
          />
          <input
            type="submit"
            value="Create new post"
            className="px-3 py-2 text-sm bg-blue-500 block rounded-md w-40"
          />
        </form>
      </div>


      <div className="posts mx-6 mt-4 pb-4">
        <h3 className="text-zinc-400">Your Posts.</h3>
        {posts.length > 0 ? (
    posts.concat().reverse().map((post) => (
      <div
        key={post._id}
        className="post w-1/3 p-4 my-4  rounded-md text-white border-[1px] bg-zinc-800 border-zinc-800"
      >
        <h4 className="text-blue-500 mb-3 underline underline-offset-4">@{profileData.username}</h4>
        <p className="text-sm tracking-tight">{post.content}</p>
        <div className="flex mt-5 gap-4">
          <a className="text-blue-500 cursor-pointer">Like {post.like || 0}</a>
          <a className="text-zinc-400">Edit</a>
        </div>
      </div>
    ))
  ) : (
    <p>No posts available</p>
  )}
       
      </div>
    </div>
  );
}
