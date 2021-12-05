const io = require("socket.io")(5001, {
    cors: {
        origin: "http://localhost:3000"
    }
});

let users = [];

const addUser = (userId, socketId) => {
    !users.some(user=>user.userId === userId) &&
        users.push({ userId, socketId })
}

const getUser = (userId) => {
    return users.find(user=>user.userId === userId);
}

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId)
}

io.on("connection", (socket) => {
    
    //when connect
    socket.on("addUser", userId => {
        if(userId){
            console.log("a user connected! id: " + userId);
            addUser(userId, socket.id);
            io.emit("getUsers", users);
        }
    })

    //send and get messages
    socket.on("sendNotification", ({senderId, receiverId}) => {
        const user = getUser(receiverId);
        console.log(user);
        if(user){
            io.to(user.socketId).emit("getNotification", {
                senderId
            })
        }
    });

    //when disconnect
    socket.on("disconnect", () => {
        console.log("a user disconnected! id: " + socket.id);
        removeUser(socket.id)
        io.emit("getUsers", users);
    })
})

