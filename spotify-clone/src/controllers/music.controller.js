const musicModel = require('../models/music.model')
const jwt = require('jsonwebtoken')
const { uploadFile} = require('../services/storage.service')
const albumModel = require('../models/album.model')


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


    const music = await musicModel.create({
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


async function createAlbum(req,res){
    const token = req.cookies.token

    if(!token){
        return res.status(401).json({message: 'Unauthorized'})
    }

    try{
        const decoded=jwt.verify(token, process.env.JWT_SECRET)
        if(decoded.role!== 'artist'){
            return res.status(403).json({message: 'Forbidden! you don not have access to create an album'})
        }

        const {title, musics}= req.body;
        const album = await albumModel.create({
            title,
            artist: decoded.id,
            musics: musics
        })

        return res.status(201).json({message: 'Album created successfully', album})
    }catch(err){
        console.log(err)
        return res.status(401).json({message: 'Unauthorized'})
    }
}

module.exports = { createMusic, createAlbum} 