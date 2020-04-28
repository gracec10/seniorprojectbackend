const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ImageSchema = new Schema({
    file: { // TODO: make it a real image instead of text
        type: String,
        required: true
    },
    answers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'answers'
        }
    ],
    userID: { // which user uploaded it
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
});
module.exports = Answer = mongoose.model("answers", AnswerSchema);