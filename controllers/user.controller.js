import userModel from "../models/user.model.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import path from 'path'

export const Signup = async(req,res)=>{
    try {
        await userModel.create(req.body)
        return res.status(200).json({message:'User Account Created Successfully'})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const Login = async(req,res)=>{
    try {
        const {email,password} = req.body
        if(!email || !password){
            return res.status(400).json({
                message:'All fields are required '
            })
        }
        const user = await userModel.findOne({email:email})
        if(!user){
            return res.status(404).json({message:'User does not Exits'})
        }

        const isPasswordMatch = bcrypt.compareSync(password,user.password)
        if(!isPasswordMatch){
            return res.status(401).json({message:'Password does not Match'})
        }
        
        const payload = {
            email: user.email,
            mobile: user.mobile,
            fullname: user.fullname,
            id: user._id
        }

        const token = await jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'7d'})
        return res.status(200).json({
            message:'Login Successfully',
            token: token
        })


    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const updateProfileImage = async(req,res) =>{
    try {
        const {filename} = req.file
        const user = await userModel.findByIdAndUpdate(req.user.id,{image:filename})
        res.status(200).json({image: user.image})
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

export const fetchProfileImage = async(req,res) =>{
    try {
        const {image} = await userModel.findById(req.user.id)
        if(!image){
            return res.status(404).json({
                message:'Image not Found'
            })
        }
        const root = process.cwd()
        const file = path.join(root,"files",image)
        res.sendFile(file,(err)=>{
            if(err){
                return res.status(404).json({
                    message: "Image not Found"
                })
            }
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}