import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Following } from "../models/following.model.js";

//takes the follower from req.user._id and the followed from param
const followToggle = asyncHandler (async(req, res)=>{
    const follower = req.user._id
    const {followed} = req.params
    const existingFollow = await Following.findOne({ follower, followed });
    if (existingFollow) {
        await Following.findByIdAndDelete(existingFollow._id)
        return res.status(200).json(new ApiResponse(200, null, "User unfollowed successfully"));
    }
    //follower has followed 'followed'
    const followingRelation = await Following.create({
        follower,
        followed
    })
    return res.status(201).json(new ApiResponse(201, followingRelation, "followed successfully"))
})

const isFollowing = asyncHandler (async(req,res)=>{
    const follower = req.user._id
    const {followed} = req.params
    const existingFollow = await Following.findOne({ follower, followed });
    if (existingFollow) {
        return res.status(200).json(new ApiResponse(200, true, "Following"));
    }
    return res.status(200).json(new ApiResponse(200, false, "not following"));
})

export {
    followToggle,
    isFollowing
}