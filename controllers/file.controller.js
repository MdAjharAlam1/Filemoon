import fileModel from "../models/file.model.js";
import fs from 'fs'
import path from 'path'

const getType = (type) =>{
    const ext = type.split("/").pop()

    if(ext === "x-msdownload"){
        return "application/exe"
    }

    return type
}

export const createFile = async(req,res) =>{
    try {
        const {filename} = req.body
        const file = req.file
        // console.log(file)
        const payload = {
            filename: filename,
            type: getType(file.mimetype),
            size: file.size,
            path: (file.destination+file.filename),
            user: req.user.id

        }
        // console.log(payload)
        await fileModel.create(payload)
        
        return res.status(200).json({
            payload
        })
        
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

export const fecthFile = async(req,res) =>{
    try {
        const {limit} = req.query
        const files = await fileModel.find({user: req.user.id}).sort({createdAt:-1}).limit(limit)
        return res.status(200).json(files)
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

export const deleteFile = async(req,res)=>{
    try {
        const {id} = req.params
        const file = await fileModel.findByIdAndDelete(id)

        if(!file){
            return res.status(404).json({
                message:'File not found'
            })
        }
        fs.unlinkSync(file.path)
        return res.status(200).json(file)

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

export const downloadFile = async(req,res)=>{
    try {
        const {id} = req.params
        const file = await fileModel.findById(id)
        // console.log(file)
    
        // console.log(ext)
        
        if(!file){
            return res.status(404).json({
                message: 'File not found'
            })
        }
        const ext = file.type.split("/").pop()
        // console.log(ext)
        const root = process.cwd()
        const filePath = path.join(root,file.path)
        
        res.setHeader('Content-Disposition', `attachment; filename="${file.filename}.${ext}"`);

        
        res.sendFile(filePath,(err)=>{
            if(err){

                res.status(400).json({
                    message:'File not found'
                })
            }
        })
        
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}