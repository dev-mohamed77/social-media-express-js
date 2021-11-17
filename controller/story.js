const Story = require("../model/story");
const User = require("../model/user");

// Add Story
const addStory = async (req, res, next) => {

    const newStory = Story({
        userID: req.user.id,
        image: req.file.path,
        text: req.body.text
    });

    try {

        const story = await newStory.save();

        res.status(201).json({
            status: true,
            message: "Story has been Add Successfully",
            data: story
        });

    } catch (err) {
        res.status(404).json({
            status: false,
            message: err.message
        });
    }

}



// Update Story

const updateStory = async (req, res, next) => {

    const storyUpdate = {
        image: req.file.path,
        text: req.body.text
    }

    try {

        if (req.user.id === req.body.userID) {
            console.log(req.user.id);
            const story = await Story.findByIdAndUpdate(req.params.id, { $set: storyUpdate }, { new: true });
            if (story) {
                console.log(story);
                res.status(200).json({
                    status: true,
                    message: "Story has been Update Successfully",
                    date: story
                });
            } else {

                res.status(404).json({
                    status: false,
                    message: "The story no longer exists",
                });
            }
        } else {

            res.status(404).json({
                status: false,
                message: "You are not allowed, you cannot edit this Story",
            });

        }

    } catch (err) {

        res.status(404).json({
            status: false,
            message: err.message
        });
    }

}





// Delete Story
const deleteStory = async (req, res, next) => {

    try {

        if (req.user.id === req.body.userID) {

            const storyDelete = await Story.findByIdAndDelete(req.params.id);

            if (storyDelete) {
                res.status(200).json({
                    status: true,
                    message: "Story has been delete successfully",
                });
            } else {

                res.status(404).json({
                    status: false,
                    message: "story is not exist",
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




// Get Story Details 

const getStoryDetails = async (req, res, next) => {

    try {

        const story = await Story.findById(req.params.id).populate("userID", "username fullName image");

        if (story) {
            res.status(200).json({
                status: true,
                message: null,
                data: story,
            })
        } else {

            res.status(404).json({
                status: false,
                message: "story is not exist",
            });
        }

    } catch (err) {

        res.status(404).json({
            status: false,
            message: err.message
        });
    }

}


// get All User Stories
const getAllUserStories = async (req, res, next) => {

    try {

        const userStories = await Story.find({ userID: req.params.id }).populate("userID", "username fullName image");
        if (userStories) {
            res.status(200).json({
                status: true,
                message: null,
                date: userStories
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


// Get All User By Admin

const getAllUserByAdmin = async (req, res, next) => {

    try {
        const stories = await Story.find().populate("userID", "username email fullName image");
        res.status(200).json({
            status: true,
            message: null,
            data: stories,
        })
    } catch (err) {

        res.status(404).json({
            status: false,
            message: err.message
        });
    }

}


//get All Followers Stories Timeline

const getAllFollowersStoriesTimeLine = async (req, res, next) => {

    try {

        const currentUser = await User.findById(req.user.id);

        const userStories = await Story.find({ userID: currentUser._id }).populate("userID", "username fullName image");

        const freindStories = await Promise.all(
            currentUser.following.map((freindID) => {
                return Story.find({ userID: freindID }).populate("userID", "username fullName image");
            })
        );

        res.status(200).json({
            status: true,
            data: userStories.concat(...freindStories)
        });

    } catch (err) {

        res.status(404).json({
            status: false,
            message: err.message
        });
    }

}


module.exports = {
    addStory,
    updateStory,
    deleteStory,
    getStoryDetails,
    getAllUserStories,
    getAllUserByAdmin,
    getAllFollowersStoriesTimeLine,
}