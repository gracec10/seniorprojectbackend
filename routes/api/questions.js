const express = require("express");
const cors = require("cors");
const router = express.Router();
router.use(cors());
const jwtDecode = require('jwt-decode')

// Load Question model, load user model
const Question = require("../../models/Question");
const Project = require("../../models/Project");

//GET
router.get('/:projectID', (req, res) => {
    Question.find()
      .then(questions => res.json(questions))
      .catch(err => console.log(err))
  })
  
//POST
router.post('/:projectID', (req, res) => {
    Project.findById(req.params.projectID).then(foundproject => {
      Question.create({
        content: req.body.content,
        type: req.body.type,
        projectID: foundproject._id
      })
        .then(question => {
          res.json(question)
          foundproject.questionIDs.push(question)
        })
        .then(_ => foundproject.save())
        .catch(err => console.log(err))
    })
  })

//FIND ONE AND SHOW
router.get('/:projectID/:id', (req, res) => {
  Project.findById(req.params.projectID).then(foundproject => {
    Question.findById({ _id: req.params.id })
      .then(question => {
        res.json(question)
      })
      .catch(err => {
        console.log(err)
      })
  })
})

//FIND ONE AND DELETE
router.delete('/:projectID/:id', (req, res) => {
    Project.findById(req.params.projectID).then(foundproject => {
      Question.findOneAndDelete({
        _id: req.params.id
      })
        .then(deletedQuestion => {
          res.json(deletedQuestion)

        })
        .then(_ => foundproject.save())  
        .catch(err => console.log(err))
    })
  })

module.exports = router