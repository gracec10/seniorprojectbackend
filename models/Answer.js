const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const AnswerSchema = new Schema({
    content: { // content of the answer
        type: String,
        required: true
    },
    projectID: {
        type: Schema.Types.ObjectId,
        ref: 'questions'
    },
    questionID: {
        type: Schema.Types.ObjectId,
        ref: 'questions'
    },
    imageID: {
        type: Schema.Types.ObjectId,
        ref: 'images'
    },
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
});
module.exports = Answer = mongoose.model("answers", AnswerSchema);