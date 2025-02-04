import mongoose from "mongoose";
const commentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    associatedPost: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
},{timestamp: true})
export const comment = mongoose.model("Comment", commentSchema)