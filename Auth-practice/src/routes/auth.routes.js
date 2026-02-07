const express = require('express')
const authController = require('../controllers/auth.controller')

const router = express.Router()

router.post('/register', authController.registerUser)

router.get('/test', (req,res)=>{
    console.log("cookies:", req.cookies);
    res.status(200).json({message: 'Test route accessed successfully',
        cookies: req.cookies
    })


})




module.exports = router