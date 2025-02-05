import {asyncHandler} from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import { user } from "../models/user.model.js"
const registerUser = asyncHandler ( async (req,res)=>{
    const {fullName, username, email, password} = req.body

    if([fullName, username, email, password].some((field)=> field?.trim()==="")){
        throw new ApiError(400, "All fields are required")
    }

    const doesUserExist = await User.findOne
})