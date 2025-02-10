import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { Post } from "../models/post.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js";
import { v2 as cloudinary} from 'cloudinary'


/*  TODO
// (done) upload post
//edit post
// (done)view all post / post by specific user
//view specific post by Id
//delete specific post*/

//view all post / posts by giving a specific owner 
const viewPosts = asyncHandler(async(req,res)=>{
    
        const {owner} = req.query // send the _id of the user whose post you like to view OR send no parameter to view all posts
        const query = owner? {owner}: {}
        const posts = await Post.find(query).select("title imageFile");
        if(!owner)
            return res.status(200).json(new ApiResponse(200, posts, "All posts viewed successully"))
        else
            return res.status(200).json(new ApiResponse(200, posts, "Posts for the user viewed successully"))
        
})

//upload post
const uploadPost = asyncHandler( async (req,res)=>{

    //post uploaded to local file via multer middleware

    //take title, content and purchase link
    const {title, content, purchaseLink} = req.body
    if(!title || !content){
        throw new ApiError(400, "Both title and content are necessary fields")
    }

    if(purchaseLink.trim())
    new URL(purchaseLink.trim())

    const postLocalPath = req.file?.path 
    if(!postLocalPath){
        throw new ApiError(400, "Post required")
    }
    const postCloudinary = await uploadOnCloudinary(postLocalPath)

    if(!postCloudinary){
        throw new ApiError (400, "Cannot be uploaded to cloudinary")
    }

    const post = await Post.create({
        owner: req.user._id,
        imageFile: postCloudinary.url,
        purchaseLink: purchaseLink.trim(),
        title,
        content
    })

    const createdPost = await Post.findById(post._id)
    if(!createdPost){
        throw new ApiError(400, "New post could not be created")
    }

    return res.status(200).json(new ApiResponse(201, createdPost, "Post created successfully"))
})

export {
    viewPosts,
    uploadPost
}