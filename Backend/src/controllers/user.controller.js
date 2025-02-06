import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js";


const registerUser = asyncHandler ( async (req,res)=>{
    
    const {fullName, username, email, password} = req.body
    
    
    if([fullName, username, email, password].some((field)=> field?.trim()==="")){
        throw new ApiError(400, "All fields are required")
    }

    const doesUserExist = await User.findOne({
        $or: [{username},{email}]
    })
    if(doesUserExist){
        throw new ApiError(409, "User already exist")
    }

    const avatarLocalPath = req.file?.path;  
    
    
    
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    
    if(!avatar){
        throw new ApiError(400, "Avatar not uploaded to cloudinary")
    }

    const user = await User.create({
        fullName,
        avatar:avatar.url,
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    if(!createdUser) {
        throw new ApiError(500, "user could not be created");
        
    }

    return res.status(201)
    .json(new ApiResponse(200, createdUser,"User registered"))
    
})

export {registerUser}