const http = require("http");
const app = require("./app");
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = require("socket.io")(http);





// controlle socket io

let users = [];

const addUser = (userID, socketID) => {

    !users.some((user) => user.id === userID) && users.push({ userID, socketID })
}


const removeUser = (userID) => {
    users = users.filter((user) => user.userID !== userID);
}

const getUser = (userID) => {
    return users.find((user) => user.userID === userID);
}


// socket io

io.on("connection", (socket) => {

    // when connect

    console.log("A user Connected");

    // take userId and socketId from user
    socket.on("addUser", (userID) => {
        addUser(userID, socket.id);
        io.emit("getUsers", users);
    });


    // send message 
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        const user = getUser(receiverId);
        io.to(user.socketID).emit("getMessage", {
            senderId,
            text,
        });
    });


    // Send Notificaions
    socket.on("sendNotification", (senderID, receiverId, type) => {
        const receiver = getUser(receiverId);
        io.to(receiver.socketID).emit("getNotification", {
            senderID,
            type,
        });
    });

    //when disconnect
    socket.on("disconnect", () => {
        console.log("a user disconnect");
        removeUser(socket.id);
        io.emit("getUsers", users);
    });
});


// server 

server.listen(port, () => {
    console.log("Its Server Working " + port);
});

