const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const QuestionSchema = new Schema({
    content: { // content of the question
        type: String,
        required: true
    },
    description: { // question description
        type: String
    },
    type: { // type of question: Yes/no, category etc.
        type: String
    },
    categories: { // If question type is category, these are the categories.  Else, empty array
        type: Array
    },
    required: {
        type: Boolean
    },
    answers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'answers'
        }
    ],
    projectID: {
            type: Schema.Types.ObjectId,
            ref: 'projects'
    }
}); 
module.exports = Question = mongoose.model("questions", QuestionSchema);