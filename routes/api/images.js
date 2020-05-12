const express = require("express");
const cors = require("cors");
const router = express.Router();
router.use(cors());
const jwtDecode = require('jwt-decode')
const multer = require('multer');

// Load Images model, load User model, load Project model
const Image = require("../../models/Image");
const Project = require("../../models/Project");
const User = require("../../models/User");

// set storage for images
var storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, 'uploads')
  },
  filename: function(req, file, cb){
    cb(null, file.fieldname + '-' + Date.now())
  }
})

var upload = multer({ storage: storage})

//GET all images for one project
router.get('/:projectID', (req, res) => {
    Project.findById(req.params.projectID).then(foundproject => {
      Image.find( { projectID: foundproject} )
        .then(images => res.json(images))
        .catch(err => console.log(err))
    })
  })
  
// POST multiple image
router.post('/:projectID', upload.array('myFiles', 12), (req, res) => {
  const files = req.files
    User.findById(jwtDecode(req.headers.authorization).id).then(founduser => {
        Project.findById(req.params.projectID).then(foundproject => {
            console.log(req.body)
            Image.create({
              file: files,
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

//FIND ONE AND SHOW -- fix this ?
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