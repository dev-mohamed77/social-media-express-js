const router = require("express").Router();
const Story = require("../model/story");
const User = require("../model/user");
const authorization = require("../middleware/auth");
const multer = require("multer");
const controller = require("../controller/story");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./images/stories");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now().toString() + file.originalname);
    },
});

const uploadStory = multer({ storage: storage });


// Add Stroy 
router.post("/create", authorization.verifyUser, uploadStory.single("image"), controller.addStory);


// Update Story
router.put("/update/:id", authorization.verifyUser, uploadStory.single("image"), controller.updateStory);


// Delete Story 
router.delete("/delete/:id", authorization.verifyUser, controller.deleteStory);


// Get Story Details
router.get("/:id", authorization.verifyUser, controller.getStoryDetails);


// Get All User Stories
router.get("/allUser/:id", authorization.verifyUser, controller.getAllUserStories);


// Get All Stories
router.get("/all/admin", controller.getAllUserByAdmin);


// Get All Followings Stories Timeline
router.get("/", authorization.verifyUser, controller.getAllFollowersStoriesTimeLine);


module.exports = router;