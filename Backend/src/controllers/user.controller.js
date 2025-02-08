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

const generateAccessAndRefreshToken = async(userId)=>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        //store refresh token in the database
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave:false})
        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Issue in generating Access and Refresh Tokens")
    }
}

const loginUser = asyncHandler ( async (req,res)=>{
    const {email, username, password} = req.body
    console.log(username);

    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }
    

    const user = await User.findOne({
        $or: [{username},{email}]
    })

    if(!user){
        throw new ApiError(401, "User does not exist. Please check the username or email entered and try again")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401, "Invalid password!")
    }

    //generate access and refresh token
    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id)

    const options = { //since cookies are modifiable at the frontend
        httpOnly: true,
        secure:true
    }
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(
        200,
        {
            user,
            accessToken,
            refreshToken
        },
        "User logged in successfully"
    ))
})

const logoutUser = asyncHandler ( async (req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken: undefined
            }
        },
        {
            new:true
        }
    )
    
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(200, {}, "User Logged out successfully")
    )
})

const refreshAccessToken = asyncHandler ( async (req,res)=>{
    const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken
    if(!incomingRefreshToken)
        throw new ApiError(401, "Unauthorized request")
    const decodedToken = JsonWebTokenError.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    const user = await User.findById(decodedToken)
    if(!user)
        throw new ApiError(401, "Unauthorized 2")
    if(incomingRefreshToken !== user?.refreshToken)
        throw new ApiError(401, "Unauthorized 3")

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(200, {}, "access token Refreshed successfully")
    )
})

export {
    registerUser,
    loginUser,
    logoutUser
}