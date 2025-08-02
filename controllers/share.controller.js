
import shareModel from "../models/share.model.js";
import nodemailer from 'nodemailer'

import { config } from "dotenv";
config()


const conn = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.SMTP_EMAIL,
        pass:process.env.SMTP_PASSWORD
    }
})


const mailTemplate = (link) =>{
    return `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8" />
                    <title>Filemoon - File Shared With You</title>
                </head>
                <body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#f4f4f4;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f4;padding:20px 0;">
                        <tr>
                            <td align="center">
                                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;">
                                    <tr>
                                        <td style="background-color:#181818;padding:20px;text-align:center;color:#ffffff;font-size:24px;font-weight:bold;">
                                            Filemoon
                                            <div style="font-size:14px;font-weight:normal;margin-top:4px;color:#dddddd;">India's best file sharing platform</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding:30px;text-align:left;">
                                            <h2 style="margin-top:0;color:#333333;">You've received a file!</h2>
                                            <p style="font-size:16px;color:#555555;line-height:1.5;">
                                                A file has been shared with you via <strong>Filemoon</strong>. You can download it using the button below.
                                            </p>
                                            <table cellpadding="0" cellspacing="0" border="0" style="margin:30px 0;">
                                                <tr>
                                                    <td align="center" bgcolor="#4CAF50" style="border-radius:5px;">
                                                        <a href="${link}" target="_blank" style="display:inline-block;padding:12px 24px;color:#ffffff;text-decoration:none;font-size:16px;font-weight:bold;">
                                                            Download File
                                                        </a>
                                                    </td>
                                                </tr>
                                            </table>
                                            <p style="font-size:14px;color:#888888;">
                                                <strong>File Name:</strong> {{file_name}}<br />
                                                <strong>File Size:</strong> {{file_size}}<br />
                                                <strong>Expires on:</strong> {{expiry_date}}
                                            </p>
                                            <p style="font-size:13px;color:#999999;">
                                                This file will no longer be available after the expiration date. Please download it before then.
                                            </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="background-color:#f1f1f1;padding:20px;text-align:center;font-size:12px;color:#777777;">
                                            &copy; 2025 Filemoon. All rights reserved.<br />
                                            India's best file sharing platform
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
            </html>

    `
}

export const shareFile = async(req,res) =>{
    try {
        const {email, fileId} = req.body
        const link  = `http://localhost:8080/api/file/download/${fileId}`
        const options = {
            from:process.env.SMTP_EMAIL,
            to:email,
            subject:'Filemoon - New File Received',
            html: mailTemplate(link)
        }
        const payload = {
            from: req.user.id,
            recieverEmail: email,
            file: fileId
        }
        await  Promise.all([
            conn.sendMail(options),
            shareModel.create(payload)
        ])
        
        res.status(200).json({
            message: 'Email Sent Successfully'
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

export const fetchShareFile = async(req,res) =>{
    try {
        const {limit} = req.query
        const response = await shareModel.find({from: req.user.id}).sort({createdAt:-1}).limit(limit).populate('file','-user -_id')
        res.status(200).json(response)
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}   