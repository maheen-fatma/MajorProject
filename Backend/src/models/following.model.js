import mongoose from "mongoose";
const followingSchema = new mongoose.Schema({
    follower: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    followed: { type: Schema.Types.ObjectId, ref: 'User', required: true },
},{timestamps:true})
export const following = mongoose.model("Following",followingSchema)