import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { likePost } from "../controllers/like.controller.js";
const router = Router()

//IN POST ROUTES

export default router