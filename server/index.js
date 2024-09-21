import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import User from "./models/user.js";
import Post from "./models/post.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config()
const app = express();

// Middleware configuration
const allowedOrigins = [
  'http://localhost:3000', // Local development
  'https://commentdemo.vercel.app' // Your deployed frontend
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true // This ensures that cookies are sent with requests
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// MongoDB connection
mongoose
  .connect(`${process.env.MONGO_DB}`)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Root route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Register route
app.post("/register", async (req, res) => {
  const { email, password, name, username } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send("User already registered");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      email,
      name,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = jwt.sign(
      { email: newUser.email, userid: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set cookie with token
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // Set to true in production with HTTPS
      sameSite: "none",
    });

    res.status(201).send("User registered successfully");
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).send("Username not found");

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).send("Invalid credentials");

    // Generate JWT token
    const token = jwt.sign(
      { email: user.email, userid: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set cookie with token
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // Set to true in production with HTTPS
      sameSite: "none",
    });

    res.status(200).send("Login successful");
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Logout route
app.get("/logout", (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true, // Should be true in production
    sameSite: "lax",
    expires: new Date(0),
  });

  res.status(200).send("Logged out successfully");
});

// Middleware to check if the user is logged in
function isLoggedIn(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "You must be logged in" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
}

// Profile route
app.get("/profile", isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.user.userid).populate("posts");
    if (!user) return res.status(404).send("User not found");

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).send("Server error");
  }
});


app.post("/post", isLoggedIn, async (req, res) => {
  try {
    const user = await User.findOne({email: req.user.email})
    let { content } = req.body;
    let post = await Post.create({
      user: user._id,
      content,
    });
    user.posts.push(post._id)
    await user.save()
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Start server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
