const Messages = require("../model/messages");
const Conversations = require("../model/conversations");


// Add Message 
const addMessage = async (req, res, next) => {

    const newMessages = Messages({
        conversationsID: req.body.conversationsID,
        senderID: req.user.id,
        message: req.body.message
    });

    try {

        const conversations = await Conversations.findById(newMessages.conversationsID);

        if (conversations.members.includes(req.user.id)) {

            const message = await newMessages.save();

            res.status(200).json({
                status: true,
                message: "Message has been Add Successfully",
                data: message
            });
        } else {
            res.status(404).json({
                status: false,
                message: "You cannot enter this conversation",

            });
        }

    } catch (err) {
        res.status(404).json({
            status: false,
            message: err.message,
        });
    }
}




// get message

const getMessage = async (req, res, next) => {

    try {
        const conversations = await Conversations.findById(req.params.conversationsID);

        if (conversations.members.includes(req.user.id)) {

            const messages = await Messages.find({ conversationsID: req.params.conversationsID }).populate("conversationsID senderID", "members username fullName image");

            res.status(200).json({
                status: true,
                message: null,
                data: messages,
            });

        } else {

            res.status(404).json({
                status: false,
                message: "You are not allowed, You can't see messages",
            });
        }

    } catch (err) {

        res.status(404).json({
            status: false,
            message: err.message,
        });
    }
}



// Delete Message 

const deleteMessage = async (req, res, next) => {

    try {
        const message = await Messages.findById(req.params.messageID);



        console.log(message);
        console.log(req.user.id);

        if (message.senderID == req.user.id) {

            await message.deleteOne({ senderID: req.user.id });

            if (message) {

                res.status(200).json({
                    status: true,
                    message: "Message has been delete successfully",
                });
            } else {

                res.status(404).json({
                    status: false,
                    message: "Message is not exist",
                });
            }

        } else {

            res.status(404).json({
                status: false,
                message: "You are not allowed, You can't delete messages",
            });
        }


    } catch (err) {

        res.status(404).json({
            status: false,
            message: err.message,
        });
    }
}




module.exports = {
    addMessage,
    getMessage,
    deleteMessage
}