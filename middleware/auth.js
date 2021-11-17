
const jwt = require("jsonwebtoken");

const verifyUser = (req, res, next) => {

    const authorization = req.headers.authorization;

    if (authorization) {

        const token = authorization.split(" ")[1];

        jwt.verify(token, "You Can", (err, user) => {
            if (err) res.status(404).json({ status: false, message: "Token is valid", });

            req.user = user;
            next();

        });
    } else {
        res.status(404).json({
            status: false,
            message: "You are not authenticated"
        })
    }

}


const verifyUserAndAdmin = (req, res, next) => {

    verifyUser(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {

            res.status(404).json({
                status: false,
                message: "You can't access the information , You are not authorized",
            });

        }
    });

}


const verifyAdmin = (req, res, next) => {

    verifyUser(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            res.status(404).json({
                status: false,
                message: "You are not Admin , You are not authorized",
            });
        }
    });

}


module.exports = {
    verifyUser,
    verifyUserAndAdmin,
    verifyAdmin
}