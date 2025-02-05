import mongoose from "mongoose"
import bcrypt from "bcrypt"
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, lowercase:true },
    email: { type: String, required: true, unique: true, lowercase:true },
    fullName: { type: String, required: true },
    avatar: { type: String, default: '', required: true },
    password: { type: String, required: true },
    refreshToken: { type: String, default: '' },
},{timestamps:true})
userSchema.pre("save", async function (next){
    if(!this.isModified("password"))
        return next()
    this.password = await bcrypt.hash(this.password,10)
    next()
})
export const user = mongoose.model("User",userSchema)