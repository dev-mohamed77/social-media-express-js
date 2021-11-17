const router = require("express").Router();
const Post = require("../model/post");
const User = require("../model/user");
const authorization = require("../middleware/auth");
const multer = require("multer");
const controller = require("../controller/post");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./images/posts");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now().toString() + file.originalname);
    },
});

const uploadPost = multer({ storage: storage });


// create Post
router.post("/create", authorization.verifyUser, uploadPost.single("image"), controller.createPost);


// Update Post
router.put("/update/:id", authorization.verifyUser, uploadPost.single("image"), controller.updatePost);



// Delete Post
router.delete("/delete/:id", authorization.verifyUser, controller.deletePost);


// Get Post Details
router.get("/:id", authorization.verifyUser, controller.getPostDetails);



// Get All User Posts
router.get("/allUserPosts/:id", authorization.verifyUser, controller.getAllUserPosts);


// Get All Post 
router.get("/all/admin", controller.getAllPostsByAdmin);



// Get All Followings Posts Timeline
router.get("/", authorization.verifyUser, controller.getAllFollowingsPoststimeline);



// update like and unlike in post
router.put("/:id/likeAndUnlike", authorization.verifyUser, controller.updateLikeAndUnLikeinPost);



// update comments in post
router.put("/:id/comments", authorization.verifyUser, controller.updateAddCommentsinPost);



module.exports = router;