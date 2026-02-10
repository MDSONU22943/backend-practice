const musicModel = require("../models/music.model");
const jwt = require("jsonwebtoken");
const { uploadFile } = require("../services/storage.service");
const albumModel = require("../models/album.model");

async function createMusic(req, res) {
  console.log("Cookies:", req.cookies);

  try {
    const { title } = req.body;
    const file = req.file;

    // const result = await uploadFile(file.buffer.toString('base64'))
    const base64File = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
    const result = await uploadFile(base64File);

    const music = await musicModel.create({
      uri: result.url,
      title,
      artist: req.user.id,
    });

    return res
      .status(201)
      .json({ message: "Music created successfully", music });
  } catch (err) {
    console.error("Create music error:", err.message);

    return res.status(500).json({
      message: err.message,
    });
  }
}

async function createAlbum(req, res) {

  try {
    const { title, musics } = req.body;
    const album = await albumModel.create({
      title,
      artist: req.user.id,
      musics: musics,
    });

    return res
      .status(201)
      .json({ message: "Album created successfully", album });
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "Unauthorized" });
  }
}


async function getAllMusics(req, res) {

    const musics = await musicModel.find().limit(10).populate('artist')

    return res.status(200).json({
        message:"Musics retrieved successfully",
        musics})
}

async function getAllAlbums(req, res) {
    const albums = await albumModel.find().select("title artist").populate("artist").populate("musics")

    return res.status(200).json({
        message:"Albums retrieved successfully",
        albums})
}

async function getAlbumById(req, res) {
    const { albumId } = req.params

    const album = await albumModel.findById(albumId).populate("artist").populate("musics")

    return res.status(200).json({message:"Album retrieved successfully", album})

}


module.exports = { createMusic, createAlbum, getAllMusics, getAllAlbums , getAlbumById};