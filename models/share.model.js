import e from "express";
import mongoose from "mongoose";

const shareSchema = new mongoose.Schema({
    from:{
        type:mongoose.Types.ObjectId,
        ref: 'User',
        required:true
    },
    recieverEmail:{
        type:String,
        required:true
    },
    file:{
        type: mongoose.Types.ObjectId,
        ref:'File',
        required:true
    }
},{timestamps:true})

const shareModel = mongoose.model('Share',shareSchema)

export default shareModel