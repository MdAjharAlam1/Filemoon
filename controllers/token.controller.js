import jwt from 'jsonwebtoken'

export const verifyToken = async(req,res)=>{
    try {
        const token = req.body.token
        const payload = await jwt.verify(token,process.env.JWT_SECRET)
        res.status(200).json(payload)

    } catch (error) {
        res.status(401).json({
            message:'Invailid Token'
        })
    }

}