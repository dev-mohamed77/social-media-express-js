const mongoose = require("mongoose");

const conversationsSchema = mongoose.Schema({

    members: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            }
        ],
        require: true
    },

}, { timestamps: true });


module.exports = mongoose.model("Conversations", conversationsSchema);