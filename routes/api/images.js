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
    cb(null, './uploads/')
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
  
// POST -- add existing images ids to project.  Just for temporary use
router.post('/edit', (req, res) => {
  console.log("id: "+req.body.id)
  User.findById(jwtDecode(req.headers.authorization).id).then(founduser => {
    Project.findById(req.body.projectId).then(foundproject => {
      Image.findById(req.body.id).then(foundimage => {
        foundproject.imageIDs.push(foundimage)})
        .then(_ => foundproject.save())
        .catch(err => console.log(err))
      
      })
    })
})

// POST multiple image
router.post('/:projectID', upload.array('myFiles', 12), (req, res) => {
  const files = req.files[0]
  console.log(req.files)
  console.log("filename--"+req.files[0].filename)
  console.log("path--"+req.files[0].path)
    User.findById(jwtDecode(req.headers.authorization).id).then(founduser => {
        Project.findById(req.params.projectID).then(foundproject => {
            Image.create({
              file: "files",
              name: files.filename, // not really sure what to store
              path: files.path,
              user: founduser._id,
              adminID: founduser._id,
              projectID: foundproject._id
            })
              .then(image => {
                console.log(image)
                res.json(image)
                console.log(image)
                foundproject.imageIDs.push(image)
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