const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ImageSchema = new Schema({
    file: { // TODO: make it a real image instead of text
        type: String,
        required: true
    },
    name: {
        type: String
    },
    path: {
        type: String
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
    },
    userID: { // which user uploaded it
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
});
module.exports = Image = mongoose.model("images", ImageSchema);
