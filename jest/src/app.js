const express = require('express')
const validationRules=require('./middlewares/validation.middleware')
const app = express()
app.use(express.json())

app.get("/",  validationRules.registerUserValidationRules,(req,res)=>{
    res.status(200).json({
        message:"Hello world"
    })
})

app.post('/register',(req,res)=>{
    const {username, email,password}=req.body;
    res.status(201).json({
        message:"User registered successfully",
        user:{username,email,password}
    })
    
})

module.exports =app