const userModel = require('../models/user.model')
const jwt= require('jsonwebtoken')
const emailService=require('../services/email.service')

async function  userRegisterController(req,res){
    const {email,name,password} = req.body

    const isExists = await userModel.findOne({email:email})
    if(isExists){
        return res.status(422).json({
            message:"User already exists",
            status:"failed"
        })
    }
    const user = await userModel.create({
        email,name,password
    })

    const token = jwt.sign({userId:user._id}, process.env.JWT_SECRET_KEY, {expiresIn:"1d"})

    res.cookie("token", token)
    res.status(201).json({
        message:"User registered successfully",
        status:"success",
        user,
        token
    })

    await emailService.sendRegisterEmail(email,name)
}

async function userLoginController(req,res){
    const {email,password} = req.body

    const user = await userModel.findOne({email:email}).select("+password")
    if(!user){
        return res.status(401).json({
            message:"User not found",
            status:"failed"
        })
    }
    const isMatch = await user.comparePassword(password)
    if(!isMatch){
        return res.status(401).json({
            message:"Invalid credentials",
            status:"failed"
        })
    }

    const token = jwt.sign({userId:user._id}, process.env.JWT_SECRET_KEY, {expiresIn:"1d"})

    res.cookie("token", token)
    return res.status(200).json({
        message:"User logged in successfully",
        status:"success",
        user,
        token
    })

}

module.exports = {userRegisterController, userLoginController}