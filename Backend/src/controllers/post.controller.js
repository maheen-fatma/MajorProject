import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { Post } from "../models/post.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js";
import { v2 as cloudinary} from 'cloudinary'

/*  TODO
//upload post
//edit post
// (done)view all post / post by specific user
//view specific post by Id
//delete specific post*/

//view all post / posts by giving a specific owner 
const viewPosts = asyncHandler(async(req,res)=>{
    
        const {owner} = req.query
        const query = owner? {owner}: {}
        const posts = await Post.find(query).select("title imageFile");
        if(!owner)
            return res.status(200).json(new ApiResponse(200, posts, "All posts viewed successully"))
        else
            return res.status(200).json(new ApiResponse(200, posts, "Posts for the user viewed successully"))
        
})

export {
    viewPosts,
}