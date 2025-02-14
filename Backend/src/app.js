import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express()
import userRouter from './routes/user.routes.js'
import postRouter from './routes/post.routes.js'
import { ApiError } from "./utils/ApiError.js";  


app.use(cors({
    origin: "http://localhost:5173", //process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

app.use("/api/v1/users", userRouter)
app.use("/api/v1/posts", postRouter)

//global error handler middleware
//without this, the error thrown by ApiError will not be caught and the request would be crashed and an error stack will be shown in the backend console.
app.use((err, req, res, next) => {
    
    
    if (err instanceof ApiError) {
        
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors,
        });
    }

    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
});
export {app}