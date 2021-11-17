const mongoose = require("mongoose");

const messagesSchema = mongoose.Schema({
    conversationsID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversations",
        required: true,
    },
    senderID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    message: {
        type: String,
        required: true
    },
}, { timestamps: true });


module.exports = mongoose.model("Messages", messagesSchema);