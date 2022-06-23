const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const io = new Server();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");


// Globals Vars
let count_users = 0;
let online_users = [];

// Express Config
const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static("public"))
app.use(cookieParser());

// Routes
app.get("/", (req, res) => {

    let { username } = req.cookies;
    if (username === undefined) {
        res.sendFile(__dirname + "/access_room.html");
    }
    else {
        res.sendFile(__dirname + "/index.html");
    }

});

app.post("/setusername", (req, res) => {
    let { chooseUsername } = req.body;
    if (chooseUsername !== undefined) {
        res.cookie("username", chooseUsername);
        res.redirect("/");
    }
});

app.get("/exit",  (req, res) => {
    let { username } = req.cookies;
    res.clearCookie("username");
    res.redirect("/");
});

// IO Config 
io.listen(server);

// IO Events 
io.on("connection", (socket) => {
    
    // Increase users counter
    count_users++;

    // Update users counter
    io.emit("updateCounter", count_users);

    // Disconnect user
    socket.on("disconnect", () => {
        count_users--;
        io.emit("updateCounter", count_users);
        io.emit("updateList", online_users);

    });

    // Disc User
    socket.on("discuser", (user) => {
        let index = online_users.indexOf(user);
        if (index != -1){
            online_users.splice(index, 1);
        }
    });

    // Say hi 
    socket.on("hi", (user) => {
        online_users.push(user);
        io.emit("updateList", online_users);
    });

    // Send data
    socket.on("sender", (data) => {
        io.emit("sender", data);
    });

});

// Start Server
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}...`);
});