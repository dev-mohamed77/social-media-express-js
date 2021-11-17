const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");




const register = async (req, res, next) => {

    try {

        const hash = await bcrypt.hash(req.body.password, 10);

        const newUser = User({
            username: req.body.username,
            email: req.body.email,
            phone: req.body.phone,
            password: hash
        });

        const user = await newUser.save();

        const { password, __v, ...data } = user._doc;

        res.status(201).json({
            status: true,
            message: "successfully registered",
            data: data
        });


    } catch (err) {

        res.status(500).json({
            status: false,
            message: err.message
        });
    }

}




// Login

const login = async (req, res, next) => {

    try {

        const user = await User.findOne({ username: req.body.username });
        !user && res.status(404).json({ status: false, message: "Worng Username" });

        const pass = await bcrypt.compare(req.body.password, user.password);
        !pass && res.status(404).json({ status: false, message: "Worng Password" });

        const token = jwt.sign({
            id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
        },
            "You Can",
            { expiresIn: "2d" },
        );

        const { password, __v, ...data } = user._doc;

        res.status(200).json({
            status: true,
            message: "Login Successfully",
            data: data,
            token: token,
        });

    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message
        });
    }

}



// Profile

const profile = async (req, res, next) => {

    try {
        const user = await User.findById(req.params.id).populate("followers following", "username email image ");

        if (user) {
            res.status(200).json({
                status: true,
                message: null,
                data: user,
            });
        } else {
            res.status(404).json({
                status: false,
                message: "User is not exist",
            });
        }

    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message
        });

    }

}


// get All User by Admin
const getAllUserByAdmin = async (req, res, next) => {

    try {

        const users = await User.find().populate("followers following", "username email image ");

        res.status(200).json({
            status: true,
            message: null,
            length: users.length,
            data: users
        });

    } catch (err) {

        res.status(500).json({
            status: false,
            message: err.message
        });
    }
}



// updeteProfile

const updateProfile = async (req, res, next) => {

    console.log(req.files)

    try {

        const updateUser = {
            username: req.body.username,
            email: req.body.email,
            fullName: req.body.fullName,
            phone: req.body.phone,
            pio: req.body.pio,
            image: req.files.image[0].path,
            coverImage: req.files.coverImage[0].path,
            country: req.body.country,
            city: req.body.city,
            relationship: req.body.relationship,

        }

        try {

            const user = await User.findByIdAndUpdate(req.params.id, { $set: updateUser }, { new: true });

            if (user) {
                res.status(200).json({
                    status: true,
                    message: "User data has been updated successfully",
                    data: user,
                });

            } else {
                res.status(404).json({
                    status: false,
                    message: "User is not exist",
                });
            }

        } catch (err) {

            res.status(500).json({
                status: false,
                message: err.message
            });
        }


    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message
        });

    }


}


// Delete Profile or User

const deleteProfile = async (req, res, next) => {

    try {

        const user = await User.findByIdAndDelete(req.params.id);

        if (user) {

            res.status(200).json({
                status: true,
                message: "User has been delete successfully",
            });

        } else {

            res.status(200).json({
                status: true,
                message: "User not exsit",
            });

        }

    } catch (err) {

        res.status(500).json({
            status: false,
            message: err.message
        });

    }

}


// Update Add Followers And Followings
const addFollowersAndFollowings = async (req, res, next) => {

    if (req.user.id !== req.params.id) {
        try {

            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.user.id);

            if (!user.followers.includes(req.user.id)) {

                await user.updateOne({ $push: { followers: req.user.id } });
                await currentUser.updateOne({ $push: { following: req.params.id } });

                res.status(200).json({
                    status: true,
                    message: "User has been followed",
                });

            } else {

                res.status(404).json({
                    status: false,
                    message: "you allready follow this user",
                });

            }


        } catch (err) {

            res.status(500).json({
                status: false,
                message: err.message
            });

        }


    } else {
        res.status(404).json({
            status: false,
            message: "You can't follow yourself",
        })
    }
}



// Remove Followers And Followings 

const removeFollowersAndFollowings = async (req, res, next) => {


    if (req.user.id !== req.params.id) {

        try {



            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.user.id);

            if (user.followers.includes(req.user.id)) {

                await user.updateOne({ $pull: { followers: req.user.id } });
                await currentUser.updateOne({ $pull: { following: req.params.id } });

                res.status(200).json({
                    status: true,
                    message: "User has been unfollowed",
                });

            } else {

                res.status(404).json({
                    status: false,
                    message: "you don't follow this user",
                });

            }


        } catch (err) {

            res.status(500).json({
                status: false,
                message: err.message
            });

        }


    } else {
        res.status(404).json({
            status: false,
            message: "You cant unfollow yourself",
        })
    }
}


module.exports = {
    register,
    login,
    profile,
    getAllUserByAdmin,
    updateProfile,
    deleteProfile,
    addFollowersAndFollowings,
    removeFollowersAndFollowings,

}