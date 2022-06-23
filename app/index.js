const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const io = new Server();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const users = require("./users.json");


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