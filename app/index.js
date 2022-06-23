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