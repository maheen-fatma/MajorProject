import { Router } from "express";
import {changePassword, getCurrentUser, loginUser, logoutUser, registerUser, updateAccountDetails, updateUserAvatar} from "../controllers/user.controller.js"
import {upload} from "../middleware/multer.middleware.js"
import { verifyJWT } from "../middleware/auth.middleware.js";
import { currentUserJWT } from "../middleware/currentUser.middleware.js";
import { getLikedPostByUser } from "../controllers/like.controller.js";
const router = Router()
router.route("/register").post(
    upload.single('avatar'), // Single file upload
    registerUser
)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT ,logoutUser)
router.route("/change-password").post(verifyJWT ,changePassword) 
router.route("/current-user").get(currentUserJWT, getCurrentUser) 
router.route("/update").patch(verifyJWT, updateAccountDetails) 
router.route("/update-avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar) 
router.route("/my-likes").get(verifyJWT, getLikedPostByUser)//posts that the user has liked
export default router;