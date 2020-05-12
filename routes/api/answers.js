const express = require("express");
const cors = require("cors");
const router = express.Router();
router.use(cors());
const jwtDecode = require('jwt-decode')

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
router.post('/answer', (req, res) => {
    User.findById(jwtDecode(req.headers.authorization).id).then(founduser => {
        Project.findById(req.body.projectId).then(foundproject => {
            Image.findById(req.body.imageId).then(foundimage => {
                Question.findById(req.body.questionId).then(foundquestion => {
                    console.log("projectId--"+req.body.projectId+"  imageId--"+req.body.imageId);
                    console.log("answer--"+req.body.content+"  questionId--"+req.body.questionId);
                    Answer.create({
                        content: req.body.content,
                        userID: founduser._id,
                        projectID: foundproject._id,
                        imageID: foundimage._id,
                        questionID: foundquestion._id
                    })
                    .then(answer => {
                        res.json(answer)
                        foundquestion.answers.push(answer)
                        foundimage.answers.push(answer)
                    })
                    .then(_ => {
                        foundquestion.save()
                        foundimage.save()
                    })
                    .catch(err => console.log(err))
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