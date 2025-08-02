import fileModel from "../models/file.model.js";

export const dashboardData = async(req,res)=>{
    try {
        const reports = await fileModel.aggregate([
            {
                $group:{
                    _id:'$type',
                    total:{$sum:1}
                }
            }
        ])
       return  res.status(200).json(reports)
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}