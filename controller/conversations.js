const Conversations = require("../model/conversations");



// add conversation
const addConversation = async (req, res, next) => {

    const myconversations = Conversations({
        members: [
            req.user.id, req.body.receiverID
        ]
    });

    try {

        const conversations = await myconversations.save();

        res.status(200).json({
            status: true,
            message: "Conversations ha been Add successfully",
            data: conversations,
        });

    } catch (err) {
        res.status(404).json({
            status: false,
            message: err.message,
        });

    }
}


// get Conversation

const getConversation = async (req, res, next) => {

    try {

        const conversations = await Conversations.find({ members: req.user.id }).populate("members", "username fullname image");

        res.status(200).json({
            status: true,
            message: null,
            data: conversations,
        })
    } catch (err) {

        res.status(404).json({
            status: false,
            message: err.message,
        });
    }

}


module.exports = {
    addConversation,
    getConversation,
}
