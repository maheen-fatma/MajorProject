import {v2 as cloudinary } from 'cloudinary'
import fs from "fs"

cloudinary.config({
    process.env.CLOUD_NAME: , 
    process.env.API_KEY: ,
    process.env.API_SECRET:
})