const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ProjectSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    adminIDs: [
        {
            type: Schema.Types.ObjectId,
            ref: 'users'
        }
    ],
    researcherIDs: [
        {
            type: Schema.Types.ObjectId,
            ref: 'users'
        }
    ],
    imageIDs: [
        {
            type: Schema.Types.ObjectId,
            ref: 'images'
        }
    ],
    questionIDs: [
        {
            type: Schema.Types.ObjectId,
            ref: 'questions'
        }
    ]
});
module.exports = Project = mongoose.model("projects", ProjectSchema);