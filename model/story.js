const mongoose = require("mongoose");

const storySchema = mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    image :{
        type: String,
        default:"",
    },
    text: {
        type: String,
        min: 10,
        default:""
    }
} , {timestamps: true});


module.exports = mongoose.model("Story" , storySchema);