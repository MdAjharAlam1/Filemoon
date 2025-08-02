import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    image:{
        type:String
    },
    fullname:{
        type:String,
        trim:true,
        required:true,
        lowercase:true
    },
    mobile:{
        type:String,
        trim:true,
        required:true,
    },
    email:{
        type:String,
        trim:true,
        lowercase:true,
        required:true,
        matches:[
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Invail Email'
        ]
    },
    password:{
        type:String,
        required:true,
        trim:true
    }

},{timestamps:true})

userSchema.pre('save',async function(next){
    const count = await mongoose.model('User').countDocuments({mobile:this.mobile})
    
    // check duplicate  mobile
    if(count > 0){
        throw next(new Error('Mobile Already Exists'))
    }
    next()
})

userSchema.pre('save',async function(next){
    const count = await mongoose.model('User').countDocuments({email:this.email})
    
    // check duplicate email
    if(count > 0){
        throw next(new Error('Email Already Exists'))
    }
    next()
})

userSchema.pre('save',async function(next){
    const hashedPassword = await bcrypt.hash(this.password,12)
    this.password = hashedPassword
    next()
})

const userModel = mongoose.model('User',userSchema)
export default userModel