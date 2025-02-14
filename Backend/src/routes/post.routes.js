import { Router } from "express";
import { deletePost, editPost, getPostById, uploadPost, viewPosts } from "../controllers/post.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {upload} from "../middleware/multer.middleware.js"
import { getLikes, likePost } from "../controllers/like.controller.js";
const router = Router()
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/view-posts").get(viewPosts)
router.route("/upload-post").post(upload.single('post'),uploadPost)
router.route("/:id").get(getPostById)
router.route("/:id/edit-post").patch(editPost)
router.route("/:id/delete-post").delete(deletePost)
router.route("/:id/like").post(likePost)
router.route("/:id/likes").post(getLikes)

export default router