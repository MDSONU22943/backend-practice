const musicModel = require('../models/music.model')
const jwt = require('jsonwebtoken')
const { uploadFile} = require('../services/storage.service')


async function createMusic(req,res){
    console.log("Cookies:", req.cookies)
    const token = req.cookies.token

    if(!token){
        return res.status(401).json({message: 'Unauthorized'})
    }

    try{
        const decoded=jwt.verify(token, process.env.JWT_SECRET)
         console.log("Decoded token:", decoded)
        if(decoded.role!=='artist'){
            return res.status(403).json({message: 'Forbidden! you don not have access to create an music'})
        }
        const {title} = req.body
    const file = req.file

    // const result = await uploadFile(file.buffer.toString('base64'))
    const base64File = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`
const result = await uploadFile(base64File)


    const music = new musicModel({
        uri: result.url,
        title,
        artist: decoded.id
    })

    return res.status(201).json({message: 'Music created successfully', music})
    }catch (err) {
  console.error("Create music error:", err.message)

  return res.status(500).json({
    message: err.message
  })
}


    

}

module.exports = { createMusic }