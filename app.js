const createError = require("http-errors")
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const usersRouter = require("./router/user");
const postsRouter = require("./router/post");
const storiesRouter = require("./router/story");
const conversationsRouter = require("./router/conversations");
const messagesRouter = require("./router/messages");

var app = express();


app.use(cors(
    origin = "*"
));

mongoose.connect("mongodb://localhost/socialmedia", { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) {
        console.log(err);
        return
    } else {
        console.log("Connecting to DB");
    }
});


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use("/api/user", usersRouter);
app.use("/api/post", postsRouter);
app.use("/api/stories", storiesRouter);
app.use("/api/conversations", conversationsRouter);
app.use("/api/messages", messagesRouter);



// catch 404 and forward to error handler=
app.use(function (req, res, next) {
    next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.status(500).json({
        status: false,
        message: err.message
    })
});


module.exports = app;




module.exports = app;