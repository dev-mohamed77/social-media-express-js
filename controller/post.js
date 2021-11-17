const Post = require("../model/post");
const User = require("../model/user");


// create post

const createPost = async (req, res, next) => {

    const newPost = new Post({
        userID: req.user.id,
        description: req.body.description,
        image: req.file.path
    });

    try {


        const post = await newPost.save();

        res.status(201).json({
            status: true,
            message: "Post has been Add Successfully",
            data: post
        })

    } catch (err) {
        res.status(404).json({
            status: false,
            message: err.message
        });
    }
}


// Update Post

const updatePost = async (req, res, next) => {

    const updatePost = {
        description: req.body.description,
        image: req.file.path,
    }

    try {

        if (req.user.id === req.body.userID) {

            const post = await Post.findByIdAndUpdate(req.params.id, { $set: updatePost }, { new: true });

            if (post) {
                res.status(200).json({
                    status: true,
                    message: "Post has been Update Successfully",
                    date: post
                });
            } else {

                res.status(404).json({
                    status: false,
                    message: "Post is not exist",
                });

            }

        } else {

            res.status(404).json({
                status: false,
                message: "You are not allowed, you cannot edit this post",
            });

        }

    } catch (err) {

        res.status(404).json({
            status: false,
            message: err.message
        });

    }

}


// Delete Post


const deletePost = async (req, res, next) => {

    try {
        if (req.user.id === req.body.userID) {

            const deletePost = await Post.findByIdAndDelete(req.params.id);

            if (deletePost) {

                res.status(200).json({
                    status: true,
                    message: "Post has been Delete Successfully",
                    date: deletePost
                });

            } else {

                res.status(404).json({
                    status: false,
                    message: "Post is not exist",
                });

            }

        } else {

            res.status(404).json({
                status: false,
                message: "You are not allowed, you cannot edit this post",
            });

        }

    } catch (err) {
        res.status(404).json({
            status: false,
            message: err.message
        });
    }

}



// Get Post Details

const getPostDetails = async (req, res, next) => {

    try {

        const post = await Post.findById(req.params.id).populate("userID likes comments.id", "username fullName image");

        if (post) {

            res.status(200).json({
                status: true,
                message: null,
                date: post
            });

        } else {

            res.status(404).json({
                status: false,
                message: "Post is not exist",
            });
        }

    } catch (err) {

        res.status(404).json({
            status: false,
            message: err.message
        });

    }
}



// Get All User Posts

const getAllUserPosts = async (req, res, next) => {

    try {

        const posts = await Post.find({ userID: req.params.id }).populate("userID likes comments.id", "username fullNames image");

        if (posts) {

            res.status(200).json({
                status: true,
                message: null,
                date: posts
            });
        } else {

            res.status(404).json({
                status: false,
                message: "User is not exist",
            });

        }

    } catch (err) {

        res.status(404).json({
            status: false,
            message: err.message
        });

    }

}


// Get All Posts By Admin

const getAllPostsByAdmin = async (req, res, next) => {

    try {

        const posts = await Post.find().populate("userID likes comments.id", "username fullName image");
        res.status(200).json({
            status: true,
            message: null,
            date: posts
        });

    } catch (err) {
        res.status(404).json({
            status: false,
            message: err.message
        });

    }

}



// Get All Followings Posts Timeline
const getAllFollowingsPoststimeline = async (req, res, next) => {

    try {

        const currentUser = await User.findById(req.user.id);

        const userPost = await Post.find({ userId: currentUser._id }).populate("userID likes comments.id", "username fullName image");

        const freindPosts = await Promise.all(
            currentUser.following.map((freindID) => {
                return Post.find({ userID: freindID });
            })
        );

        res.status(200).json({
            status: true,
            message: null,
            data: userPost.concat(...freindPosts)
        });

    } catch (err) {
        res.status(404).json({
            status: false,
            message: err.message
        });

    }
}



// Update like and unlike in post

const updateLikeAndUnLikeinPost = async (req, res, next) => {

    try {
        const post = await Post.findById(req.params.id);

        if (!post.likes.includes(req.user.id)) {

            await post.updateOne({ $push: { likes: req.user.id } });

            res.status(200).json({
                status: true,
                message: "Post liked successfully",
            });

        } else {
            await post.updateOne({ $pull: { likes: req.user.id } });

            res.status(200).json({
                status: true,
                message: "The like has been canceled successfully",
            });
        }

    } catch (err) {
        res.status(404).json({
            status: false,
            message: err.message
        });
    }

}



// Update Add Comments in post

const updateAddCommentsinPost = async (req, res, next) => {

    const comment = {
        id: req.user.id,
        comment: req.body.comment,
    }


    try {

        const post = await Post.findById(req.params.id);

        await post.updateOne({ $push: { comments: comment } });

        res.status(200).json({
            status: true,
            message: "Comment added successfully",
            data: post
        });

    } catch (err) {

        res.status(404).json({
            status: false,
            message: err.message
        });
    }


}



module.exports = {
    createPost,
    updatePost,
    deletePost,
    getPostDetails,
    getAllUserPosts,
    getAllPostsByAdmin,
    getAllFollowingsPoststimeline,
    updateLikeAndUnLikeinPost,
    updateAddCommentsinPost,
}