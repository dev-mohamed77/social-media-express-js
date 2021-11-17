
const router = require("express").Router();
const Conversations = require("../model/conversations");
const authorization = require("../middleware/auth");
const controller = require("../controller/conversations");


// post conversations;
router.post("/", authorization.verifyUser, controller.addConversation);


//get conversations
router.get("/", authorization.verifyUser, controller.getConversation);


module.exports = router;