import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: String,
    name: String,
    age: Number,
    email: String,
    password: String,
    posts: [
        {type: mongoose.Schema.Types.ObjectId, ref: "Post"}
    ]
});

const User = mongoose.model('User', userSchema);
export default User;
