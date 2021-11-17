const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 5,
        max: 50,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 6,
    },
    phone: {
        type: String,
        min: 9,
        max: 25,
        unique: true,
        required: true,
    },
    fullName: {
        type: String,
        max: 100,
        default:""
    },
    pio: {
        type: String,
        max: 100,
        default:""
    },
    image: {
        type: String,
        default:""
    },
    coverImage: {
        type: String,
        default:""
    },
    country: {
        type: String,
        max: 70,
        default:""
    },
    city: {
        type: String,
        max: 70,
        default:""
    },
    relationship: {
        type: Number,
        enum: [1, 2, 3],
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    followers: {
        type: Array,
        ref: "User",
        default: [],
    },
    following: {
        type: Array,
        ref: "User",
        default: [],
    },
}, { timestamps: true });


module.exports = mongoose.model("User", userSchema);