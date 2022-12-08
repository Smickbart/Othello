const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { validMove, initializeGame, getMove } = require("./modules/game");

app.set("view engine", "pug");
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render("index");
});

io.on("connection", (socket) => {
    console.log(`${io.engine.clientsCount} user${io.engine.clientsCount > 1 ? 's are' : ' is'} connected`);
    if(io.engine.clientsCount == 2) {
        console.log("Initialising game...");
        io.emit("initialise", initializeGame());
    }
    socket.on("move", (move) => {
        if(validMove(move)) {
            io.emit("update ui", getMove())
        }
    });
});

server.listen(3000, () => {
    console.log("Listening on port: 3000");
});