import jwt from 'jsonwebtoken'
// import { config } from 'dotenv'
// config()

export const AuthMiddleware = async(req,res,next)=>{
    try {
        const {authorization}  = req.headers
        // console.log(authorization ,"ajhar")
        if(!authorization){
            return res.status(401).json({
                message: "Unauthorized"
            })
        }
    
        const [type,token] = authorization.split(' ')
        // console.log(type,token, "ajhar breare")
        if(type !== "Bearer"){
            return res.status(401).json({
                message:"Invalid Request"
            })
        }
        // console.log(token)
        const user = await jwt.verify(token,process.env.JWT_SECRET)
        req.user = user
       next()
    } catch (error) {
        console.log(error)
    }
}