import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true
    },
    filename:{
        type:String,
        required:true,
        lowercase:true,
        trim:true
    },
    type:{
        type:String,
        required:true,
        lowercase:true
    },
    path:{
        type:String,
        required:true,
        trim:true
    },
    size:{
        type:Number,
        required:true,
        trim:true
    },

},{timestamps:true})

const fileModel = mongoose.model('File',fileSchema)
export default fileModel