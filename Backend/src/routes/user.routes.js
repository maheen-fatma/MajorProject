import { Router } from "express";
import {loginUser, registerUser} from "../controllers/user.controller.js"
import {upload} from "../middleware/multer.middleware.js"
const router = Router()
router.route("/register").post(
    upload.single('avatar'), // Single file upload
    registerUser
);
router.route("/login").post(loginUser)
export default router;