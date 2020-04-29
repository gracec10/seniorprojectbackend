const express = require("express");
const cors = require("cors");
const router = express.Router();
router.use(cors());
const jwtDecode = require('jwt-decode')

// Load Images model, load User model, load Project model
const Image = require("../../models/Image");
const Project = require("../../models/Project");
const User = require("../../models/User");

//GET all images in this project
router.get('/:projectID', (req, res) => {
    Image.find()
      .then(images => res.json(images))
      .catch(err => console.log(err))
  })
  
// POST one image
// figure out how to upload a bunch of images
// https://bezkoder.com/node-js-upload-store-images-mongodb/#Nodejs_uploadstore_multiple_images_in_MongoDB
router.post('/:projectID', (req, res) => {
    User.findById(jwtDecode(req.headers.authorization).id).then(founduser => {
        Project.findById(req.params.projectID).then(foundproject => {
            Image.create({
              file: req.body.content,
              user: founduser._id,
              adminID: founduser._id,
              projectID: foundproject._id
            })
              .then(image => {
                res.json(image)
                foundproject.questionIDs.push(image)
              })
              .then(_ => foundproject.save())
              .catch(err => console.log(err))
          })
    })
  })

//FIND ONE AND SHOW
router.get('/:projectID/:id', (req, res) => {
  Project.findById(req.params.projectID).then(foundproject => {
    Image.findById({ _id: req.params.id })
      .then(image => {
        res.json(image)
      })
      .catch(err => {
        console.log(err)
      })
  })
})

//FIND ONE AND DELETE
router.delete('/:projectID/:id', (req, res) => {
    Project.findById(req.params.projectID).then(foundproject => {
      Image.findOneAndDelete({
        _id: req.params.id
      })
        .then(deletedImage => {
          res.json(deletedImage)

        })
        .then(_ => foundproject.save())  
        .catch(err => console.log(err))
    })
  })

module.exports = router