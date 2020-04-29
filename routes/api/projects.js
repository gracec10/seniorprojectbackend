const express = require("express");
const cors = require("cors");
const router = express.Router();
router.use(cors());
const jwtDecode = require('jwt-decode')

// Load Project model, load user model
const Project = require("../../models/Project");
const User = require("../../models/User");

// GET projects for one user
router.get('/', (req, res) => {
  User.findById(jwtDecode(req.headers.authorization).id).then(founduser => {
    Project.find()
      .then(projects => res.json(projects))
      .catch(err => console.log(err))
  })
})
  
//POST
router.post('/', (req, res) => {
    User.findById(jwtDecode(req.headers.authorization).id).then(founduser => {
      Project.create({
        title: req.body.title,
        description: req.body.description,
        adminIDs: founduser._id // not sure if this works for multiple admins yet
      })
        .then(project => {
          res.json(project)
          founduser.projectAdminIDs.push(project)
        })
        .then(_ => founduser.save())
        .catch(err => console.log(err))
    })
  })

// add other researchers

//FIND ONE AND SHOW
router.get('/:id', (req, res) => {
  User.findById(jwtDecode(req.headers.authorization).id).then(founduser => {
    Project.findById({ _id: req.params.id })
      .then(project => {
        res.json(project)
      })
      .catch(err => {
        console.log(err)
      })
  })
})

//FIND ONE AND DELETE
router.delete('/:id', (req, res) => {
    User.findById(jwtDecode(req.headers.authorization).id).then(founduser => {
      Project.findOneAndDelete({
        _id: req.params.id
      })
        .then(deletedProject => {
          res.json(deletedProject)
        })
        .then(_ => founduser.save())  
        .catch(err => console.log(err))
    })
  })

module.exports = router