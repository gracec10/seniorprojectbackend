const express = require("express");
const cors = require("cors");
const router = express.Router();
router.use(cors());

// Load Answer model, load Image model
const Image = require("../../models/Image");
const Answer = require("../../models/Answer");

// GET answers for an project
router.get('/:projectID', (req, res) => {
    Project.findById(req.params.projectID).then(foundproject => {
        Answer.find({ projectID: foundproject })
            .then(answers => res.json(answers))
            .catch(err => console.log(err))
    })
})

// GET answers for a question?
// GET answers for an image?

//POST (uses project, question, image, user)
router.post('/:projectID/:imageID/:questionID', (req, res) => {
    User.findById(jwtDecode(req.headers.authorization).id).then(founduser => {
        Project.findById(req.params.projectId).then(foundproject => {
            Image.findById(req.params.imageID).then(foundimage => {
                Question.findById(req.params.questionID).then(foundquestions => {
                    Answer.create({
                        content: req.body.content,
                        userID: founduser._id,
                        projectID: foundproject._id,
                        imageID: foundimage._id,
                        questionID: foundquestion._id
                    })
                })
            })
        })
    })
})

// add in a put to edit an answer

//FIND ONE AND SHOW -- fix this? -- not accurate
    // router.get('/:projectID/:id', (req, res) => {
    //     Project.findById(req.params.projectID).then(foundproject => {
    //         Question.findById({ _id: req.params.id })
    //             .then(question => {
    //                 res.json(question)
    //             })
    //             .catch(err => {
    //                 console.log(err)
    //             })
    //     })
    // })

//FIND ONE AND DELETE -- not accurate
    // router.delete('/:projectID/:id', (req, res) => {
    //     Project.findById(req.params.projectID).then(foundproject => {
    //         Question.findOneAndDelete({
    //             _id: req.params.id
    //         })
    //             .then(deletedQuestion => {
    //                 res.json(deletedQuestion)

    //             })
    //             .then(_ => foundproject.save())
    //             .catch(err => console.log(err))
    //     })
    // })

    module.exports = router