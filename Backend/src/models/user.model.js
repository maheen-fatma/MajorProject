import mongoose from "mongoose"
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, lowercase:true },
    email: { type: String, required: true, unique: true, lowercase:true },
    fullName: { type: String, required: true },
    avatar: { type: String, default: '', required: true },
    password: { type: String, required: true },
    refreshToken: { type: String, default: '' },
},{timestamps:true})
export const user = mongoose.model("User",userSchema)