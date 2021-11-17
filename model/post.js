const mongoose = require("mongoose");

const postSchema = mongoose.Schema({

    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    description: {
        type: String,
        default: "",
    },
    image: {
        type: String,
        default: "",
    },
    likes: {
        type: Array,
        ref: "User",
        default: [],
    },
    comments: {
        type: [{
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            comment: {
                type: String,
                required: true
            },
        }],
        default: [],
    }

}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);