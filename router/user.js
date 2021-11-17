const router = require("express").Router();
const multer = require("multer");
const authorization = require("../middleware/auth");
const controller = require("../controller/user");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./images/users");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now().toString() + "--" + file.originalname);
    },
});

const upload = multer({ storage: storage, limits: { fileSize: "1mb" } });


// register

router.post("/register", controller.register);


//login
router.post("/login", controller.login);



// profile
router.get("/profile/:id", authorization.verifyUser, controller.profile);



// Get All User

router.get("/all", authorization.verifyAdmin, controller.getAllUserByAdmin);



// Update User

router.put("/profile/:id", authorization.verifyUserAndAdmin, upload.fields([{ name: "image", maxCount: 1 }, { name: "coverImage", maxCount: 1 }]), controller.updateProfile);


//Delete User

router.delete("/profile/:id", authorization.verifyUserAndAdmin, controller.deleteProfile);



// Update Followers and Following

router.put("/profile/:id/followers", authorization.verifyUser, controller.addFollowersAndFollowings);



// UnFollowers and Un Followings

router.put("/profile/:id/unfollowers", authorization.verifyUser, controller.removeFollowersAndFollowings);




module.exports = router;