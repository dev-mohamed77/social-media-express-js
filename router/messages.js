
const router = require("express").Router()
const authorization = require("../middleware/auth");
const controller = require("../controller/messages");


// add message
router.post("/", authorization.verifyUser, controller.addMessage);



// get message
router.get("/:conversationsID", authorization.verifyUser, controller.getMessage);



// delete message
router.delete("/:messageID", authorization.verifyUser, controller.deleteMessage);

module.exports = router;