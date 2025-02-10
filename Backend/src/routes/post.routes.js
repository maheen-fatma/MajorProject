import { Router } from "express";
import { uploadPost, viewPosts } from "../controllers/post.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {upload} from "../middleware/multer.middleware.js"
const router = Router()
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/view-posts").get(viewPosts)
router.route("/upload-post").post(upload.single('post'),uploadPost)

export default router