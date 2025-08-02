import { config } from "dotenv";
config()

import mongoose from "mongoose";
mongoose.connect(process.env.DB).then(()=>{
    console.log('DB connected')
}).catch((err)=>{
    console.log(err)
})



import express from "express";
import multer from "multer";
import cors from 'cors'
import {v4} from 'uuid'
import path from 'path'
import { fetchProfileImage, Login, Signup, updateProfileImage } from "./controllers/user.controller.js";
import { createFile, fecthFile,deleteFile, downloadFile } from "./controllers/file.controller.js";
import { dashboardData } from "./controllers/dashboard.controller.js";
import { verifyToken } from "./controllers/token.controller.js";
import { shareFile,fetchShareFile } from "./controllers/share.controller.js";
import { AuthMiddleware } from "./middleware/auth.middleware.js";

const root = process.cwd()
const uniqueId = v4

const storage = multer.diskStorage({
    destination: (req,file,next)=>{
        next(null,'files/')
    },
    filename: (req,file,next)=>{
        // console.log(file)
        const nameArr = file.originalname.split('.')
        // console.log(nameArr)
        const ext = nameArr.pop()
        // console.log(ext)
        const name = `${uniqueId()}.${ext}`
        // console.log(name)
        next(null,name)
    }
})
const upload = multer({
    storage:storage
})
const app = express()
const PORT = process.env.PORT || 8080
app.listen(PORT || 8080,()=>{
    console.log(`server running on ${PORT}`)
})


app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(express.static("view"))
app.use(cors({
    origin: 'http://192.168.213.224:5500'
}))


const getPath = (filename) =>{
    return path.join(root, 'view', filename)
}
app.get('/signup',(req,res)=>{
    const p = getPath('signup.html')
    res.sendFile(p)
})

app.get('/login', (req,res) => {
    const p = getPath('index.html')
    res.sendFile(p)
})

app.get('/', (req,res)=>{
    const p = getPath('index.html')
    res.sendFile(p)
})

app.get('/dashboard',(req,res)=>{
    const p = getPath('app/dashboard.html')
    res.sendFile(p)
})

app.get('/files',(req,res)=>{
    const p = getPath('app/files.html')
    res.sendFile(p)
})

app.get('/history', (req,res)=>{
    const p = getPath('app/history.html')
    res.sendFile(p)
})



app.post('/api/users/signup',Signup)
app.post('/api/users/login', Login)
app.post('/api/users/profile-picture', AuthMiddleware,upload.single('picture'), updateProfileImage)
app.get('/api/users/profile-picture',AuthMiddleware,fetchProfileImage)
app.post('/api/file',AuthMiddleware, upload.single('file'),createFile )
app.get('/api/file',AuthMiddleware, fecthFile)
app.delete('/api/file/:id',AuthMiddleware,deleteFile)
app.get('/api/file/download/:id', downloadFile)
app.get('/api/dashboard', AuthMiddleware, dashboardData)
app.post('/api/token/verify',verifyToken)
app.post('/api/file/share',AuthMiddleware,shareFile)
app.get('/api/file/share',AuthMiddleware,fetchShareFile)


app.use((req,res)=>{
    res.status(404).json({
        message:'Endpoint not found'
    })
})


